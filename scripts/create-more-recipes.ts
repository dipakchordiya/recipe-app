/**
 * Script to create more recipe entries in Contentstack
 * Run with: npx ts-node scripts/create-more-recipes.ts
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env" });

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || process.env.CONTENTSTACK_API_KEY || "";
const MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "";

interface RecipeData {
  title: string;
  url: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  cooking_time: number;
  ingredients: { name: string; amount: string; unit?: string }[];
  steps: string;
  tags: string[];
}

// New Indian recipes
const indianRecipes: RecipeData[] = [
  {
    title: "Paneer Tikka Masala",
    url: "/recipes/paneer-tikka-masala",
    description: "Creamy and flavorful paneer tikka masala with marinated paneer cubes in a rich tomato-based gravy. A vegetarian delight!",
    category: "Indian Cuisine",
    difficulty: "medium",
    cooking_time: 45,
    ingredients: [
      { name: "Paneer", amount: "400", unit: "g" },
      { name: "Yogurt", amount: "1", unit: "cup" },
      { name: "Tomato puree", amount: "2", unit: "cups" },
      { name: "Heavy cream", amount: "1/2", unit: "cup" },
      { name: "Ginger-garlic paste", amount: "2", unit: "tbsp" },
      { name: "Garam masala", amount: "1", unit: "tsp" },
      { name: "Red chili powder", amount: "1", unit: "tsp" },
      { name: "Kashmiri red chili", amount: "1", unit: "tsp" },
      { name: "Cumin powder", amount: "1", unit: "tsp" },
      { name: "Coriander powder", amount: "1", unit: "tsp" },
    ],
    steps: `1. Cut paneer into cubes and marinate with yogurt, ginger-garlic paste, and spices for 30 minutes.
2. Grill or pan-fry the marinated paneer until charred and set aside.
3. In a pan, heat oil and sauté onions until golden.
4. Add ginger-garlic paste and cook for 2 minutes.
5. Add tomato puree and cook until oil separates.
6. Add all the spices and cook for 5 minutes.
7. Pour in cream and simmer for 10 minutes.
8. Add grilled paneer and mix gently.
9. Garnish with fresh cream and coriander leaves.
10. Serve hot with naan or rice.`,
    tags: ["indian", "paneer", "vegetarian", "curry", "tikka"],
  },
  {
    title: "Pav Bhaji",
    url: "/recipes/pav-bhaji",
    description: "Mumbai's famous street food - a spiced mashed vegetable curry served with buttery toasted bread rolls.",
    category: "Indian Cuisine",
    difficulty: "medium",
    cooking_time: 40,
    ingredients: [
      { name: "Potatoes", amount: "4", unit: "medium" },
      { name: "Cauliflower", amount: "1", unit: "cup" },
      { name: "Green peas", amount: "1", unit: "cup" },
      { name: "Capsicum", amount: "1", unit: "medium" },
      { name: "Tomatoes", amount: "3", unit: "medium" },
      { name: "Onions", amount: "2", unit: "medium" },
      { name: "Pav bhaji masala", amount: "3", unit: "tbsp" },
      { name: "Butter", amount: "100", unit: "g" },
      { name: "Pav (bread rolls)", amount: "8", unit: "pieces" },
      { name: "Lemon", amount: "1", unit: "whole" },
    ],
    steps: `1. Boil potatoes, cauliflower, and peas until soft. Mash them coarsely.
2. Heat butter in a large pan and sauté chopped onions until golden.
3. Add chopped tomatoes and capsicum, cook until soft.
4. Add pav bhaji masala and mix well.
5. Add the mashed vegetables and mix thoroughly.
6. Add water as needed and mash everything together.
7. Cook on low heat for 15-20 minutes, adding butter generously.
8. Toast pav with butter on a griddle until golden.
9. Garnish bhaji with chopped onions, coriander, and lemon juice.
10. Serve hot pav with the bhaji.`,
    tags: ["indian", "street-food", "vegetarian", "mumbai", "spicy"],
  },
  {
    title: "Chole Bhature",
    url: "/recipes/chole-bhature",
    description: "A popular North Indian dish featuring spicy chickpea curry served with deep-fried fluffy bread.",
    category: "Indian Cuisine",
    difficulty: "hard",
    cooking_time: 60,
    ingredients: [
      { name: "Chickpeas (soaked overnight)", amount: "2", unit: "cups" },
      { name: "Onions", amount: "2", unit: "large" },
      { name: "Tomatoes", amount: "3", unit: "medium" },
      { name: "Tea bags", amount: "2", unit: "bags" },
      { name: "Chole masala", amount: "2", unit: "tbsp" },
      { name: "All-purpose flour", amount: "2", unit: "cups" },
      { name: "Semolina", amount: "2", unit: "tbsp" },
      { name: "Yogurt", amount: "1/4", unit: "cup" },
      { name: "Baking powder", amount: "1/2", unit: "tsp" },
      { name: "Oil for frying", amount: "500", unit: "ml" },
    ],
    steps: `1. Pressure cook chickpeas with tea bags for dark color (5-6 whistles).
2. For bhature: Mix flour, semolina, yogurt, baking powder, salt. Knead soft dough.
3. Cover and rest dough for 2 hours.
4. Heat oil, sauté onions until brown.
5. Add tomato puree and cook until oil separates.
6. Add all spices - chole masala, cumin, coriander, amchur.
7. Add cooked chickpeas and simmer for 20 minutes.
8. Mash some chickpeas for thick gravy.
9. Roll bhature dough into oval shapes and deep fry until puffed and golden.
10. Serve hot chole with bhature, onion rings, and green chutney.`,
    tags: ["indian", "punjabi", "chickpeas", "deep-fried", "spicy"],
  },
  {
    title: "Dal Makhani",
    url: "/recipes/dal-makhani",
    description: "Creamy and rich black lentil curry slow-cooked with butter and cream. A Punjabi classic!",
    category: "Indian Cuisine",
    difficulty: "medium",
    cooking_time: 90,
    ingredients: [
      { name: "Black urad dal", amount: "1", unit: "cup" },
      { name: "Rajma (kidney beans)", amount: "1/4", unit: "cup" },
      { name: "Butter", amount: "100", unit: "g" },
      { name: "Heavy cream", amount: "1/2", unit: "cup" },
      { name: "Tomato puree", amount: "1", unit: "cup" },
      { name: "Ginger-garlic paste", amount: "2", unit: "tbsp" },
      { name: "Red chili powder", amount: "1", unit: "tsp" },
      { name: "Garam masala", amount: "1", unit: "tsp" },
      { name: "Kasuri methi", amount: "1", unit: "tbsp" },
      { name: "Fresh cream for garnish", amount: "2", unit: "tbsp" },
    ],
    steps: `1. Soak dal and rajma overnight. Pressure cook until very soft.
2. Heat butter and sauté ginger-garlic paste.
3. Add tomato puree and cook until oil separates.
4. Add spices and cook for 5 minutes.
5. Add cooked dal and mix well.
6. Simmer on low heat for 45 minutes, stirring occasionally.
7. Add cream and butter, cook for another 15 minutes.
8. Crush kasuri methi and add to the dal.
9. Adjust consistency with water if needed.
10. Garnish with cream and serve with naan or rice.`,
    tags: ["indian", "lentils", "vegetarian", "creamy", "punjabi"],
  },
];

// American recipes
const americanRecipes: RecipeData[] = [
  {
    title: "Southern Fried Chicken",
    url: "/recipes/southern-fried-chicken",
    description: "Crispy, juicy, and perfectly seasoned Southern-style fried chicken. A true American classic!",
    category: "American Cuisine",
    difficulty: "medium",
    cooking_time: 45,
    ingredients: [
      { name: "Chicken pieces", amount: "8", unit: "pieces" },
      { name: "Buttermilk", amount: "2", unit: "cups" },
      { name: "All-purpose flour", amount: "2", unit: "cups" },
      { name: "Paprika", amount: "2", unit: "tbsp" },
      { name: "Garlic powder", amount: "1", unit: "tbsp" },
      { name: "Cayenne pepper", amount: "1", unit: "tsp" },
      { name: "Salt", amount: "2", unit: "tsp" },
      { name: "Black pepper", amount: "1", unit: "tsp" },
      { name: "Vegetable oil", amount: "4", unit: "cups" },
      { name: "Hot sauce", amount: "1", unit: "tbsp" },
    ],
    steps: `1. Marinate chicken in buttermilk and hot sauce for at least 4 hours or overnight.
2. Mix flour with all the spices in a large bowl.
3. Remove chicken from buttermilk, letting excess drip off.
4. Dredge each piece thoroughly in the seasoned flour.
5. Let coated chicken rest for 10 minutes.
6. Heat oil to 350°F (175°C) in a deep pan.
7. Fry chicken pieces in batches, 12-15 minutes per side.
8. Ensure internal temperature reaches 165°F (74°C).
9. Drain on a wire rack.
10. Serve hot with coleslaw and biscuits.`,
    tags: ["american", "fried", "chicken", "southern", "comfort-food"],
  },
  {
    title: "New York Cheesecake",
    url: "/recipes/new-york-cheesecake",
    description: "Dense, creamy, and absolutely delicious New York-style cheesecake with a graham cracker crust.",
    category: "American Cuisine",
    difficulty: "hard",
    cooking_time: 90,
    ingredients: [
      { name: "Cream cheese", amount: "900", unit: "g" },
      { name: "Sugar", amount: "1", unit: "cup" },
      { name: "Sour cream", amount: "1", unit: "cup" },
      { name: "Eggs", amount: "5", unit: "large" },
      { name: "Vanilla extract", amount: "2", unit: "tsp" },
      { name: "Graham crackers", amount: "2", unit: "cups" },
      { name: "Butter (melted)", amount: "6", unit: "tbsp" },
      { name: "Lemon zest", amount: "1", unit: "tbsp" },
      { name: "Heavy cream", amount: "1/4", unit: "cup" },
      { name: "Salt", amount: "1/4", unit: "tsp" },
    ],
    steps: `1. Preheat oven to 325°F (165°C).
2. Mix crushed graham crackers with melted butter and press into springform pan.
3. Bake crust for 10 minutes, let cool.
4. Beat cream cheese until smooth.
5. Add sugar gradually, beat until fluffy.
6. Add eggs one at a time, mixing after each.
7. Fold in sour cream, vanilla, lemon zest, and cream.
8. Pour filling over crust.
9. Bake for 60-70 minutes until center is slightly jiggly.
10. Turn off oven, crack door, let cool inside for 1 hour. Refrigerate overnight.`,
    tags: ["american", "dessert", "cheesecake", "new-york", "baking"],
  },
  {
    title: "Philly Cheesesteak",
    url: "/recipes/philly-cheesesteak",
    description: "Authentic Philadelphia cheesesteak with thinly sliced ribeye, melted cheese, and caramelized onions.",
    category: "American Cuisine",
    difficulty: "easy",
    cooking_time: 25,
    ingredients: [
      { name: "Ribeye steak", amount: "500", unit: "g" },
      { name: "Hoagie rolls", amount: "4", unit: "rolls" },
      { name: "Provolone cheese", amount: "8", unit: "slices" },
      { name: "Onion", amount: "1", unit: "large" },
      { name: "Green bell pepper", amount: "1", unit: "medium" },
      { name: "Mushrooms", amount: "1", unit: "cup" },
      { name: "Butter", amount: "2", unit: "tbsp" },
      { name: "Salt", amount: "1", unit: "tsp" },
      { name: "Black pepper", amount: "1/2", unit: "tsp" },
      { name: "Garlic powder", amount: "1/2", unit: "tsp" },
    ],
    steps: `1. Freeze steak for 30 minutes for easier slicing. Slice very thin.
2. Slice onions, peppers, and mushrooms.
3. Heat butter on a griddle or large pan over high heat.
4. Sauté onions until caramelized, about 10 minutes. Set aside.
5. Cook peppers and mushrooms until soft. Set aside.
6. Season steak slices and cook quickly, 2-3 minutes.
7. Chop the meat on the griddle while cooking.
8. Add vegetables back, mix together.
9. Place cheese on top, let melt.
10. Scoop into toasted hoagie rolls and serve immediately.`,
    tags: ["american", "sandwich", "steak", "philadelphia", "cheese"],
  },
];

// Italian recipes
const italianRecipes: RecipeData[] = [
  {
    title: "Spaghetti Carbonara",
    url: "/recipes/spaghetti-carbonara",
    description: "Classic Roman pasta dish with eggs, cheese, pancetta, and black pepper. Simple yet luxurious!",
    category: "Italian",
    difficulty: "medium",
    cooking_time: 25,
    ingredients: [
      { name: "Spaghetti", amount: "400", unit: "g" },
      { name: "Pancetta or guanciale", amount: "200", unit: "g" },
      { name: "Eggs", amount: "4", unit: "large" },
      { name: "Pecorino Romano", amount: "100", unit: "g" },
      { name: "Parmesan", amount: "50", unit: "g" },
      { name: "Black pepper", amount: "2", unit: "tsp" },
      { name: "Salt", amount: "1", unit: "tbsp" },
      { name: "Garlic", amount: "2", unit: "cloves" },
      { name: "Olive oil", amount: "1", unit: "tbsp" },
      { name: "Pasta water", amount: "1", unit: "cup" },
    ],
    steps: `1. Bring a large pot of salted water to boil.
2. Whisk eggs with grated cheeses and lots of black pepper.
3. Cut pancetta into small cubes.
4. Cook pancetta in a pan until crispy.
5. Add garlic, cook 1 minute, then remove garlic.
6. Cook spaghetti until al dente, reserve pasta water.
7. Remove pan from heat, add hot pasta to pancetta.
8. Quickly add egg mixture, tossing constantly.
9. Add pasta water as needed for creamy consistency.
10. Serve immediately with extra cheese and pepper.`,
    tags: ["italian", "pasta", "eggs", "roman", "quick"],
  },
  {
    title: "Margherita Pizza",
    url: "/recipes/margherita-pizza",
    description: "Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil.",
    category: "Italian",
    difficulty: "medium",
    cooking_time: 30,
    ingredients: [
      { name: "Pizza dough", amount: "500", unit: "g" },
      { name: "San Marzano tomatoes", amount: "400", unit: "g" },
      { name: "Fresh mozzarella", amount: "250", unit: "g" },
      { name: "Fresh basil", amount: "10", unit: "leaves" },
      { name: "Extra virgin olive oil", amount: "2", unit: "tbsp" },
      { name: "Garlic", amount: "1", unit: "clove" },
      { name: "Salt", amount: "1", unit: "tsp" },
      { name: "Semolina flour", amount: "2", unit: "tbsp" },
      { name: "Dried oregano", amount: "1", unit: "tsp" },
      { name: "Parmesan", amount: "2", unit: "tbsp" },
    ],
    steps: `1. Preheat oven to highest setting (500°F/260°C) with pizza stone.
2. Crush tomatoes by hand, add minced garlic and salt.
3. Stretch dough into 12-inch circle on floured surface.
4. Transfer to semolina-dusted pizza peel.
5. Spread tomato sauce leaving 1-inch border.
6. Tear mozzarella and distribute evenly.
7. Drizzle with olive oil.
8. Slide onto hot pizza stone.
9. Bake 8-10 minutes until crust is charred and cheese bubbles.
10. Add fresh basil and extra olive oil before serving.`,
    tags: ["italian", "pizza", "vegetarian", "naples", "classic"],
  },
];

// Mexican recipes
const mexicanRecipes: RecipeData[] = [
  {
    title: "Chicken Tacos Al Pastor",
    url: "/recipes/chicken-tacos-al-pastor",
    description: "Marinated chicken with pineapple, cilantro, and onions in warm corn tortillas.",
    category: "Mexican",
    difficulty: "medium",
    cooking_time: 40,
    ingredients: [
      { name: "Chicken thighs", amount: "500", unit: "g" },
      { name: "Pineapple chunks", amount: "1", unit: "cup" },
      { name: "Corn tortillas", amount: "12", unit: "small" },
      { name: "Achiote paste", amount: "2", unit: "tbsp" },
      { name: "Chipotle peppers", amount: "2", unit: "peppers" },
      { name: "White onion", amount: "1", unit: "medium" },
      { name: "Fresh cilantro", amount: "1/2", unit: "cup" },
      { name: "Lime", amount: "2", unit: "whole" },
      { name: "Garlic", amount: "4", unit: "cloves" },
      { name: "Orange juice", amount: "1/4", unit: "cup" },
    ],
    steps: `1. Blend achiote, chipotles, garlic, orange juice, and spices for marinade.
2. Marinate chicken for at least 2 hours or overnight.
3. Grill or pan-fry chicken until charred and cooked through.
4. Grill pineapple chunks until caramelized.
5. Dice cooked chicken and pineapple.
6. Warm tortillas on a dry skillet.
7. Dice onion and chop cilantro.
8. Assemble tacos with chicken, pineapple, onion, cilantro.
9. Squeeze fresh lime juice on top.
10. Serve with salsa verde and more lime wedges.`,
    tags: ["mexican", "tacos", "chicken", "street-food", "spicy"],
  },
  {
    title: "Guacamole",
    url: "/recipes/guacamole",
    description: "Fresh and flavorful authentic Mexican guacamole with ripe avocados, lime, and cilantro.",
    category: "Mexican",
    difficulty: "easy",
    cooking_time: 10,
    ingredients: [
      { name: "Ripe avocados", amount: "3", unit: "large" },
      { name: "Lime juice", amount: "2", unit: "tbsp" },
      { name: "Red onion", amount: "1/4", unit: "cup" },
      { name: "Jalapeño", amount: "1", unit: "small" },
      { name: "Fresh cilantro", amount: "3", unit: "tbsp" },
      { name: "Tomato", amount: "1", unit: "medium" },
      { name: "Garlic", amount: "1", unit: "clove" },
      { name: "Salt", amount: "1/2", unit: "tsp" },
      { name: "Cumin", amount: "1/4", unit: "tsp" },
      { name: "Tortilla chips", amount: "1", unit: "bag" },
    ],
    steps: `1. Cut avocados in half, remove pit.
2. Scoop flesh into a bowl.
3. Add lime juice and salt, mash to desired consistency.
4. Finely dice onion, jalapeño (seeded), and tomato.
5. Mince garlic and chop cilantro.
6. Fold all ingredients into mashed avocado.
7. Add cumin and adjust salt to taste.
8. Cover with plastic wrap touching surface to prevent browning.
9. Refrigerate for 30 minutes to let flavors meld.
10. Serve with fresh tortilla chips.`,
    tags: ["mexican", "appetizer", "avocado", "vegetarian", "dip"],
  },
];

// Dessert recipes
const dessertRecipes: RecipeData[] = [
  {
    title: "Tiramisu",
    url: "/recipes/tiramisu",
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
    category: "Desserts",
    difficulty: "medium",
    cooking_time: 30,
    ingredients: [
      { name: "Mascarpone cheese", amount: "500", unit: "g" },
      { name: "Ladyfinger cookies", amount: "300", unit: "g" },
      { name: "Eggs", amount: "4", unit: "large" },
      { name: "Sugar", amount: "100", unit: "g" },
      { name: "Strong espresso", amount: "300", unit: "ml" },
      { name: "Cocoa powder", amount: "3", unit: "tbsp" },
      { name: "Marsala wine", amount: "3", unit: "tbsp" },
      { name: "Vanilla extract", amount: "1", unit: "tsp" },
      { name: "Dark chocolate", amount: "50", unit: "g" },
      { name: "Salt", amount: "1", unit: "pinch" },
    ],
    steps: `1. Brew espresso and let cool. Add Marsala wine.
2. Separate eggs. Beat yolks with sugar until pale and thick.
3. Add mascarpone to yolk mixture, beat until smooth.
4. Whip egg whites with salt until stiff peaks form.
5. Gently fold whites into mascarpone mixture.
6. Quickly dip ladyfingers in coffee (don't soak).
7. Layer dipped ladyfingers in dish.
8. Spread half the mascarpone cream over ladyfingers.
9. Repeat layers.
10. Dust with cocoa powder, refrigerate 4 hours or overnight.`,
    tags: ["italian", "dessert", "coffee", "no-bake", "classic"],
  },
];

async function getAuthor() {
  try {
    const response = await fetch(
      `https://api.contentstack.io/v3/content_types/author/entries?environment=development`,
      {
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
        },
      }
    );
    const data = await response.json();
    return data.entries?.[0]?.uid || null;
  } catch {
    return null;
  }
}

async function getCategory(categoryName: string) {
  try {
    const response = await fetch(
      `https://api.contentstack.io/v3/content_types/category/entries?environment=development`,
      {
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
        },
      }
    );
    const data = await response.json();
    const category = data.entries?.find((e: { title: string }) => e.title === categoryName);
    return category?.uid || null;
  } catch {
    return null;
  }
}

async function createRecipe(recipe: RecipeData, authorUid: string | null, categoryUid: string | null) {
  console.log(`  Creating: ${recipe.title}...`);
  
  const entryData: Record<string, unknown> = {
    title: recipe.title,
    url: recipe.url,
    description: recipe.description,
    difficulty: recipe.difficulty,
    cooking_time: recipe.cooking_time,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    tags: recipe.tags,
  };
  
  if (authorUid) {
    entryData.author = [{ uid: authorUid, _content_type_uid: "author" }];
  }
  
  if (categoryUid) {
    entryData.category = [{ uid: categoryUid, _content_type_uid: "category" }];
  }
  
  try {
    const response = await fetch(
      `https://api.contentstack.io/v3/content_types/recipe/entries`,
      {
        method: "POST",
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entry: entryData }),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`    ✗ Failed: ${error}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`    ✓ Created: ${data.entry.uid}`);
    return data.entry.uid;
  } catch (error) {
    console.log(`    ✗ Error: ${error}`);
    return null;
  }
}

async function publishEntry(uid: string) {
  try {
    await fetch(
      `https://api.contentstack.io/v3/content_types/recipe/entries/${uid}/publish`,
      {
        method: "POST",
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry: {
            environments: ["development"],
            locales: ["en-us"],
          },
        }),
      }
    );
    console.log(`    ✓ Published`);
  } catch {
    console.log(`    ✗ Publish failed`);
  }
}

async function main() {
  console.log("=============================================");
  console.log("  Creating More Recipes in Contentstack");
  console.log("=============================================\n");
  
  if (!API_KEY || !MANAGEMENT_TOKEN) {
    console.error("❌ Missing API credentials!");
    return;
  }
  
  // Get author
  const authorUid = await getAuthor();
  console.log(`Author UID: ${authorUid || "not found"}\n`);
  
  // Create Indian recipes
  console.log("🇮🇳 Creating Indian Recipes:");
  const indianCategoryUid = await getCategory("Indian Cuisine");
  for (const recipe of indianRecipes) {
    const uid = await createRecipe(recipe, authorUid, indianCategoryUid);
    if (uid) await publishEntry(uid);
  }
  
  // Create American recipes
  console.log("\n🇺🇸 Creating American Recipes:");
  const americanCategoryUid = await getCategory("American Cuisine");
  for (const recipe of americanRecipes) {
    const uid = await createRecipe(recipe, authorUid, americanCategoryUid);
    if (uid) await publishEntry(uid);
  }
  
  // Create Italian recipes
  console.log("\n🇮🇹 Creating Italian Recipes:");
  const italianCategoryUid = await getCategory("Italian");
  for (const recipe of italianRecipes) {
    const uid = await createRecipe(recipe, authorUid, italianCategoryUid);
    if (uid) await publishEntry(uid);
  }
  
  // Create Mexican recipes
  console.log("\n🇲🇽 Creating Mexican Recipes:");
  const mexicanCategoryUid = await getCategory("Mexican");
  for (const recipe of mexicanRecipes) {
    const uid = await createRecipe(recipe, authorUid, mexicanCategoryUid);
    if (uid) await publishEntry(uid);
  }
  
  // Create Dessert recipes
  console.log("\n🍰 Creating Dessert Recipes:");
  const dessertCategoryUid = await getCategory("Desserts");
  for (const recipe of dessertRecipes) {
    const uid = await createRecipe(recipe, authorUid, dessertCategoryUid);
    if (uid) await publishEntry(uid);
  }
  
  console.log("\n=============================================");
  console.log("  Done! Created and published all recipes.");
  console.log("=============================================");
}

main().catch(console.error);
