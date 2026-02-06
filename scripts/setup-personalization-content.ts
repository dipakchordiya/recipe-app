/**
 * Setup Script for Location-Based Personalization Content
 * 
 * This script creates:
 * 1. Indian Cuisine category and recipes
 * 2. American Cuisine category and recipes
 * 3. Home page variants for different regions
 * 
 * Run with: npx ts-node scripts/setup-personalization-content.ts
 */

import contentstack from "@contentstack/management";

// Configuration - update these with your values
const API_KEY = process.env.CONTENTSTACK_API_KEY || "blt837255d7d0d157c5";
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "cs4b3b60b8ac28532fc37fbe37";
const ENVIRONMENT = "development";

// Initialize the client
const client = contentstack.client();
const stack = client.stack({ api_key: API_KEY, management_token: MANAGEMENT_TOKEN });

// ============ CATEGORIES ============
const categories = [
  {
    title: "Indian Cuisine",
    uid: "indian_cuisine",
    data: {
      name: "Indian Cuisine",
      emoji: "🇮🇳",
      description: "Authentic Indian recipes with rich spices and flavors from the subcontinent",
      color_gradient: "from-orange-500 to-red-600",
    },
  },
  {
    title: "American Cuisine",
    uid: "american_cuisine", 
    data: {
      name: "American Cuisine",
      emoji: "🇺🇸",
      description: "Classic American dishes and comfort food favorites",
      color_gradient: "from-blue-500 to-red-500",
    },
  },
];

// ============ INDIAN RECIPES ============
const indianRecipes = [
  {
    title: "Butter Chicken",
    data: {
      title: "Butter Chicken",
      description: "Creamy, aromatic butter chicken - a beloved North Indian classic with tender chicken in rich tomato-based gravy",
      cooking_time: 45,
      difficulty: "Medium",
      is_published: true,
      ingredients: [
        { name: "Chicken thighs", quantity: "500", unit: "grams" },
        { name: "Yogurt", quantity: "1", unit: "cup" },
        { name: "Tomato puree", quantity: "2", unit: "cups" },
        { name: "Heavy cream", quantity: "1", unit: "cup" },
        { name: "Butter", quantity: "4", unit: "tbsp" },
        { name: "Garam masala", quantity: "2", unit: "tsp" },
        { name: "Kashmiri red chili", quantity: "1", unit: "tsp" },
        { name: "Garlic-ginger paste", quantity: "2", unit: "tbsp" },
      ],
      steps: "1. Marinate chicken in yogurt and spices for 2 hours\n2. Grill or pan-fry the chicken until charred\n3. Make the gravy with tomatoes, cream, and butter\n4. Simmer chicken in the gravy\n5. Garnish with cream and serve with naan",
      recipe_tags: ["indian", "curry", "chicken", "creamy", "north-indian"],
    },
  },
  {
    title: "Biryani",
    data: {
      title: "Hyderabadi Chicken Biryani",
      description: "Fragrant layered rice dish with aromatic spices, tender chicken, and saffron - the crown jewel of Indian cuisine",
      cooking_time: 90,
      difficulty: "Hard",
      is_published: true,
      ingredients: [
        { name: "Basmati rice", quantity: "2", unit: "cups" },
        { name: "Chicken", quantity: "750", unit: "grams" },
        { name: "Onions (fried)", quantity: "3", unit: "large" },
        { name: "Saffron", quantity: "1", unit: "pinch" },
        { name: "Biryani masala", quantity: "2", unit: "tbsp" },
        { name: "Mint leaves", quantity: "1", unit: "cup" },
        { name: "Ghee", quantity: "4", unit: "tbsp" },
      ],
      steps: "1. Marinate chicken with yogurt and biryani masala\n2. Parboil basmati rice with whole spices\n3. Layer rice and chicken in a heavy pot\n4. Add saffron milk and fried onions\n5. Seal and cook on dum for 30 minutes",
      recipe_tags: ["indian", "biryani", "rice", "hyderabadi", "festive"],
    },
  },
  {
    title: "Palak Paneer",
    data: {
      title: "Palak Paneer",
      description: "Creamy spinach curry with soft paneer cubes - a nutritious and delicious vegetarian North Indian favorite",
      cooking_time: 35,
      difficulty: "Easy",
      is_published: true,
      ingredients: [
        { name: "Spinach", quantity: "500", unit: "grams" },
        { name: "Paneer", quantity: "250", unit: "grams" },
        { name: "Onion", quantity: "1", unit: "large" },
        { name: "Tomatoes", quantity: "2", unit: "medium" },
        { name: "Cream", quantity: "2", unit: "tbsp" },
        { name: "Cumin seeds", quantity: "1", unit: "tsp" },
        { name: "Green chilies", quantity: "2", unit: "pieces" },
      ],
      steps: "1. Blanch spinach and blend to a smooth puree\n2. Sauté onions, tomatoes, and spices\n3. Add spinach puree and simmer\n4. Pan-fry paneer cubes until golden\n5. Add paneer to the gravy and serve hot",
      recipe_tags: ["indian", "vegetarian", "paneer", "spinach", "healthy"],
    },
  },
  {
    title: "Masala Dosa",
    data: {
      title: "Masala Dosa",
      description: "Crispy South Indian crepe filled with spiced potato filling - a popular breakfast across India",
      cooking_time: 30,
      difficulty: "Medium",
      is_published: true,
      ingredients: [
        { name: "Dosa batter", quantity: "2", unit: "cups" },
        { name: "Potatoes", quantity: "4", unit: "large" },
        { name: "Onions", quantity: "2", unit: "medium" },
        { name: "Mustard seeds", quantity: "1", unit: "tsp" },
        { name: "Turmeric", quantity: "0.5", unit: "tsp" },
        { name: "Curry leaves", quantity: "10", unit: "pieces" },
        { name: "Green chilies", quantity: "3", unit: "pieces" },
      ],
      steps: "1. Prepare potato masala with spices\n2. Heat a dosa pan and spread batter thin\n3. Drizzle oil and cook until crispy\n4. Add potato filling and fold\n5. Serve with coconut chutney and sambar",
      recipe_tags: ["indian", "south-indian", "breakfast", "vegetarian", "crispy"],
    },
  },
];

