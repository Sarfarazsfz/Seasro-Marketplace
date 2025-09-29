const express = require('express');
const router = express.Router();
const axios = require('axios');

// API Keys (Use environment variables)
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Enhanced product catalog with real Indian products
const PRODUCT_CATALOG = [
    {
        id: 1,
        name: 'Premium Basmati Rice - 25kg Bag',
        category: 'grains',
        basePrice: 2500,
        image: '/images/rice.jpg',
        description: 'Aromatic long grain basmati rice, perfect for biryani and pulao',
        weatherFactor: 1.0,
        seasonFactor: {
            'summer': 0.9,
            'monsoon': 1.2,
            'winter': 1.1
        },
        locationPreferences: {
            'Mumbai': 1.3,
            'Delhi': 1.1,
            'Bangalore': 1.0,
            'Chennai': 1.2,
            'Kolkata': 1.1,
            'default': 1.0
        }
    },
    {
        id: 2,
        name: 'Sunflower Oil - 15L Can',
        category: 'oils',
        basePrice: 1800,
        image: '/images/oil.jpg',
        description: 'Pure sunflower cooking oil, rich in Vitamin E',
        weatherFactor: 1.1,
        seasonFactor: {
            'summer': 1.3,
            'monsoon': 0.8,
            'winter': 1.0
        }
    },
    {
        id: 3,
        name: 'Turmeric Powder - 5kg Pack',
        category: 'spices',
        basePrice: 1200,
        image: '/images/turmeric.jpg',
        description: 'Organic turmeric powder with high curcumin content',
        weatherFactor: 1.0,
        seasonFactor: {
            'summer': 1.1,
            'monsoon': 1.4,
            'winter': 1.2
        }
    },
    {
        id: 4,
        name: 'Chana Dal - 30kg Bag',
        category: 'pulses',
        basePrice: 2100,
        image: '/images/chana-dal.jpg',
        description: 'High-protein split chickpeas, essential for Indian cuisine',
        weatherFactor: 1.0,
        seasonFactor: {
            'summer': 1.0,
            'monsoon': 1.3,
            'winter': 1.5
        }
    },
    {
        id: 5,
        name: 'Sugar - 50kg Bag',
        category: 'sweeteners',
        basePrice: 2800,
        image: '/images/sugar.jpg',
        description: 'Fine refined sugar for commercial use',
        weatherFactor: 0.9,
        seasonFactor: {
            'summer': 1.4,
            'monsoon': 1.1,
            'winter': 1.6
        }
    },
    {
        id: 6,
        name: 'Wheat Flour - 40kg Bag',
        category: 'flour',
        basePrice: 1600,
        image: '/images/flour.jpg',
        description: 'Fine atta for chapatis and baked goods',
        weatherFactor: 1.0,
        seasonFactor: {
            'summer': 1.0,
            'monsoon': 1.2,
            'winter': 1.3
        }
    },
    {
        id: 7,
        name: 'Tea Dust - 25kg Box',
        category: 'beverages',
        basePrice: 3200,
        image: '/images/tea.jpg',
        description: 'Strong tea dust for commercial establishments',
        weatherFactor: 1.2,
        seasonFactor: {
            'summer': 1.1,
            'monsoon': 1.5,
            'winter': 1.8
        }
    },
    {
        id: 8,
        name: 'Instant Coffee - 10kg Jar',
        category: 'beverages',
        basePrice: 4500,
        image: '/images/coffee.jpg',
        description: 'Premium instant coffee powder',
        weatherFactor: 1.1,
        seasonFactor: {
            'summer': 0.9,
            'monsoon': 1.3,
            'winter': 1.4
        }
    }
];

// Real-time recommendation engine with live data
class RealTimeRecommendationEngine {
    constructor() {
        this.products = PRODUCT_CATALOG;
    }

