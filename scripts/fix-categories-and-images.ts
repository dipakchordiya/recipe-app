/**
 * Script to:
 * 1. Check all categories and create recipes for empty ones
 * 2. Upload images for recipes that don't have them
 * 3. Publish all entries
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
  imageUrl?: string;
}

// Recipes for categories that might be empty
const newRecipes: RecipeData[] = [
  // Salads
  {
    title: "Caesar Salad",
    url: "/recipes/caesar-salad",
    description: "Classic Caesar salad with crisp romaine, parmesan, croutons, and creamy Caesar dressing.",
    category: "Salads",
    difficulty: "easy",
    cooking_time: 15,
    ingredients: [
      { name: "Romaine lettuce", amount: "2", unit: "heads" },
      { name: "Parmesan cheese", amount: "1/2", unit: "cup" },
      { name: "Croutons", amount: "1", unit: "cup" },
      { name: "Caesar dressing", amount: "1/2", unit: "cup" },
      { name: "Lemon juice", amount: "2", unit: "tbsp" },
      { name: "Garlic", amount: "2", unit: "cloves" },
      { name: "Anchovy paste", amount: "1", unit: "tsp" },
      { name: "Dijon mustard", amount: "1", unit: "tsp" },
      { name: "Olive oil", amount: "1/4", unit: "cup" },
      { name: "Black pepper", amount: "1/2", unit: "tsp" },
    ],
    steps: `1. Wash and dry romaine lettuce, tear into bite-sized pieces.
2. For dressing: blend garlic, anchovy paste, lemon juice, and mustard.
3. Slowly drizzle in olive oil while blending.
4. Add grated parmesan to dressing.
5. Place lettuce in a large bowl.
6. Drizzle dressing over lettuce and toss well.
7. Add croutons and toss gently.
8. Top with shaved parmesan.
9. Crack fresh black pepper on top.
10. Serve immediately while croutons are crispy.`,
    tags: ["salad", "vegetarian", "quick", "classic", "lunch"],
    imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800",
  },
  {
    title: "Greek Salad",
    url: "/recipes/greek-salad",
    description: "Fresh Mediterranean salad with tomatoes, cucumbers, olives, feta cheese, and oregano dressing.",
    category: "Salads",
    difficulty: "easy",
    cooking_time: 10,
    ingredients: [
      { name: "Tomatoes", amount: "4", unit: "medium" },
      { name: "Cucumber", amount: "1", unit: "large" },
      { name: "Red onion", amount: "1/2", unit: "medium" },
      { name: "Kalamata olives", amount: "1/2", unit: "cup" },
      { name: "Feta cheese", amount: "200", unit: "g" },
      { name: "Olive oil", amount: "1/4", unit: "cup" },
      { name: "Red wine vinegar", amount: "2", unit: "tbsp" },
      { name: "Dried oregano", amount: "1", unit: "tsp" },
      { name: "Salt", amount: "1/2", unit: "tsp" },
      { name: "Black pepper", amount: "1/4", unit: "tsp" },
    ],
    steps: `1. Cut tomatoes into wedges.
2. Slice cucumber into half-moons.
3. Thinly slice red onion into rings.
4. Combine vegetables in a large bowl.
5. Add kalamata olives.
6. Whisk olive oil, vinegar, oregano, salt, and pepper.
7. Pour dressing over vegetables.
8. Toss gently to combine.
9. Top with crumbled or sliced feta cheese.
10. Serve immediately or chill for 15 minutes.`,
    tags: ["salad", "greek", "mediterranean", "vegetarian", "healthy"],
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800",
  },
  // Soups
  {
    title: "Tomato Basil Soup",
    url: "/recipes/tomato-basil-soup",
    description: "Creamy, comforting tomato soup with fresh basil. Perfect with grilled cheese!",
    category: "Soups",
    difficulty: "easy",
    cooking_time: 35,
    ingredients: [
      { name: "Canned tomatoes", amount: "800", unit: "g" },
      { name: "Onion", amount: "1", unit: "large" },
      { name: "Garlic", amount: "4", unit: "cloves" },
      { name: "Fresh basil", amount: "1/2", unit: "cup" },
      { name: "Vegetable broth", amount: "2", unit: "cups" },
      { name: "Heavy cream", amount: "1/2", unit: "cup" },
      { name: "Olive oil", amount: "2", unit: "tbsp" },
      { name: "Sugar", amount: "1", unit: "tsp" },
      { name: "Salt", amount: "1", unit: "tsp" },
      { name: "Black pepper", amount: "1/2", unit: "tsp" },
    ],
    steps: `1. Heat olive oil in a large pot over medium heat.
2. Sauté diced onion until softened, about 5 minutes.
3. Add minced garlic, cook 1 minute.
4. Pour in canned tomatoes and vegetable broth.
5. Add sugar, salt, and pepper.
6. Bring to a boil, then simmer for 20 minutes.
7. Add most of the fresh basil (reserve some for garnish).
8. Blend soup until smooth with immersion blender.
9. Stir in heavy cream and heat through.
10. Serve topped with fresh basil and a drizzle of cream.`,
    tags: ["soup", "tomato", "vegetarian", "comfort-food", "creamy"],
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
  },
  {
    title: "Chicken Noodle Soup",
    url: "/recipes/chicken-noodle-soup",
    description: "Classic homemade chicken noodle soup - the ultimate comfort food for cold days.",
    category: "Soups",
    difficulty: "medium",
    cooking_time: 45,
    ingredients: [
      { name: "Chicken breast", amount: "500", unit: "g" },
      { name: "Egg noodles", amount: "200", unit: "g" },
      { name: "Carrots", amount: "3", unit: "medium" },
      { name: "Celery", amount: "3", unit: "stalks" },
      { name: "Onion", amount: "1", unit: "large" },
      { name: "Chicken broth", amount: "8", unit: "cups" },
      { name: "Garlic", amount: "3", unit: "cloves" },
      { name: "Fresh thyme", amount: "4", unit: "sprigs" },
      { name: "Bay leaves", amount: "2", unit: "leaves" },
      { name: "Fresh parsley", amount: "1/4", unit: "cup" },
    ],
    steps: `1. Place chicken in pot with broth, bring to boil.
2. Reduce heat, simmer until chicken is cooked (20 min).
3. Remove chicken, shred with forks, set aside.
4. Add diced carrots, celery, onion to broth.
5. Add garlic, thyme, and bay leaves.
6. Simmer until vegetables are tender (15 min).
7. Add egg noodles, cook according to package.
8. Return shredded chicken to pot.
9. Remove thyme sprigs and bay leaves.
10. Stir in parsley, season with salt and pepper. Serve hot.`,
    tags: ["soup", "chicken", "comfort-food", "classic", "hearty"],
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
  },
  {
    title: "Minestrone Soup",
    url: "/recipes/minestrone-soup",
    description: "Hearty Italian vegetable soup loaded with beans, pasta, and fresh vegetables.",
    category: "Soups",
    difficulty: "easy",
    cooking_time: 40,
    ingredients: [
      { name: "Kidney beans", amount: "400", unit: "g" },
      { name: "Ditalini pasta", amount: "1", unit: "cup" },
      { name: "Zucchini", amount: "2", unit: "medium" },
      { name: "Carrots", amount: "2", unit: "medium" },
      { name: "Celery", amount: "2", unit: "stalks" },
      { name: "Canned tomatoes", amount: "400", unit: "g" },
      { name: "Vegetable broth", amount: "6", unit: "cups" },
      { name: "Spinach", amount: "2", unit: "cups" },
      { name: "Italian seasoning", amount: "1", unit: "tbsp" },
      { name: "Parmesan rind", amount: "1", unit: "piece" },
    ],
    steps: `1. Heat olive oil in a large pot.
2. Sauté diced carrots, celery, and onion until soft.
3. Add garlic and Italian seasoning, cook 1 minute.
4. Pour in tomatoes and vegetable broth.
5. Add parmesan rind for extra flavor.
6. Bring to boil, then add diced zucchini.
7. Simmer for 15 minutes.
8. Add pasta and beans, cook until pasta is al dente.
9. Stir in spinach until wilted.
10. Remove parmesan rind, serve with grated parmesan.`,
    tags: ["soup", "italian", "vegetarian", "healthy", "hearty"],
    imageUrl: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800",
  },
  // Breakfast
  {
    title: "Fluffy Pancakes",
    url: "/recipes/fluffy-pancakes",
    description: "Light and fluffy buttermilk pancakes - the perfect weekend breakfast!",
    category: "Breakfast",
    difficulty: "easy",
    cooking_time: 20,
    ingredients: [
      { name: "All-purpose flour", amount: "2", unit: "cups" },
      { name: "Buttermilk", amount: "2", unit: "cups" },
      { name: "Eggs", amount: "2", unit: "large" },
      { name: "Sugar", amount: "3", unit: "tbsp" },
      { name: "Baking powder", amount: "2", unit: "tsp" },
      { name: "Baking soda", amount: "1", unit: "tsp" },
      { name: "Salt", amount: "1/2", unit: "tsp" },
      { name: "Butter (melted)", amount: "4", unit: "tbsp" },
      { name: "Vanilla extract", amount: "1", unit: "tsp" },
      { name: "Maple syrup", amount: "1/2", unit: "cup" },
    ],
    steps: `1. Mix flour, sugar, baking powder, baking soda, and salt.
2. In another bowl, whisk buttermilk, eggs, melted butter, vanilla.
3. Pour wet ingredients into dry, stir until just combined.
4. Let batter rest 5 minutes (don't overmix - lumps are okay!).
5. Heat griddle or pan over medium heat, lightly grease.
6. Pour 1/4 cup batter per pancake.
7. Cook until bubbles form on surface, about 2 minutes.
8. Flip and cook until golden brown, 1-2 minutes more.
9. Keep warm in 200°F oven while making remaining pancakes.
10. Serve stacked with butter and maple syrup.`,
    tags: ["breakfast", "pancakes", "vegetarian", "weekend", "sweet"],
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
  },
  {
    title: "Avocado Toast",
    url: "/recipes/avocado-toast",
    description: "Trendy and nutritious avocado toast with poached egg and everything bagel seasoning.",
    category: "Breakfast",
    difficulty: "easy",
    cooking_time: 15,
    ingredients: [
      { name: "Sourdough bread", amount: "2", unit: "slices" },
      { name: "Ripe avocado", amount: "1", unit: "large" },
      { name: "Eggs", amount: "2", unit: "large" },
      { name: "Lime juice", amount: "1", unit: "tbsp" },
      { name: "Everything bagel seasoning", amount: "1", unit: "tsp" },
      { name: "Red pepper flakes", amount: "1/4", unit: "tsp" },
      { name: "Cherry tomatoes", amount: "4", unit: "halved" },
      { name: "Salt", amount: "1/4", unit: "tsp" },
      { name: "Black pepper", amount: "1/4", unit: "tsp" },
      { name: "Olive oil", amount: "1", unit: "tbsp" },
    ],
    steps: `1. Toast sourdough bread until golden and crispy.
2. Bring water to gentle simmer for poaching eggs.
3. Mash avocado with lime juice, salt, and pepper.
4. Add vinegar to water, create gentle whirlpool.
5. Crack eggs into water, poach 3-4 minutes.
6. Spread mashed avocado generously on toast.
7. Place poached egg on top of avocado.
8. Sprinkle with everything bagel seasoning.
9. Add cherry tomatoes and red pepper flakes.
10. Drizzle with olive oil and serve immediately.`,
    tags: ["breakfast", "avocado", "healthy", "trendy", "vegetarian"],
    imageUrl: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800",
  },
  // Seafood
  {
    title: "Garlic Butter Shrimp",
    url: "/recipes/garlic-butter-shrimp",
    description: "Quick and delicious garlic butter shrimp - ready in just 15 minutes!",
    category: "Seafood",
    difficulty: "easy",
    cooking_time: 15,
    ingredients: [
      { name: "Large shrimp (peeled)", amount: "500", unit: "g" },
      { name: "Butter", amount: "4", unit: "tbsp" },
      { name: "Garlic", amount: "6", unit: "cloves" },
      { name: "White wine", amount: "1/4", unit: "cup" },
      { name: "Lemon juice", amount: "2", unit: "tbsp" },
      { name: "Fresh parsley", amount: "1/4", unit: "cup" },
      { name: "Red pepper flakes", amount: "1/4", unit: "tsp" },
      { name: "Salt", amount: "1/2", unit: "tsp" },
      { name: "Black pepper", amount: "1/4", unit: "tsp" },
      { name: "Olive oil", amount: "1", unit: "tbsp" },
    ],
    steps: `1. Pat shrimp dry with paper towels.
2. Season shrimp with salt, pepper, and red pepper flakes.
3. Heat olive oil and 2 tbsp butter in large skillet.
4. Add shrimp in single layer, cook 1-2 minutes per side.
5. Remove shrimp, set aside.
6. Add remaining butter and minced garlic to pan.
7. Cook garlic until fragrant, about 30 seconds.
8. Pour in white wine, simmer 2 minutes.
9. Add lemon juice and return shrimp to pan.
10. Toss with chopped parsley and serve over pasta or rice.`,
    tags: ["seafood", "shrimp", "quick", "garlic", "butter"],
    imageUrl: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800",
  },
  {
    title: "Grilled Salmon",
    url: "/recipes/grilled-salmon",
    description: "Perfectly grilled salmon with lemon herb butter - healthy and delicious!",
    category: "Seafood",
    difficulty: "medium",
    cooking_time: 25,
    ingredients: [
      { name: "Salmon fillets", amount: "4", unit: "pieces" },
      { name: "Butter", amount: "4", unit: "tbsp" },
      { name: "Lemon", amount: "1", unit: "whole" },
      { name: "Fresh dill", amount: "2", unit: "tbsp" },
      { name: "Garlic", amount: "2", unit: "cloves" },
      { name: "Olive oil", amount: "2", unit: "tbsp" },
      { name: "Salt", amount: "1", unit: "tsp" },
      { name: "Black pepper", amount: "1/2", unit: "tsp" },
      { name: "Paprika", amount: "1/2", unit: "tsp" },
      { name: "Fresh parsley", amount: "2", unit: "tbsp" },
    ],
    steps: `1. Remove salmon from fridge 15 minutes before cooking.
2. Mix softened butter with dill, garlic, lemon zest.
3. Pat salmon dry, brush with olive oil.
4. Season with salt, pepper, and paprika.
5. Preheat grill to medium-high heat.
6. Oil grill grates to prevent sticking.
7. Place salmon skin-side down on grill.
8. Grill 4-5 minutes per side, depending on thickness.
9. Top with herb butter while still hot.
10. Squeeze fresh lemon juice and garnish with parsley.`,
    tags: ["seafood", "salmon", "grilled", "healthy", "omega-3"],
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
  },
  // Appetizers
  {
    title: "Bruschetta",
    url: "/recipes/bruschetta",
    description: "Classic Italian bruschetta with fresh tomatoes, basil, and garlic on crispy bread.",
    category: "Appetizers",
    difficulty: "easy",
    cooking_time: 15,
    ingredients: [
      { name: "Baguette", amount: "1", unit: "loaf" },
      { name: "Roma tomatoes", amount: "6", unit: "medium" },
      { name: "Fresh basil", amount: "1/4", unit: "cup" },
      { name: "Garlic", amount: "4", unit: "cloves" },
      { name: "Balsamic vinegar", amount: "2", unit: "tbsp" },
      { name: "Extra virgin olive oil", amount: "1/4", unit: "cup" },
      { name: "Salt", amount: "1/2", unit: "tsp" },
      { name: "Black pepper", amount: "1/4", unit: "tsp" },
      { name: "Parmesan cheese", amount: "2", unit: "tbsp" },
      { name: "Red onion", amount: "2", unit: "tbsp" },
    ],
    steps: `1. Dice tomatoes, removing excess seeds and juice.
2. Chiffonade fresh basil leaves.
3. Mince 2 cloves garlic, halve remaining 2 cloves.
4. Mix tomatoes, basil, minced garlic, onion in bowl.
5. Add olive oil, balsamic, salt, and pepper. Let marinate.
6. Slice baguette into 1/2-inch diagonal slices.
7. Brush bread with olive oil, toast until golden.
8. Rub toasted bread with halved garlic cloves.
9. Top each slice with tomato mixture.
10. Drizzle with olive oil and sprinkle parmesan.`,
    tags: ["appetizer", "italian", "vegetarian", "party", "quick"],
    imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800",
  },
  {
    title: "Spinach Artichoke Dip",
    url: "/recipes/spinach-artichoke-dip",
    description: "Creamy, cheesy spinach artichoke dip - the ultimate party appetizer!",
    category: "Appetizers",
    difficulty: "easy",
    cooking_time: 30,
    ingredients: [
      { name: "Frozen spinach", amount: "300", unit: "g" },
      { name: "Artichoke hearts", amount: "400", unit: "g" },
      { name: "Cream cheese", amount: "225", unit: "g" },
      { name: "Sour cream", amount: "1/2", unit: "cup" },
      { name: "Mayonnaise", amount: "1/4", unit: "cup" },
      { name: "Parmesan cheese", amount: "1/2", unit: "cup" },
      { name: "Mozzarella cheese", amount: "1", unit: "cup" },
      { name: "Garlic", amount: "3", unit: "cloves" },
      { name: "Salt", amount: "1/2", unit: "tsp" },
      { name: "Red pepper flakes", amount: "1/4", unit: "tsp" },
    ],
    steps: `1. Preheat oven to 350°F (175°C).
2. Thaw and squeeze excess water from spinach.
3. Drain and chop artichoke hearts.
4. Soften cream cheese in microwave.
5. Mix cream cheese, sour cream, mayo until smooth.
6. Add minced garlic, parmesan, half the mozzarella.
7. Fold in spinach and artichokes.
8. Season with salt and red pepper flakes.
9. Transfer to baking dish, top with remaining mozzarella.
10. Bake 25-30 minutes until bubbly. Serve with chips or bread.`,
    tags: ["appetizer", "dip", "cheesy", "party", "vegetarian"],
    imageUrl: "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=800",
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

async function getAllCategories() {
  try {
    const response = await fetch(
      `https://api.contentstack.io/v3/content_types/category/entries`,
      {
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
        },
      }
    );
    const data = await response.json();
    return data.entries || [];
  } catch {
    return [];
  }
}

async function getAllRecipes() {
  try {
    const response = await fetch(
      `https://api.contentstack.io/v3/content_types/recipe/entries`,
      {
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
        },
      }
    );
    const data = await response.json();
    return data.entries || [];
  } catch {
    return [];
  }
}

async function createCategory(name: string, emoji: string) {
  console.log(`  Creating category: ${name}...`);
  
  try {
    const response = await fetch(
      `https://api.contentstack.io/v3/content_types/category/entries`,
      {
        method: "POST",
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry: {
            title: name,
            name: name,
            url: `/categories/${name.toLowerCase().replace(/\s+/g, '-')}`,
            description: `Delicious ${name.toLowerCase()} recipes`,
            emoji: emoji,
          },
        }),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`    ✗ Failed: ${error}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`    ✓ Created: ${data.entry.uid}`);
    
    // Publish the category
    await publishEntry("category", data.entry.uid);
    
    return data.entry.uid;
  } catch (error) {
    console.log(`    ✗ Error: ${error}`);
    return null;
  }
}

async function uploadImageFromUrl(imageUrl: string, fileName: string): Promise<string | null> {
  console.log(`    Uploading image: ${fileName}...`);
  
  try {
    // Download image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.log(`    ✗ Failed to download image`);
      return null;
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    
    // Create form data
    const formData = new FormData();
    formData.append('asset[upload]', blob, `${fileName}.jpg`);
    formData.append('asset[title]', fileName);
    
    // Upload to Contentstack
    const uploadResponse = await fetch(
      `https://api.contentstack.io/v3/assets`,
      {
        method: 'POST',
        headers: {
          'api_key': API_KEY,
          'authorization': MANAGEMENT_TOKEN,
        },
        body: formData,
      }
    );
    
    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.log(`    ✗ Upload failed: ${error}`);
      return null;
    }
    
    const data = await uploadResponse.json();
    console.log(`    ✓ Uploaded: ${data.asset.uid}`);
    
    // Publish asset
    await fetch(
      `https://api.contentstack.io/v3/assets/${data.asset.uid}/publish`,
      {
        method: "POST",
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset: {
            environments: ["development"],
            locales: ["en-us"],
          },
        }),
      }
    );
    
    return data.asset.uid;
  } catch (error) {
    console.log(`    ✗ Error uploading: ${error}`);
    return null;
  }
}

async function createRecipe(recipe: RecipeData, authorUid: string | null, categoryUid: string | null) {
  console.log(`  Creating: ${recipe.title}...`);
  
  // Upload image if provided
  let imageUid: string | null = null;
  if (recipe.imageUrl) {
    imageUid = await uploadImageFromUrl(recipe.imageUrl, recipe.title.replace(/\s+/g, '-').toLowerCase());
  }
  
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
  
  if (imageUid) {
    entryData.featured_image = imageUid;
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

async function publishEntry(contentType: string, uid: string) {
  try {
    await fetch(
      `https://api.contentstack.io/v3/content_types/${contentType}/entries/${uid}/publish`,
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

async function updateRecipeWithImage(recipeUid: string, imageUid: string) {
  try {
    await fetch(
      `https://api.contentstack.io/v3/content_types/recipe/entries/${recipeUid}`,
      {
        method: "PUT",
        headers: {
          "api_key": API_KEY,
          "authorization": MANAGEMENT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry: {
            featured_image: imageUid,
          },
        }),
      }
    );
    console.log(`    ✓ Updated with image`);
    return true;
  } catch {
    console.log(`    ✗ Update failed`);
    return false;
  }
}

async function main() {
  console.log("=============================================");
  console.log("  Fixing Categories and Adding Images");
  console.log("=============================================\n");
  
  if (!API_KEY || !MANAGEMENT_TOKEN) {
    console.error("❌ Missing API credentials!");
    return;
  }
  
  // Get existing data
  const categories = await getAllCategories();
  const recipes = await getAllRecipes();
  const authorUid = await getAuthor();
  
  console.log(`Found ${categories.length} categories and ${recipes.length} recipes\n`);
  
  // Map category names to UIDs
  const categoryMap: Record<string, string> = {};
  categories.forEach((cat: { title: string; uid: string }) => {
    categoryMap[cat.title] = cat.uid;
  });
  
  // Count recipes per category
  const recipeCounts: Record<string, number> = {};
  recipes.forEach((recipe: { category?: { title?: string }[] }) => {
    const catTitle = recipe.category?.[0]?.title || "Unknown";
    recipeCounts[catTitle] = (recipeCounts[catTitle] || 0) + 1;
  });
  
  console.log("Current recipe counts per category:");
  Object.entries(recipeCounts).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });
  console.log("");
  
  // Define required categories with emojis
  const requiredCategories: Record<string, string> = {
    "Salads": "🥗",
    "Soups": "🍲",
    "Breakfast": "🍳",
    "Seafood": "🦐",
    "Appetizers": "🍢",
  };
  
  // Create missing categories
  console.log("Creating missing categories:");
  for (const [catName, emoji] of Object.entries(requiredCategories)) {
    if (!categoryMap[catName]) {
      const uid = await createCategory(catName, emoji);
      if (uid) categoryMap[catName] = uid;
    } else {
      console.log(`  ${catName} already exists`);
    }
  }
  console.log("");
  
  // Create recipes for empty/new categories
  console.log("Creating recipes for categories:");
  for (const recipe of newRecipes) {
    // Check if recipe already exists
    const exists = recipes.some((r: { title: string }) => r.title === recipe.title);
    if (exists) {
      console.log(`  Skipping ${recipe.title} (already exists)`);
      continue;
    }
    
    const categoryUid = categoryMap[recipe.category];
    if (!categoryUid) {
      console.log(`  Skipping ${recipe.title} (category ${recipe.category} not found)`);
      continue;
    }
    
    const uid = await createRecipe(recipe, authorUid, categoryUid);
    if (uid) await publishEntry("recipe", uid);
  }
  
  // Check and add images to existing recipes without images
  console.log("\nChecking existing recipes for missing images:");
  const recipesWithoutImages = recipes.filter((r: { featured_image?: unknown }) => !r.featured_image);
  console.log(`Found ${recipesWithoutImages.length} recipes without images`);
  
  // Default image URLs for different categories
  const defaultImages: Record<string, string> = {
    "Indian Cuisine": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    "American Cuisine": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
    "Italian": "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800",
    "Mexican": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
    "Desserts": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800",
    "Salads": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    "Soups": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
    "Breakfast": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800",
    "Seafood": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800",
    "Appetizers": "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800",
  };
  
  for (const recipe of recipesWithoutImages) {
    const catTitle = recipe.category?.[0]?.title || "Unknown";
    const imageUrl = defaultImages[catTitle] || defaultImages["Italian"];
    
    console.log(`  Adding image to: ${recipe.title}`);
    const imageUid = await uploadImageFromUrl(imageUrl, `${recipe.title.replace(/\s+/g, '-').toLowerCase()}-image`);
    
    if (imageUid) {
      const updated = await updateRecipeWithImage(recipe.uid, imageUid);
      if (updated) {
        await publishEntry("recipe", recipe.uid);
      }
    }
  }
  
  console.log("\n=============================================");
  console.log("  Done! Categories and recipes updated.");
  console.log("=============================================");
}

main().catch(console.error);
