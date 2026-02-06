/**
 * Script to add 10 Indian and 10 American recipes
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
  difficulty: "easy" | "medium" | "hard";
  cooking_time: number;
  ingredients: { name: string; amount: string; unit?: string }[];
  steps: string;
  tags: string[];
  imageUrl: string;
}

// 10 Indian Recipes
const indianRecipes: RecipeData[] = [
  {
    title: "Samosa",
    url: "/recipes/samosa",
    description: "Crispy fried pastry with spiced potato and pea filling - India's favorite snack!",
    difficulty: "medium",
    cooking_time: 45,
    ingredients: [
      { name: "Potatoes", amount: "4", unit: "medium" },
      { name: "Green peas", amount: "1", unit: "cup" },
      { name: "All-purpose flour", amount: "2", unit: "cups" },
      { name: "Cumin seeds", amount: "1", unit: "tsp" },
      { name: "Garam masala", amount: "1", unit: "tsp" },
      { name: "Green chilies", amount: "2", unit: "pieces" },
      { name: "Coriander leaves", amount: "1/4", unit: "cup" },
      { name: "Oil for frying", amount: "500", unit: "ml" },
    ],
    steps: `1. Boil and mash potatoes coarsely.
2. Heat oil, add cumin seeds and green chilies.
3. Add peas, spices, and mashed potatoes. Mix well.
4. Make dough with flour, salt, and oil. Rest for 30 mins.
5. Roll dough into circles, cut in half.
6. Form cones and fill with potato mixture.
7. Seal edges with water.
8. Deep fry until golden brown.
9. Serve hot with mint and tamarind chutney.`,
    tags: ["indian", "snack", "vegetarian", "fried", "street-food"],
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
  },
  {
    title: "Aloo Gobi",
    url: "/recipes/aloo-gobi",
    description: "Classic North Indian dry curry with potatoes and cauliflower in aromatic spices.",
    difficulty: "easy",
    cooking_time: 30,
    ingredients: [
      { name: "Cauliflower", amount: "1", unit: "medium head" },
      { name: "Potatoes", amount: "3", unit: "medium" },
      { name: "Onion", amount: "1", unit: "large" },
      { name: "Tomatoes", amount: "2", unit: "medium" },
      { name: "Turmeric", amount: "1/2", unit: "tsp" },
      { name: "Cumin seeds", amount: "1", unit: "tsp" },
      { name: "Coriander powder", amount: "1", unit: "tsp" },
      { name: "Ginger-garlic paste", amount: "1", unit: "tbsp" },
    ],
    steps: `1. Cut cauliflower into florets and potatoes into cubes.
2. Heat oil, add cumin seeds until they splutter.
3. Add onions and sauté until golden.
4. Add ginger-garlic paste and tomatoes.
5. Add all spices and cook for 2 minutes.
6. Add potatoes first, cook for 5 minutes.
7. Add cauliflower, cover and cook on low heat.
8. Stir occasionally until vegetables are tender.
9. Garnish with fresh coriander and serve.`,
    tags: ["indian", "vegetarian", "healthy", "curry", "punjabi"],
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
  },
  {
    title: "Tandoori Chicken",
    url: "/recipes/tandoori-chicken",
    description: "Smoky, spicy marinated chicken roasted to perfection - a Punjabi classic!",
    difficulty: "medium",
    cooking_time: 60,
    ingredients: [
      { name: "Chicken legs", amount: "8", unit: "pieces" },
      { name: "Yogurt", amount: "1", unit: "cup" },
      { name: "Tandoori masala", amount: "3", unit: "tbsp" },
      { name: "Lemon juice", amount: "3", unit: "tbsp" },
      { name: "Ginger-garlic paste", amount: "2", unit: "tbsp" },
      { name: "Red chili powder", amount: "1", unit: "tsp" },
      { name: "Kashmiri red chili", amount: "2", unit: "tsp" },
      { name: "Mustard oil", amount: "2", unit: "tbsp" },
    ],
    steps: `1. Make deep cuts in chicken pieces.
2. Mix yogurt with all spices and lemon juice.
3. Marinate chicken for at least 4 hours (overnight best).
4. Preheat oven to 450°F (230°C).
5. Place chicken on wire rack over baking tray.
6. Roast for 25-30 minutes, turning once.
7. Baste with butter and roast 5 more minutes.
8. Serve with mint chutney and onion rings.`,
    tags: ["indian", "chicken", "grilled", "punjabi", "spicy"],
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80",
  },
  {
    title: "Rajma Chawal",
    url: "/recipes/rajma-chawal",
    description: "Hearty kidney bean curry served over steamed rice - ultimate North Indian comfort food.",
    difficulty: "easy",
    cooking_time: 50,
    ingredients: [
      { name: "Kidney beans (soaked)", amount: "2", unit: "cups" },
      { name: "Basmati rice", amount: "2", unit: "cups" },
      { name: "Onions", amount: "2", unit: "large" },
      { name: "Tomatoes", amount: "3", unit: "medium" },
      { name: "Ginger-garlic paste", amount: "2", unit: "tbsp" },
      { name: "Rajma masala", amount: "2", unit: "tbsp" },
      { name: "Cream", amount: "2", unit: "tbsp" },
      { name: "Kasuri methi", amount: "1", unit: "tbsp" },
    ],
    steps: `1. Pressure cook soaked rajma until soft.
2. Sauté onions until golden brown.
3. Add ginger-garlic paste and tomatoes.
4. Cook until oil separates.
5. Add spices and cooked rajma with water.
6. Simmer for 20 minutes.
7. Mash some beans for thick gravy.
8. Add cream and kasuri methi.
9. Serve hot over steamed basmati rice.`,
    tags: ["indian", "vegetarian", "comfort-food", "punjabi", "beans"],
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
  },
  {
    title: "Mutter Paneer",
    url: "/recipes/mutter-paneer",
    description: "Soft paneer cubes and green peas in a rich, creamy tomato gravy.",
    difficulty: "medium",
    cooking_time: 35,
    ingredients: [
      { name: "Paneer", amount: "300", unit: "g" },
      { name: "Green peas", amount: "1", unit: "cup" },
      { name: "Onions", amount: "2", unit: "medium" },
      { name: "Tomato puree", amount: "1", unit: "cup" },
      { name: "Cream", amount: "1/4", unit: "cup" },
      { name: "Garam masala", amount: "1", unit: "tsp" },
      { name: "Kashmiri chili", amount: "1", unit: "tsp" },
      { name: "Ginger-garlic paste", amount: "1", unit: "tbsp" },
    ],
    steps: `1. Cut paneer into cubes, lightly fry and set aside.
2. Blend onions to paste and sauté until golden.
3. Add ginger-garlic paste and cook.
4. Add tomato puree and spices.
5. Cook until oil separates.
6. Add water to make gravy consistency.
7. Add peas and simmer until cooked.
8. Add paneer and cream.
9. Garnish with coriander and serve with roti.`,
    tags: ["indian", "paneer", "vegetarian", "curry", "creamy"],
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
  },
  {
    title: "Idli Sambhar",
    url: "/recipes/idli-sambhar",
    description: "Soft steamed rice cakes served with tangy lentil soup and coconut chutney.",
    difficulty: "medium",
    cooking_time: 40,
    ingredients: [
      { name: "Idli rice", amount: "2", unit: "cups" },
      { name: "Urad dal", amount: "1", unit: "cup" },
      { name: "Toor dal", amount: "1", unit: "cup" },
      { name: "Tamarind", amount: "1", unit: "tbsp" },
      { name: "Sambhar powder", amount: "2", unit: "tbsp" },
      { name: "Mixed vegetables", amount: "1", unit: "cup" },
      { name: "Mustard seeds", amount: "1", unit: "tsp" },
      { name: "Curry leaves", amount: "10", unit: "leaves" },
    ],
    steps: `1. Soak rice and dal separately for 6 hours.
2. Grind to smooth batter and ferment overnight.
3. Steam in idli molds for 10-12 minutes.
4. For sambhar: Cook toor dal until soft.
5. Add tamarind water, vegetables, and spices.
6. Simmer until vegetables are cooked.
7. Temper with mustard seeds and curry leaves.
8. Serve hot idli with sambhar and coconut chutney.`,
    tags: ["indian", "south-indian", "vegetarian", "breakfast", "healthy"],
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80",
  },
  {
    title: "Chicken Korma",
    url: "/recipes/chicken-korma",
    description: "Mild, creamy Mughlai chicken curry with yogurt, cream, and aromatic spices.",
    difficulty: "medium",
    cooking_time: 50,
    ingredients: [
      { name: "Chicken", amount: "500", unit: "g" },
      { name: "Yogurt", amount: "1", unit: "cup" },
      { name: "Cream", amount: "1/2", unit: "cup" },
      { name: "Cashews", amount: "1/4", unit: "cup" },
      { name: "Onions (fried)", amount: "1", unit: "cup" },
      { name: "Saffron", amount: "1", unit: "pinch" },
      { name: "Green cardamom", amount: "4", unit: "pods" },
      { name: "Ginger-garlic paste", amount: "2", unit: "tbsp" },
    ],
    steps: `1. Blend fried onions and cashews to paste.
2. Marinate chicken in yogurt and spices.
3. Sauté whole spices in ghee.
4. Add onion-cashew paste and cook.
5. Add marinated chicken and cook.
6. Add saffron soaked in warm milk.
7. Simmer until chicken is tender.
8. Finish with cream and serve with naan.`,
    tags: ["indian", "chicken", "mughlai", "creamy", "mild"],
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
  },
  {
    title: "Bhindi Masala",
    url: "/recipes/bhindi-masala",
    description: "Crispy okra stir-fried with onions, tomatoes, and Indian spices.",
    difficulty: "easy",
    cooking_time: 25,
    ingredients: [
      { name: "Okra (bhindi)", amount: "500", unit: "g" },
      { name: "Onions", amount: "2", unit: "medium" },
      { name: "Tomatoes", amount: "2", unit: "medium" },
      { name: "Turmeric", amount: "1/2", unit: "tsp" },
      { name: "Coriander powder", amount: "1", unit: "tsp" },
      { name: "Amchur powder", amount: "1", unit: "tsp" },
      { name: "Red chili powder", amount: "1/2", unit: "tsp" },
      { name: "Cumin seeds", amount: "1", unit: "tsp" },
    ],
    steps: `1. Wash okra, dry completely, and cut into pieces.
2. Heat oil and fry okra until crispy. Set aside.
3. In same pan, add cumin seeds.
4. Add onions and sauté until golden.
5. Add tomatoes and all spices.
6. Cook until tomatoes are soft.
7. Add fried okra and mix gently.
8. Serve hot with roti or paratha.`,
    tags: ["indian", "vegetarian", "okra", "dry-curry", "healthy"],
    imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80",
  },
  {
    title: "Gulab Jamun",
    url: "/recipes/gulab-jamun",
    description: "Soft, melt-in-mouth milk dumplings soaked in rose-flavored sugar syrup.",
    difficulty: "medium",
    cooking_time: 40,
    ingredients: [
      { name: "Milk powder", amount: "1", unit: "cup" },
      { name: "All-purpose flour", amount: "1/4", unit: "cup" },
      { name: "Ghee", amount: "2", unit: "tbsp" },
      { name: "Milk", amount: "1/4", unit: "cup" },
      { name: "Sugar", amount: "2", unit: "cups" },
      { name: "Cardamom powder", amount: "1/2", unit: "tsp" },
      { name: "Rose water", amount: "1", unit: "tsp" },
      { name: "Oil for frying", amount: "500", unit: "ml" },
    ],
    steps: `1. Make sugar syrup with water, sugar, cardamom, and rose water.
2. Mix milk powder, flour, and ghee.
3. Add milk gradually to form soft dough.
4. Shape into smooth balls without cracks.
5. Heat oil on low-medium heat.
6. Fry balls slowly until deep brown.
7. Soak in warm sugar syrup for 2 hours.
8. Serve warm or at room temperature.`,
    tags: ["indian", "dessert", "sweet", "festival", "vegetarian"],
    imageUrl: "https://images.unsplash.com/photo-1666190094726-ce2d08e395af?w=800&q=80",
  },
  {
    title: "Vada Pav",
    url: "/recipes/vada-pav",
    description: "Mumbai's iconic street food - spicy potato fritter in a soft bun with chutneys.",
    difficulty: "medium",
    cooking_time: 35,
    ingredients: [
      { name: "Potatoes", amount: "4", unit: "medium" },
      { name: "Pav (bread rolls)", amount: "8", unit: "pieces" },
      { name: "Besan (gram flour)", amount: "1", unit: "cup" },
      { name: "Green chilies", amount: "4", unit: "pieces" },
      { name: "Garlic", amount: "6", unit: "cloves" },
      { name: "Mustard seeds", amount: "1", unit: "tsp" },
      { name: "Turmeric", amount: "1/2", unit: "tsp" },
      { name: "Oil for frying", amount: "500", unit: "ml" },
    ],
    steps: `1. Boil and mash potatoes.
2. Make tempering with mustard seeds, curry leaves, garlic, and chilies.
3. Add to potatoes with turmeric. Mix well.
4. Shape into round patties (vadas).
5. Make batter with besan, salt, and water.
6. Dip vadas in batter and deep fry until golden.
7. Slit pav, apply green and tamarind chutney.
8. Place hot vada inside and serve immediately.`,
    tags: ["indian", "street-food", "vegetarian", "mumbai", "snack"],
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
  },
];

// 10 American Recipes
const americanRecipes: RecipeData[] = [
  {
    title: "Buffalo Wings",
    url: "/recipes/buffalo-wings",
    description: "Crispy fried chicken wings tossed in spicy buffalo sauce - game day favorite!",
    difficulty: "easy",
    cooking_time: 35,
    ingredients: [
      { name: "Chicken wings", amount: "2", unit: "lbs" },
      { name: "Hot sauce", amount: "1/2", unit: "cup" },
      { name: "Butter", amount: "1/4", unit: "cup" },
      { name: "Garlic powder", amount: "1", unit: "tsp" },
      { name: "Paprika", amount: "1", unit: "tsp" },
      { name: "Salt", amount: "1", unit: "tsp" },
      { name: "Vegetable oil", amount: "4", unit: "cups" },
      { name: "Blue cheese dressing", amount: "1", unit: "cup" },
    ],
    steps: `1. Pat wings dry and season with salt and spices.
2. Heat oil to 375°F (190°C).
3. Fry wings in batches for 10-12 minutes until crispy.
4. Melt butter and mix with hot sauce.
5. Toss fried wings in buffalo sauce.
6. Serve with blue cheese dressing and celery sticks.`,
    tags: ["american", "chicken", "fried", "spicy", "appetizer"],
    imageUrl: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800&q=80",
  },
  {
    title: "Clam Chowder",
    url: "/recipes/clam-chowder",
    description: "Creamy New England clam chowder with potatoes and bacon - coastal comfort!",
    difficulty: "medium",
    cooking_time: 45,
    ingredients: [
      { name: "Clams (canned)", amount: "2", unit: "cans" },
      { name: "Potatoes", amount: "3", unit: "medium" },
      { name: "Bacon", amount: "4", unit: "strips" },
      { name: "Onion", amount: "1", unit: "large" },
      { name: "Heavy cream", amount: "2", unit: "cups" },
      { name: "Butter", amount: "3", unit: "tbsp" },
      { name: "Thyme", amount: "1", unit: "tsp" },
      { name: "Bay leaf", amount: "1", unit: "leaf" },
    ],
    steps: `1. Cook bacon until crispy, crumble and set aside.
2. Sauté onion in bacon fat until soft.
3. Add potatoes, clam juice, and bay leaf.
4. Simmer until potatoes are tender.
5. Add cream, clams, and thyme.
6. Heat through without boiling.
7. Serve topped with crumbled bacon.`,
    tags: ["american", "soup", "seafood", "creamy", "new-england"],
    imageUrl: "https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=800&q=80",
  },
  {
    title: "BLT Sandwich",
    url: "/recipes/blt-sandwich",
    description: "Classic bacon, lettuce, and tomato sandwich - simple American perfection!",
    difficulty: "easy",
    cooking_time: 15,
    ingredients: [
      { name: "Bacon", amount: "8", unit: "strips" },
      { name: "Bread (toasted)", amount: "4", unit: "slices" },
      { name: "Lettuce", amount: "4", unit: "leaves" },
      { name: "Tomato", amount: "1", unit: "large" },
      { name: "Mayonnaise", amount: "2", unit: "tbsp" },
      { name: "Salt", amount: "1/4", unit: "tsp" },
      { name: "Black pepper", amount: "1/4", unit: "tsp" },
      { name: "Avocado (optional)", amount: "1/2", unit: "medium" },
    ],
    steps: `1. Cook bacon until crispy.
2. Toast bread slices.
3. Spread mayonnaise on both slices.
4. Layer lettuce on one slice.
5. Add sliced tomatoes and season.
6. Add bacon strips.
7. Top with second bread slice.
8. Cut diagonally and serve.`,
    tags: ["american", "sandwich", "bacon", "quick", "lunch"],
    imageUrl: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=800&q=80",
  },
  {
    title: "Sloppy Joes",
    url: "/recipes/sloppy-joes",
    description: "Messy, delicious ground beef in tangy tomato sauce served on soft buns.",
    difficulty: "easy",
    cooking_time: 30,
    ingredients: [
      { name: "Ground beef", amount: "1", unit: "lb" },
      { name: "Onion", amount: "1", unit: "medium" },
      { name: "Bell pepper", amount: "1", unit: "medium" },
      { name: "Ketchup", amount: "1/2", unit: "cup" },
      { name: "Brown sugar", amount: "2", unit: "tbsp" },
      { name: "Worcestershire sauce", amount: "1", unit: "tbsp" },
      { name: "Mustard", amount: "1", unit: "tbsp" },
      { name: "Hamburger buns", amount: "6", unit: "buns" },
    ],
    steps: `1. Brown ground beef in a large skillet.
2. Add diced onion and bell pepper, cook until soft.
3. Drain excess fat.
4. Add ketchup, brown sugar, Worcestershire, and mustard.
5. Simmer for 10 minutes.
6. Toast hamburger buns lightly.
7. Spoon meat mixture onto buns.
8. Serve with pickles and chips.`,
    tags: ["american", "beef", "sandwich", "comfort-food", "family"],
    imageUrl: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&q=80",
  },
  {
    title: "Cornbread",
    url: "/recipes/cornbread",
    description: "Golden, slightly sweet Southern cornbread - perfect with chili or BBQ!",
    difficulty: "easy",
    cooking_time: 30,
    ingredients: [
      { name: "Cornmeal", amount: "1", unit: "cup" },
      { name: "All-purpose flour", amount: "1", unit: "cup" },
      { name: "Sugar", amount: "1/4", unit: "cup" },
      { name: "Buttermilk", amount: "1", unit: "cup" },
      { name: "Eggs", amount: "2", unit: "large" },
      { name: "Butter (melted)", amount: "1/4", unit: "cup" },
      { name: "Baking powder", amount: "1", unit: "tbsp" },
      { name: "Salt", amount: "1/2", unit: "tsp" },
    ],
    steps: `1. Preheat oven to 400°F (200°C).
2. Grease a 9-inch cast iron skillet or baking pan.
3. Mix dry ingredients together.
4. Whisk buttermilk, eggs, and melted butter.
5. Combine wet and dry ingredients.
6. Pour into prepared pan.
7. Bake 20-25 minutes until golden.
8. Serve warm with butter and honey.`,
    tags: ["american", "bread", "southern", "side-dish", "baking"],
    imageUrl: "https://images.unsplash.com/photo-1597733153203-a54d0fbc47de?w=800&q=80",
  },
  {
    title: "Cobb Salad",
    url: "/recipes/cobb-salad",
    description: "Classic American chopped salad with chicken, bacon, eggs, avocado, and blue cheese.",
    difficulty: "easy",
    cooking_time: 25,
    ingredients: [
      { name: "Romaine lettuce", amount: "1", unit: "head" },
      { name: "Grilled chicken", amount: "2", unit: "breasts" },
      { name: "Bacon", amount: "6", unit: "strips" },
      { name: "Hard-boiled eggs", amount: "2", unit: "large" },
      { name: "Avocado", amount: "1", unit: "large" },
      { name: "Cherry tomatoes", amount: "1", unit: "cup" },
      { name: "Blue cheese", amount: "1/2", unit: "cup" },
      { name: "Red wine vinaigrette", amount: "1/2", unit: "cup" },
    ],
    steps: `1. Chop lettuce and arrange on large platter.
2. Dice grilled chicken and arrange in a row.
3. Crumble cooked bacon in another row.
4. Chop hard-boiled eggs and add.
5. Dice avocado and tomatoes, add in rows.
6. Crumble blue cheese on top.
7. Drizzle with vinaigrette.
8. Toss at table and serve.`,
    tags: ["american", "salad", "chicken", "healthy", "lunch"],
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  },
  {
    title: "Meatloaf",
    url: "/recipes/meatloaf",
    description: "Classic American meatloaf with sweet and tangy glaze - comfort food at its best!",
    difficulty: "medium",
    cooking_time: 75,
    ingredients: [
      { name: "Ground beef", amount: "2", unit: "lbs" },
      { name: "Breadcrumbs", amount: "1", unit: "cup" },
      { name: "Onion", amount: "1", unit: "medium" },
      { name: "Eggs", amount: "2", unit: "large" },
      { name: "Ketchup", amount: "1/2", unit: "cup" },
      { name: "Brown sugar", amount: "2", unit: "tbsp" },
      { name: "Worcestershire sauce", amount: "2", unit: "tbsp" },
      { name: "Garlic powder", amount: "1", unit: "tsp" },
    ],
    steps: `1. Preheat oven to 350°F (175°C).
2. Mix ground beef, breadcrumbs, onion, eggs, and seasonings.
3. Shape into a loaf in baking pan.
4. Mix ketchup, brown sugar, and mustard for glaze.
5. Spread half the glaze on top.
6. Bake for 45 minutes.
7. Add remaining glaze and bake 15 more minutes.
8. Rest 10 minutes before slicing.`,
    tags: ["american", "beef", "comfort-food", "dinner", "classic"],
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
  },
  {
    title: "Key Lime Pie",
    url: "/recipes/key-lime-pie",
    description: "Tangy, creamy Florida Key lime pie with graham cracker crust and whipped cream.",
    difficulty: "medium",
    cooking_time: 45,
    ingredients: [
      { name: "Key lime juice", amount: "1/2", unit: "cup" },
      { name: "Sweetened condensed milk", amount: "14", unit: "oz" },
      { name: "Egg yolks", amount: "4", unit: "large" },
      { name: "Graham crackers", amount: "1.5", unit: "cups" },
      { name: "Butter (melted)", amount: "6", unit: "tbsp" },
      { name: "Sugar", amount: "3", unit: "tbsp" },
      { name: "Whipped cream", amount: "1", unit: "cup" },
      { name: "Lime zest", amount: "1", unit: "tbsp" },
    ],
    steps: `1. Mix graham crackers, butter, and sugar for crust.
2. Press into pie pan and bake at 350°F for 10 mins.
3. Whisk egg yolks and condensed milk.
4. Add lime juice and zest, mix well.
5. Pour into cooled crust.
6. Bake 15 minutes until set.
7. Cool, then refrigerate 4 hours.
8. Top with whipped cream before serving.`,
    tags: ["american", "dessert", "pie", "florida", "citrus"],
    imageUrl: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80",
  },
  {
    title: "Chicken Pot Pie",
    url: "/recipes/chicken-pot-pie",
    description: "Creamy chicken and vegetable filling under a flaky golden crust.",
    difficulty: "medium",
    cooking_time: 60,
    ingredients: [
      { name: "Chicken breast", amount: "2", unit: "cups" },
      { name: "Pie crust", amount: "2", unit: "sheets" },
      { name: "Mixed vegetables", amount: "2", unit: "cups" },
      { name: "Chicken broth", amount: "1", unit: "cup" },
      { name: "Heavy cream", amount: "1/2", unit: "cup" },
      { name: "Butter", amount: "4", unit: "tbsp" },
      { name: "Flour", amount: "1/4", unit: "cup" },
      { name: "Thyme", amount: "1", unit: "tsp" },
    ],
    steps: `1. Cook and shred chicken breast.
2. Line pie dish with one crust.
3. Make roux with butter and flour.
4. Add broth and cream, cook until thick.
5. Add chicken, vegetables, and seasonings.
6. Pour filling into crust.
7. Top with second crust, crimp edges.
8. Cut slits and bake at 400°F for 30-35 mins.`,
    tags: ["american", "chicken", "pie", "comfort-food", "dinner"],
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
  },
  {
    title: "Banana Bread",
    url: "/recipes/banana-bread",
    description: "Moist, sweet banana bread with walnuts - perfect for breakfast or snacking!",
    difficulty: "easy",
    cooking_time: 65,
    ingredients: [
      { name: "Ripe bananas", amount: "3", unit: "large" },
      { name: "All-purpose flour", amount: "2", unit: "cups" },
      { name: "Sugar", amount: "3/4", unit: "cup" },
      { name: "Butter (softened)", amount: "1/3", unit: "cup" },
      { name: "Egg", amount: "1", unit: "large" },
      { name: "Baking soda", amount: "1", unit: "tsp" },
      { name: "Vanilla extract", amount: "1", unit: "tsp" },
      { name: "Walnuts (optional)", amount: "1/2", unit: "cup" },
    ],
    steps: `1. Preheat oven to 350°F (175°C).
2. Mash bananas in a large bowl.
3. Mix in melted butter.
4. Add sugar, egg, and vanilla.
5. Stir in baking soda and flour.
6. Fold in walnuts if using.
7. Pour into greased loaf pan.
8. Bake 60-65 minutes until done.`,
    tags: ["american", "bread", "banana", "baking", "breakfast"],
    imageUrl: "https://images.unsplash.com/photo-1606101273945-e9eba87e98de?w=800&q=80",
  },
];

async function getAuthor() {
  const response = await fetch(
    `https://api.contentstack.io/v3/content_types/author/entries`,
    {
      headers: { "api_key": API_KEY, "authorization": MANAGEMENT_TOKEN },
    }
  );
  const data = await response.json();
  return data.entries?.[0]?.uid || null;
}

async function getCategory(name: string) {
  const response = await fetch(
    `https://api.contentstack.io/v3/content_types/category/entries`,
    {
      headers: { "api_key": API_KEY, "authorization": MANAGEMENT_TOKEN },
    }
  );
  const data = await response.json();
  const cat = data.entries?.find((c: { name: string }) => c.name === name);
  return cat?.uid || null;
}

async function uploadImage(url: string, name: string): Promise<string | null> {
  try {
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) return null;
    
    const buffer = await imageResponse.arrayBuffer();
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('asset[upload]', blob, `${name}.jpg`);
    formData.append('asset[title]', name);
    
    const uploadResponse = await fetch(
      `https://api.contentstack.io/v3/assets`,
      {
        method: 'POST',
        headers: { 'api_key': API_KEY, 'authorization': MANAGEMENT_TOKEN },
        body: formData,
      }
    );
    
    if (!uploadResponse.ok) return null;
    const data = await uploadResponse.json();
    
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
          asset: { environments: ["development"], locales: ["en-us"] },
        }),
      }
    );
    
    return data.asset.uid;
  } catch {
    return null;
  }
}

async function createRecipe(recipe: RecipeData, authorUid: string | null, categoryUid: string | null) {
  // Upload image
  const fileName = recipe.title.toLowerCase().replace(/\s+/g, '-');
  const imageUid = await uploadImage(recipe.imageUrl, fileName);
  
  const entry: Record<string, unknown> = {
    title: recipe.title,
    url: recipe.url,
    description: recipe.description,
    difficulty: recipe.difficulty,
    cooking_time: recipe.cooking_time,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    tags: recipe.tags,
  };
  
  if (authorUid) entry.author = [{ uid: authorUid, _content_type_uid: "author" }];
  if (categoryUid) entry.category = [{ uid: categoryUid, _content_type_uid: "category" }];
  if (imageUid) entry.featured_image = imageUid;
  
  const response = await fetch(
    `https://api.contentstack.io/v3/content_types/recipe/entries`,
    {
      method: "POST",
      headers: {
        "api_key": API_KEY,
        "authorization": MANAGEMENT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entry }),
    }
  );
  
  if (!response.ok) return null;
  const data = await response.json();
  
  // Publish
  await fetch(
    `https://api.contentstack.io/v3/content_types/recipe/entries/${data.entry.uid}/publish`,
    {
      method: "POST",
      headers: {
        "api_key": API_KEY,
        "authorization": MANAGEMENT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entry: { environments: ["development"], locales: ["en-us"] },
      }),
    }
  );
  
  return data.entry.uid;
}

async function main() {
  console.log("=============================================");
  console.log("  Adding 10 Indian + 10 American Recipes");
  console.log("=============================================\n");
  
  const authorUid = await getAuthor();
  const indianCategoryUid = await getCategory("Indian Cuisine");
  const americanCategoryUid = await getCategory("American Cuisine");
  
  console.log(`Author: ${authorUid}`);
  console.log(`Indian Cuisine: ${indianCategoryUid}`);
  console.log(`American Cuisine: ${americanCategoryUid}\n`);
  
  // Create Indian recipes
  console.log("🇮🇳 Creating Indian Recipes:\n");
  for (const recipe of indianRecipes) {
    console.log(`  ${recipe.title}...`);
    const uid = await createRecipe(recipe, authorUid, indianCategoryUid);
    if (uid) {
      console.log(`    ✓ Created and published`);
    } else {
      console.log(`    ✗ Failed`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  
  // Create American recipes
  console.log("\n🇺🇸 Creating American Recipes:\n");
  for (const recipe of americanRecipes) {
    console.log(`  ${recipe.title}...`);
    const uid = await createRecipe(recipe, authorUid, americanCategoryUid);
    if (uid) {
      console.log(`    ✓ Created and published`);
    } else {
      console.log(`    ✗ Failed`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log("\n=============================================");
  console.log("  Done! Added 20 new recipes.");
  console.log("=============================================");
}

main().catch(console.error);
