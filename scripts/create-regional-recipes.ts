/**
 * Create Regional Recipe Entries (Indian & American)
 * Run with: npx ts-node scripts/create-regional-recipes.ts
 */

import contentstack from "@contentstack/management";

const API_KEY = "blt837255d7d0d157c5";
const MANAGEMENT_TOKEN = "cs4b3b60b8ac28532fc37fbe37";
const ENVIRONMENT = "development";

const client = contentstack.client();
const stack = client.stack({ api_key: API_KEY, management_token: MANAGEMENT_TOKEN });

// ============ CATEGORIES ============
const categories = [
  {
    title: "Indian Cuisine",
    data: {
      name: "Indian Cuisine",
      emoji: "🇮🇳",
      description: "Authentic Indian recipes with rich spices and flavors",
      color_gradient: "from-orange-500 to-red-600",
    },
  },
  {
    title: "American Cuisine",
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
    description: "Creamy, aromatic butter chicken - a beloved North Indian classic with tender chicken in rich tomato-based gravy",
    cooking_time: 45,
    difficulty: "medium",
    is_published: true,
    ingredients: [
      { name: "Chicken thighs", quantity: "500", unit: "grams" },
      { name: "Yogurt", quantity: "1", unit: "cup" },
      { name: "Tomato puree", quantity: "2", unit: "cups" },
      { name: "Heavy cream", quantity: "1", unit: "cup" },
      { name: "Butter", quantity: "4", unit: "tbsp" },
      { name: "Garam masala", quantity: "2", unit: "tsp" },
    ],
    steps: "1. Marinate chicken in yogurt and spices for 2 hours\n2. Grill or pan-fry the chicken until charred\n3. Make the gravy with tomatoes, cream, and butter\n4. Simmer chicken in the gravy\n5. Garnish with cream and serve with naan",
    recipe_tags: ["indian", "curry", "chicken", "creamy"],
  },
  {
    title: "Chicken Biryani",
    description: "Fragrant layered rice dish with aromatic spices, tender chicken, and saffron - the crown jewel of Indian cuisine",
    cooking_time: 90,
    difficulty: "hard",
    is_published: true,
    ingredients: [
      { name: "Basmati rice", quantity: "2", unit: "cups" },
      { name: "Chicken", quantity: "750", unit: "grams" },
      { name: "Onions (fried)", quantity: "3", unit: "large" },
      { name: "Saffron", quantity: "1", unit: "pinch" },
      { name: "Biryani masala", quantity: "2", unit: "tbsp" },
      { name: "Ghee", quantity: "4", unit: "tbsp" },
    ],
    steps: "1. Marinate chicken with yogurt and biryani masala\n2. Parboil basmati rice with whole spices\n3. Layer rice and chicken in a heavy pot\n4. Add saffron milk and fried onions\n5. Seal and cook on dum for 30 minutes",
    recipe_tags: ["indian", "biryani", "rice", "festive"],
  },
  {
    title: "Palak Paneer",
    description: "Creamy spinach curry with soft paneer cubes - a nutritious and delicious vegetarian North Indian favorite",
    cooking_time: 35,
    difficulty: "easy",
    is_published: true,
    ingredients: [
      { name: "Spinach", quantity: "500", unit: "grams" },
      { name: "Paneer", quantity: "250", unit: "grams" },
      { name: "Onion", quantity: "1", unit: "large" },
      { name: "Tomatoes", quantity: "2", unit: "medium" },
      { name: "Cream", quantity: "2", unit: "tbsp" },
      { name: "Cumin seeds", quantity: "1", unit: "tsp" },
    ],
    steps: "1. Blanch spinach and blend to a smooth puree\n2. Sauté onions, tomatoes, and spices\n3. Add spinach puree and simmer\n4. Pan-fry paneer cubes until golden\n5. Add paneer to the gravy and serve hot",
    recipe_tags: ["indian", "vegetarian", "paneer", "healthy"],
  },
  {
    title: "Masala Dosa",
    description: "Crispy South Indian crepe filled with spiced potato filling - a popular breakfast across India",
    cooking_time: 30,
    difficulty: "medium",
    is_published: true,
    ingredients: [
      { name: "Dosa batter", quantity: "2", unit: "cups" },
      { name: "Potatoes", quantity: "4", unit: "large" },
      { name: "Onions", quantity: "2", unit: "medium" },
      { name: "Mustard seeds", quantity: "1", unit: "tsp" },
      { name: "Turmeric", quantity: "0.5", unit: "tsp" },
      { name: "Curry leaves", quantity: "10", unit: "pieces" },
    ],
    steps: "1. Prepare potato masala with spices\n2. Heat a dosa pan and spread batter thin\n3. Drizzle oil and cook until crispy\n4. Add potato filling and fold\n5. Serve with coconut chutney and sambar",
    recipe_tags: ["indian", "south-indian", "breakfast", "vegetarian"],
  },
];

