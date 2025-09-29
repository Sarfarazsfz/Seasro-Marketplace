const Product = require('../models/Product');
const Order = require('../models/Order');

// Content-based recommendation: based on products the user has ordered
async function contentBasedRecommendations(userId, limit = 10) {
  // Get user's past orders
  const orders = await Order.find({ user: userId }).populate('products.product');
  if (orders.length === 0) {
    // If no orders, return trending products as fallback
    return getTrendingProducts('Unknown', limit);
  }

  // Extract product categories from ordered products
  const categories = [];
  orders.forEach(order => {
    order.products.forEach(item => {
      if (item.product && item.product.category) {
        categories.push(item.product.category);
      }
    });
  });

  // Find products in the same categories
  const recommendedProducts = await Product.find({
    category: { $in: categories },
    _id: { $nin: orders.flatMap(o => o.products.map(p => p.product._id)) } // exclude already bought
  }).limit(limit);

  return recommendedProducts;
}

// Trending products by location
async function getTrendingProducts(location, limit = 10) {
  // Aggregate orders by product count in the given location
  const trending = await Order.aggregate([
    // Lookup to get user's location? We need to join orders with users to get location.
    // Since our Order model does not have location, we need to change the Order model or populate user.
    // Alternatively, we can store location in Order when order is placed? Or we can join with User.

    // Let's assume we update the Order model to include location at the time of order.
    // We'll change the Order model to include location (string). Then:
    { $match: { location: location } },
    { $unwind: '$products' },
    { $group: { _id: '$products.product', count: { $sum: '$products.quantity' } } },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);

  // We need to populate product details because aggregate returns only product id and count.
  const productIds = trending.map(item => item._id);
  const products = await Product.find({ _id: { $in: productIds } });
  // Sort the products in the same order as trending? But aggregate may not preserve order after populate?
  // We can sort manually:
  const sortedProducts = [];
  productIds.forEach(id => {
    const product = products.find(p => p._id.equals(id));
    if (product) sortedProducts.push(product);
  });

  return sortedProducts;
}

// Hybrid recommendation (combine content-based and collaborative if we had it)
async function hybridRecommendations(userId, limit = 10) {
  // For now, we'll just use content-based
  return contentBasedRecommendations(userId, limit);
}

module.exports = {
  contentBasedRecommendations,
  getTrendingProducts,
  hybridRecommendations
};