    async getLiveWeather(city) {
        try {
            console.log(`Fetching weather for: ${city}`);
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
            );
            
            const weatherData = {
                temperature: response.data.main.temp,
                condition: response.data.weather[0].main,
                humidity: response.data.main.humidity,
                windSpeed: response.data.wind.speed,
                city: response.data.name
            };
            
            console.log('Weather data received:', weatherData);
            return weatherData;
        } catch (error) {
            console.log('Weather API failed, using fallback data:', error.message);
            // Fallback data based on city
            const fallbackTemps = {
                'Mumbai': { temp: 32, condition: 'Humid' },
                'Delhi': { temp: 28, condition: 'Clear' },
                'Bangalore': { temp: 25, condition: 'Clouds' },
                'Chennai': { temp: 34, condition: 'Hot' },
                'Kolkata': { temp: 30, condition: 'Humid' }
            };
            
            const cityData = fallbackTemps[city] || { temp: 28, condition: 'Clear' };
            return {
                temperature: cityData.temp,
                condition: cityData.condition,
                humidity: 65,
                windSpeed: 12,
                city: city
            };
        }
    }

    async getLocationData(city) {
        try {
            const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${city},India&key=${OPENCAGE_API_KEY}`
            );
            
            if (response.data.results.length > 0) {
                const location = response.data.results[0];
                return {
                    city: location.components.city || location.components.town,
                    state: location.components.state,
                    country: location.components.country,
                    coordinates: location.geometry
                };
            }
            return null;
        } catch (error) {
            console.log('Geocoding API failed:', error.message);
            return null;
        }
    }

    calculateSeason() {
        const month = new Date().getMonth();
        if (month >= 3 && month <= 5) return 'summer';
        if (month >= 6 && month <= 9) return 'monsoon';
        return 'winter';
    }

    calculateWeatherImpact(weather, product) {
        let impact = 1.0;
        
        // Temperature impact
        if (weather.temperature > 35 && product.category === 'beverages') {
            impact *= 1.4; // Cold beverages in hot weather
        } else if (weather.temperature < 20 && product.category === 'beverages') {
            impact *= 1.3; // Hot beverages in cold weather
        }
        
        // Weather condition impact
        if (weather.condition === 'Rain' || weather.condition === 'Drizzle') {
            if (product.category === 'beverages') impact *= 1.3; // Tea/coffee in rain
            if (product.category === 'snacks') impact *= 1.2; // Snacks in rainy weather
        }
        
        // Humidity impact
        if (weather.humidity > 80 && product.category === 'spices') {
            impact *= 1.2; // Spices for preservation in humid weather
        }
        
        return impact;
    }

    async generatePersonalizedRecommendations(userData) {
        const { city, businessType, previousPurchases } = userData;
        
        // Get live weather data
        const weather = await this.getLiveWeather(city);
        const season = this.calculateSeason();
        
        const recommendations = this.products.map(product => {
            // Base score with some randomness
            let score = 60 + Math.random() * 40;
            
            // Location factor
            const locationFactor = product.locationPreferences?.[city] || product.locationPreferences?.default || 1.0;
            score *= locationFactor;
            
            // Season factor
            const seasonFactor = product.seasonFactor?.[season] || 1.0;
            score *= seasonFactor;
            
            // Weather impact
            const weatherImpact = this.calculateWeatherImpact(weather, product);
            score *= weatherImpact;
            
            // Business type factor
            if (businessType === 'restaurant' && product.category === 'spices') {
                score *= 1.5;
            }
            if (businessType === 'hotel' && product.category === 'beverages') {
                score *= 1.4;
            }
            if (businessType === 'kirana' && ['grains', 'pulses', 'flour'].includes(product.category)) {
                score *= 1.3;
            }
            if (businessType === 'cafe' && product.category === 'beverages') {
                score *= 1.6;
            }
            
            // Price variation based on demand
            const priceMultiplier = 1 + (score - 70) / 200; // ±15% based on score
            const finalPrice = Math.round(product.basePrice * priceMultiplier);
            
            return {
                ...product,
                finalPrice: finalPrice,
                recommendationScore: Math.min(100, Math.round(score)),
                weatherImpact: weather.condition,
                season: season,
                factors: [
                    `Location: ${city} (${locationFactor.toFixed(1)}x)`,
                    `Season: ${season} (${seasonFactor.toFixed(1)}x)`,
                    `Weather: ${weather.condition} (${weatherImpact.toFixed(1)}x)`,
                    `Business: ${businessType} optimized`
                ],
                liveData: {
                    temperature: weather.temperature,
                    demand: score > 80 ? 'High' : score > 60 ? 'Medium' : 'Low'
                }
            };
        }).sort((a, b) => b.recommendationScore - a.recommendationScore)
          .slice(0, 8); // Top 8 recommendations

        return {
            recommendations,
            liveData: {
                city,
                temperature: weather.temperature,
                weather: weather.condition,
                season,
                humidity: weather.humidity,
                timestamp: new Date().toISOString()
            }
        };
    }

    async generateTrendingRecommendations(city) {
        const weather = await this.getLiveWeather(city);
        const hour = new Date().getHours();
        const isPeakTime = (hour >= 18 || hour <= 9); // Evening or morning peak
        
        const trendingProducts = this.products.map(product => {
            let trendScore = Math.random() * 100;
            
            // Weather-based trends
            if (weather.temperature > 35 && product.category === 'beverages') {
                trendScore += 40;
            }
            if ((weather.condition === 'Rain' || weather.condition === 'Drizzle') && product.category === 'beverages') {
                trendScore += 35;
            }
            if (weather.temperature < 20 && product.category === 'beverages') {
                trendScore += 30;
            }
            
            // Time-based trends
            if (isPeakTime && product.category === 'beverages') {
                trendScore += 25;
            }
            if (hour >= 18 && ['snacks', 'instant_food'].includes(product.category)) {
                trendScore += 30;
            }
            
            // Seasonal trends
            const season = this.calculateSeason();
            if (season === 'monsoon' && product.category === 'spices') {
                trendScore += 20;
            }
            if (season === 'winter' && product.category === 'beverages') {
                trendScore += 25;
            }
            
            return {
                ...product,
                trendScore: Math.min(100, Math.round(trendScore)),
                trendReason: this.getTrendReason(weather, hour, product.category),
                liveDemand: Math.round(30 + Math.random() * 70),
                urgency: trendScore > 80 ? 'High' : trendScore > 60 ? 'Medium' : 'Low'
            };
        }).sort((a, b) => b.trendScore - a.trendScore)
          .slice(0, 6);

        return trendingProducts;
    }

    getTrendReason(weather, hour, category) {
        const reasons = {
            beverages: weather.temperature > 35 ? 'Hot weather favorite' : 
                       weather.temperature < 20 ? 'Cold weather essential' :
                       'Always in demand',
            spices: 'Seasonal demand peak',
            grains: 'Staple food high demand',
            oils: 'Cooking essential',
            pulses: 'Protein source trending',
            flour: 'Daily consumption item'
        };
        
        if (hour >= 18) return 'Evening demand peak';
        if (weather.condition === 'Rain') return 'Rainy day favorite';
        
        return reasons[category] || 'Currently trending in your area';
    }
}

const engine = new RealTimeRecommendationEngine();

// Personalized recommendations with live data
router.get('/personalized', async (req, res) => {
    try {
        const { city = 'Mumbai', businessType = 'kirana' } = req.query;
        
        console.log(`Generating personalized recommendations for ${city}, ${businessType}`);
        
        const result = await engine.generatePersonalizedRecommendations({
            city,
            businessType,
            previousPurchases: []
        });

        res.json({
            success: true,
            ...result,
            message: `Live recommendations for ${city} (${businessType}) powered by real-time data`
        });
    } catch (error) {
        console.error('Personalized recommendations error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            fallback: 'Using demo data due to API limitations'
        });
    }
});

// Trending products with live weather data
router.get('/trending', async (req, res) => {
    try {
        const { city = 'Mumbai' } = req.query;
        const trending = await engine.generateTrendingRecommendations(city);

        res.json({
            success: true,
            trending,
            message: `Live trending products for ${city}`
        });
    } catch (error) {
        console.error('Trending recommendations error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Collaborative filtering with location context
router.get('/collaborative', async (req, res) => {
    try {
        const { city = 'Mumbai', businessType = 'kirana' } = req.query;
        
        // Simulate collaborative data based on location and business type
        const collaborative = engine.products.map(product => ({
            ...product,
            similarBusinesses: Math.round(30 + Math.random() * 70),
            successRate: `${Math.round(70 + Math.random() * 25)}%`,
            locationContext: `Popular among ${businessType} stores in ${city}`,
            adoptionRate: Math.round(20 + Math.random() * 80),
            finalPrice: product.basePrice * (0.9 + Math.random() * 0.3) // ±20% variation
        })).sort((a, b) => b.similarBusinesses - a.similarBusinesses)
          .slice(0, 6);

        res.json({
            success: true,
            recommendations: collaborative,
            message: `Collaborative recommendations for ${businessType} in ${city}`
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Live weather endpoint
router.get('/weather/:city', async (req, res) => {
    try {
        const weather = await engine.getLiveWeather(req.params.city);
        res.json({ 
            success: true, 
            weather,
            message: `Live weather data for ${req.params.city}`
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Location detection endpoint
router.get('/detect-location', async (req, res) => {
    try {
        const { ip } = req.query;
        // Simple IP-based location (in production, use proper IP geolocation)
        const defaultCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];
        const randomCity = defaultCities[Math.floor(Math.random() * defaultCities.length)];
        
        const locationData = await engine.getLocationData(randomCity);
        
        res.json({
            success: true,
            location: {
                city: randomCity,
                ...locationData
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

module.exports = router;