// ============ AMERICAN RECIPES ============
const americanRecipes = [
  {
    title: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheese, fresh vegetables, and special sauce - the quintessential American meal",
    cooking_time: 25,
    difficulty: "easy",
    is_published: true,
    ingredients: [
      { name: "Ground beef", quantity: "500", unit: "grams" },
      { name: "Cheddar cheese", quantity: "4", unit: "slices" },
      { name: "Burger buns", quantity: "4", unit: "pieces" },
      { name: "Lettuce", quantity: "4", unit: "leaves" },
      { name: "Tomato", quantity: "1", unit: "large" },
      { name: "Pickles", quantity: "8", unit: "slices" },
    ],
    steps: "1. Form beef into patties and season well\n2. Grill patties to desired doneness\n3. Add cheese and let it melt\n4. Toast the buns lightly\n5. Assemble with lettuce, tomato, pickles, and sauce",
    recipe_tags: ["american", "burger", "beef", "classic"],
  },
  {
    title: "BBQ Pulled Pork",
    description: "Slow-cooked pulled pork with smoky BBQ sauce - a Southern American barbecue staple",
    cooking_time: 480,
    difficulty: "medium",
    is_published: true,
    ingredients: [
      { name: "Pork shoulder", quantity: "2", unit: "kg" },
      { name: "BBQ sauce", quantity: "2", unit: "cups" },
      { name: "Brown sugar", quantity: "0.5", unit: "cup" },
      { name: "Paprika", quantity: "2", unit: "tbsp" },
      { name: "Apple cider vinegar", quantity: "0.25", unit: "cup" },
      { name: "Burger buns", quantity: "8", unit: "pieces" },
    ],
    steps: "1. Rub pork with spices and brown sugar\n2. Slow cook at 275°F for 8 hours\n3. Shred the pork with forks\n4. Mix with BBQ sauce\n5. Serve on toasted buns with coleslaw",
    recipe_tags: ["american", "bbq", "pork", "southern"],
  },
  {
    title: "Mac and Cheese",
    description: "Ultra-creamy, cheesy pasta that's the ultimate American comfort food - loved by kids and adults alike",
    cooking_time: 40,
    difficulty: "easy",
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
    recipe_tags: ["american", "pasta", "cheese", "comfort-food"],
  },
  {
    title: "Apple Pie",
    description: "Warm apple pie with flaky crust and cinnamon-spiced filling - as American as it gets!",
    cooking_time: 75,
    difficulty: "medium",
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
    recipe_tags: ["american", "dessert", "pie", "apple"],
  },
];

async function createCategory(categoryData: typeof categories[0]) {
  try {
    // Check if category already exists
    const result = await stack
      .contentType("category")
      .entry()
      .query({ query: { name: categoryData.data.name } })
      .find();
    
    if (result.items && result.items.length > 0) {
      console.log(`  ⚠ Category exists: ${categoryData.title} (${result.items[0].uid})`);
      return result.items[0];
    }
  } catch {}

  try {
    const entry = await stack
      .contentType("category")
      .entry()
      .create({ entry: { title: categoryData.title, ...categoryData.data } as any });
    
    console.log(`  ✓ Created category: ${categoryData.title} (${entry.uid})`);
    
    await entry.publish({
      publishDetails: { environments: [ENVIRONMENT], locales: ["en-us"] },
    });
    
    return entry;
  } catch (error: any) {
    console.error(`  ✗ Failed: ${categoryData.title}`, error.message || error);
    return null;
  }
}

async function createRecipe(recipeData: any, categoryUid: string) {
  try {
    // Check if recipe already exists
    const result = await stack
      .contentType("recipe")
      .entry()
      .query({ query: { title: recipeData.title } })
      .find();
    
    if (result.items && result.items.length > 0) {
      console.log(`  ⚠ Recipe exists: ${recipeData.title}`);
      return result.items[0];
    }
  } catch {}

  try {
    const entry = await stack
      .contentType("recipe")
      .entry()
      .create({
        entry: {
          ...recipeData,
          category: [{ uid: categoryUid, _content_type_uid: "category" }],
          url: `/recipes/${recipeData.title.toLowerCase().replace(/\s+/g, "-")}`,
        } as any,
      });
    
    console.log(`  ✓ Created recipe: ${recipeData.title}`);
    
    await entry.publish({
      publishDetails: { environments: [ENVIRONMENT], locales: ["en-us"] },
    });
    
    return entry;
  } catch (error: any) {
    console.error(`  ✗ Failed: ${recipeData.title}`, error.message || error);
    return null;
  }
}

async function main() {
  console.log("🚀 Creating Regional Recipe Entries\n");
  console.log("=".repeat(50));

  // Create categories
  console.log("\n📁 Creating Categories...");
  const indianCategory = await createCategory(categories[0]);
  const americanCategory = await createCategory(categories[1]);

  // Create Indian recipes
  if (indianCategory) {
    console.log("\n🇮🇳 Creating Indian Recipes...");
    for (const recipe of indianRecipes) {
      await createRecipe(recipe, indianCategory.uid);
    }
  }

  // Create American recipes
  if (americanCategory) {
    console.log("\n🇺🇸 Creating American Recipes...");
    for (const recipe of americanRecipes) {
      await createRecipe(recipe, americanCategory.uid);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ Regional recipes created!");
}

main().catch(console.error);