// ============ AMERICAN RECIPES ============
const americanRecipes = [
  {
    title: "Classic Cheeseburger",
    data: {
      title: "Classic American Cheeseburger",
      description: "Juicy beef patty with melted cheese, fresh vegetables, and special sauce - the quintessential American meal",
      cooking_time: 25,
      difficulty: "Easy",
      is_published: true,
      ingredients: [
        { name: "Ground beef", quantity: "500", unit: "grams" },
        { name: "Cheddar cheese", quantity: "4", unit: "slices" },
        { name: "Burger buns", quantity: "4", unit: "pieces" },
        { name: "Lettuce", quantity: "4", unit: "leaves" },
        { name: "Tomato", quantity: "1", unit: "large" },
        { name: "Onion", quantity: "1", unit: "medium" },
        { name: "Pickles", quantity: "8", unit: "slices" },
      ],
      steps: "1. Form beef into patties and season well\n2. Grill patties to desired doneness\n3. Add cheese and let it melt\n4. Toast the buns lightly\n5. Assemble with lettuce, tomato, pickles, and sauce",
      recipe_tags: ["american", "burger", "beef", "classic", "grill"],
    },
  },
  {
    title: "BBQ Ribs",
    data: {
      title: "Southern BBQ Ribs",
      description: "Fall-off-the-bone tender pork ribs glazed with smoky BBQ sauce - a Southern American barbecue staple",
      cooking_time: 180,
      difficulty: "Medium",
      is_published: true,
      ingredients: [
        { name: "Pork ribs", quantity: "2", unit: "racks" },
        { name: "BBQ sauce", quantity: "2", unit: "cups" },
        { name: "Brown sugar", quantity: "0.5", unit: "cup" },
        { name: "Paprika", quantity: "2", unit: "tbsp" },
        { name: "Garlic powder", quantity: "1", unit: "tbsp" },
        { name: "Apple cider vinegar", quantity: "0.25", unit: "cup" },
      ],
      steps: "1. Remove membrane from ribs\n2. Apply dry rub generously\n3. Slow cook at 275°F for 3 hours\n4. Brush with BBQ sauce\n5. Broil for caramelized finish",
      recipe_tags: ["american", "bbq", "pork", "southern", "smoky"],
    },
  },
  {
    title: "Mac and Cheese",
    data: {
      title: "Creamy Mac and Cheese",
      description: "Ultra-creamy, cheesy pasta that's the ultimate American comfort food - loved by kids and adults alike",
      cooking_time: 40,
      difficulty: "Easy",
      is_published: true,
      ingredients: [
        { name: "Elbow macaroni", quantity: "450", unit: "grams" },
        { name: "Cheddar cheese", quantity: "3", unit: "cups" },
        { name: "Milk", quantity: "2", unit: "cups" },
        { name: "Butter", quantity: "4", unit: "tbsp" },
        { name: "Flour", quantity: "3", unit: "tbsp" },
        { name: "Breadcrumbs", quantity: "0.5", unit: "cup" },
      ],
      steps: "1. Cook macaroni until al dente\n2. Make roux with butter and flour\n3. Add milk and stir until thick\n4. Melt in cheese until smooth\n5. Top with breadcrumbs and bake until golden",
      recipe_tags: ["american", "pasta", "cheese", "comfort-food", "kids-favorite"],
    },
  },
  {
    title: "Apple Pie",
    data: {
      title: "Classic American Apple Pie",
      description: "Warm apple pie with flaky crust and cinnamon-spiced filling - as American as it gets!",
      cooking_time: 75,
      difficulty: "Medium",
      is_published: true,
      ingredients: [
        { name: "Granny Smith apples", quantity: "6", unit: "large" },
        { name: "Pie crust", quantity: "2", unit: "sheets" },
        { name: "Sugar", quantity: "0.75", unit: "cup" },
        { name: "Cinnamon", quantity: "2", unit: "tsp" },
        { name: "Butter", quantity: "2", unit: "tbsp" },
        { name: "Lemon juice", quantity: "1", unit: "tbsp" },
      ],
      steps: "1. Slice apples and toss with sugar and spices\n2. Line pie dish with bottom crust\n3. Add apple filling and dot with butter\n4. Cover with top crust and crimp edges\n5. Bake at 375°F for 50 minutes until golden",
      recipe_tags: ["american", "dessert", "pie", "apple", "classic"],
    },
  },
];

