const orderSchema = new mongoose.Schema({
  // ... existing fields
  location: String // store the user's location at the time of order
});