// backend/utils/advancedRecommendation.js
const axios = require('axios');

class AdvancedRecommendationEngine {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  // Personalized recommendations using AI
  async getPersonalizedRecommendations(user, products, limit = 10) {
    try {
      const userProfile = this.buildUserProfile(user, products);
      
      const prompt = this.createAIPrompt(userProfile, products);
      const aiSuggestions = await this.getAISuggestions(prompt);
      
      return this.rankProducts(aiSuggestions, products, user);
    } catch (error) {
      console.error('AI Recommendation error:', error);
      return this.getFallbackRecommendations(user, products, limit);
    }
  }

  buildUserProfile(user, products) {
    const recentPurchases = user.purchaseHistory
      .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
      .slice(0, 10);

    const favoriteCategories = this.extractCategories(user.purchaseHistory, products);
    
    return {
      businessType: user.businessType,
      location: user.location,
      purchasePattern: this.analyzePurchasePattern(user.purchaseHistory),
      favoriteCategories,
      budget: user.preferences.priceRange
    };
  }

  createAIPrompt(userProfile, products) {
    return `As a B2B retail AI consultant, analyze this business profile and suggest products that can increase Average Order Value by 15-20%.

Business Profile:
- Type: ${userProfile.businessType}
- Location: ${userProfile.location.city}, ${userProfile.location.state}
- Purchase Pattern: ${JSON.stringify(userProfile.purchasePattern)}
- Preferred Categories: ${userProfile.favoriteCategories.join(', ')}

Available Products: ${products.slice(0, 50).map(p => `${p.name} (${p.category}) - ₹${p.price}`).join(', ')}

Suggest 10 products with reasoning for AOV increase:`;
  }

  async getAISuggestions(prompt) {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    }, {
      headers: { 'Authorization': `Bearer ${this.openaiApiKey}` }
    });

    return response.data.choices[0].message.content;
  }

  // Location-based trending products
  getLocationBasedTrending(products, userLocation, limit = 10) {
    return products
      .filter(product => 
        !product.locationPreference || 
        this.isProductRelevantForLocation(product, userLocation)
      )
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);
  }

  isProductRelevantForLocation(product, userLocation) {
    if (!product.locationPreference) return true;
    
    const { cities, states } = product.locationPreference;
    return states.includes(userLocation.state) || 
           cities.includes(userLocation.city);
  }

  // Collaborative filtering
  getCollaborativeRecommendations(user, allUsers, products, limit = 10) {
    const similarUsers = this.findSimilarUsers(user, allUsers);
    const recommendedProducts = this.extractProductsFromSimilarUsers(similarUsers, user);
    
    return products
      .filter(p => recommendedProducts.includes(p._id.toString()))
      .slice(0, limit);
  }

  findSimilarUsers(targetUser, allUsers) {
    return allUsers
      .filter(u => u._id.toString() !== targetUser._id.toString())
      .map(user => ({
        user,
        similarity: this.calculateUserSimilarity(targetUser, user)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
      .map(item => item.user);
  }
}

module.exports = new AdvancedRecommendationEngine();