// ============ HOME PAGE VARIANTS ============
const homePageVariants = {
  india: {
    title: "Home Page - India",
    data: {
      page_title: "RecipeHub India - Discover Authentic Indian Recipes",
      hero_badge_text: "🇮🇳 Namaste, Food Lovers!",
      hero_headline: "Discover Authentic",
      hero_highlight_text: "Indian Flavors",
      hero_description: "Explore thousands of traditional and modern Indian recipes, from creamy butter chicken to crispy dosas. Cook like a true Indian chef!",
      hero_primary_btn_label: "Explore Indian Recipes",
      hero_primary_btn_url: "/recipes?category=Indian%20Cuisine",
      hero_secondary_btn_label: "Popular Curries",
      hero_secondary_btn_url: "/recipes?tags=curry",
      categories_section_title: "Popular Indian Categories",
      categories_section_subtitle: "From North to South, East to West - explore India's diverse cuisine",
      recipes_section_title: "Trending Indian Recipes",
      recipes_section_subtitle: "Most loved dishes from Indian kitchens",
      features_section_title: "Why Cook Indian at Home?",
      features_section_subtitle: "Discover the joy of authentic Indian cooking with our community",
      cta_headline: "Start Your Indian Cooking Journey",
      cta_description: "Join millions of Indian food enthusiasts sharing their family recipes and culinary secrets",
      cta_primary_btn_label: "Join the Community",
      cta_primary_btn_url: "/signup",
      stats: [
        { value: "1000+", label: "Indian Recipes" },
        { value: "50K+", label: "Indian Cooks" },
        { value: "100+", label: "Regional Cuisines" },
      ],
      features: [
        { icon: "BookOpen", title: "Authentic Recipes", description: "Traditional recipes passed down through generations" },
        { icon: "Users", title: "Indian Community", description: "Connect with home cooks from across India" },
        { icon: "Heart", title: "Family Favorites", description: "Save and organize your family's secret recipes" },
        { icon: "Search", title: "Regional Discovery", description: "Explore cuisines from every Indian state" },
      ],
    },
  },
  usa: {
    title: "Home Page - USA",
    data: {
      page_title: "RecipeHub USA - Classic American Recipes & More",
      hero_badge_text: "🇺🇸 Welcome, Home Cooks!",
      hero_headline: "Classic American",
      hero_highlight_text: "Comfort Food",
      hero_description: "From BBQ ribs to apple pie, discover America's favorite recipes. Cook delicious meals that bring families together!",
      hero_primary_btn_label: "Explore American Classics",
      hero_primary_btn_url: "/recipes?category=American%20Cuisine",
      hero_secondary_btn_label: "BBQ Favorites",
      hero_secondary_btn_url: "/recipes?tags=bbq",
      categories_section_title: "American Favorites",
      categories_section_subtitle: "Burgers, BBQ, comfort food, and sweet treats",
      recipes_section_title: "Popular American Recipes",
      recipes_section_subtitle: "America's most-loved dishes",
      features_section_title: "Cook American Classics",
      features_section_subtitle: "Master the art of American cooking with our community",
      cta_headline: "Share Your American Recipes",
      cta_description: "Join our community of American home cooks and share your family's favorite dishes",
      cta_primary_btn_label: "Get Started Free",
      cta_primary_btn_url: "/signup",
      stats: [
        { value: "800+", label: "American Recipes" },
        { value: "30K+", label: "US Cooks" },
        { value: "50+", label: "Regional Styles" },
      ],
      features: [
        { icon: "BookOpen", title: "Classic Recipes", description: "Time-tested American favorites everyone loves" },
        { icon: "Users", title: "US Community", description: "Connect with home cooks across America" },
        { icon: "Heart", title: "Family Traditions", description: "Preserve and share family recipe traditions" },
        { icon: "Search", title: "Regional BBQ", description: "Explore BBQ styles from Texas to Carolina" },
      ],
    },
  },
};

// ============ MAIN SETUP FUNCTION ============
async function setupPersonalizationContent() {
  console.log("🚀 Starting Personalization Content Setup...\n");

  try {
    // 1. Create Categories
    console.log("📁 Creating regional categories...");
    const categoryUids: Record<string, string> = {};
    
    for (const category of categories) {
      try {
        const entry = await stack.contentType("category").entry().create({
          entry: {
            title: category.title,
            ...category.data,
          },
        });
        categoryUids[category.uid] = (entry as any).uid;
        console.log(`  ✓ Created category: ${category.title} (${(entry as any).uid})`);
        
        // Publish the entry
        await (entry as any).publish({ environments: [ENVIRONMENT] });
        console.log(`  ✓ Published: ${category.title}`);
      } catch (error: any) {
        if (error.message?.includes("already exists") || error.errorCode === 119) {
          console.log(`  ⚠ Category already exists: ${category.title}`);
        } else {
          console.error(`  ✗ Failed to create category ${category.title}:`, error.message || error);
        }
      }
    }

    // 2. Create Indian Recipes
    console.log("\n🍛 Creating Indian recipes...");
    for (const recipe of indianRecipes) {
      try {
        const entry = await stack.contentType("recipe").entry().create({
          entry: {
            ...recipe.data,
          },
        });
        console.log(`  ✓ Created recipe: ${recipe.title}`);
        
        await (entry as any).publish({ environments: [ENVIRONMENT] });
        console.log(`  ✓ Published: ${recipe.title}`);
      } catch (error: any) {
        console.error(`  ✗ Failed to create recipe ${recipe.title}:`, error.message || error);
      }
    }

    // 3. Create American Recipes
    console.log("\n🍔 Creating American recipes...");
    for (const recipe of americanRecipes) {
      try {
        const entry = await stack.contentType("recipe").entry().create({
          entry: {
            ...recipe.data,
          },
        });
        console.log(`  ✓ Created recipe: ${recipe.title}`);
        
        await (entry as any).publish({ environments: [ENVIRONMENT] });
        console.log(`  ✓ Published: ${recipe.title}`);
      } catch (error: any) {
        console.error(`  ✗ Failed to create recipe ${recipe.title}:`, error.message || error);
      }
    }

    // 4. Create Home Page Variants
    console.log("\n🏠 Creating Home Page variants...");
    for (const [region, variant] of Object.entries(homePageVariants)) {
      try {
        const entry = await stack.contentType("home_page").entry().create({
          entry: {
            title: variant.title,
            ...variant.data,
          },
        });
        console.log(`  ✓ Created home page variant: ${variant.title}`);
        
        await (entry as any).publish({ environments: [ENVIRONMENT] });
        console.log(`  ✓ Published: ${variant.title}`);
      } catch (error: any) {
        console.error(`  ✗ Failed to create home page variant ${variant.title}:`, error.message || error);
      }
    }

    console.log("\n✅ Personalization content setup complete!");
    console.log("\n📋 Next Steps:");
    console.log("1. Go to Contentstack Personalize dashboard");
    console.log("2. Create audiences based on Lytics location segments");
    console.log("3. Create experiences linking audiences to content variants");
    console.log("4. Configure Lytics to send location data to Contentstack");

  } catch (error) {
    console.error("Setup failed:", error);
    process.exit(1);
  }
}

// Run the setup
setupPersonalizationContent();
