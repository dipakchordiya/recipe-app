# 🍳 RecipeHub

A modern recipe-sharing platform built with Next.js 16. Share your culinary creations, discover new dishes, and connect with food enthusiasts from around the world.

![RecipeHub](https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop)

## ✨ Features

- **🔐 Authentication** - Simple email/password authentication with session cookies
- **📝 Recipe Management** - Create, edit, and delete recipes
- **🔍 Search & Filter** - Find recipes by name, category, difficulty, and more
- **❤️ Social Features** - Like, save/bookmark, and comment on recipes
- **👤 User Profiles** - Showcase your recipes and cooking journey
- **📱 Responsive Design** - Beautiful experience on any device
- **🎨 Modern UI** - Clean, accessible design with dark mode support

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: JSON files (no external database required!)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/recipe-app.git
cd recipe-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

That's it! No database setup required - the app uses JSON files stored in the `data/` directory.

## 📁 Project Structure

```
recipe-app/
├── app/
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── recipes/       # Recipe CRUD endpoints
│   │   ├── profiles/      # Profile endpoints
│   │   ├── comments/      # Comment endpoints
│   │   └── saved/         # Saved recipes endpoint
│   ├── (auth)/            # Authentication pages
│   ├── categories/        # Category browsing
│   ├── profile/           # User profiles
│   ├── recipes/           # Recipe pages
│   ├── saved/             # Saved recipes
│   └── page.tsx           # Home page
├── components/
│   ├── layout/            # Navbar, Footer, Providers
│   ├── recipes/           # RecipeCard, RecipeForm, Comments
│   └── ui/                # Reusable UI components
├── contexts/              # Auth context
├── data/                  # JSON database files
│   ├── users.json         # User credentials
│   ├── profiles.json      # User profiles
│   ├── recipes.json       # Recipe data
│   ├── likes.json         # Likes
│   ├── saves.json         # Saved/bookmarked recipes
│   └── comments.json      # Comments
├── lib/
│   ├── db/                # JSON database utilities
│   ├── auth.ts            # Authentication utilities
│   └── utils.ts           # Helper functions
└── middleware.ts          # Auth middleware
```

## 🗄️ Data Storage

The app uses JSON files for data storage, making it easy to run without any external database:

- **users.json** - User credentials (email, hashed password)
- **profiles.json** - User profile information
- **recipes.json** - All recipe data (pre-seeded with sample recipes)
- **likes.json** - Recipe likes
- **saves.json** - Saved/bookmarked recipes
- **comments.json** - Recipe comments

### Pre-seeded Data

The app comes with 6 sample recipes to get you started:
- Classic Spaghetti Carbonara
- Fluffy Pancakes
- Chocolate Lava Cake
- Fresh Garden Salad
- Creamy Tomato Soup
- Avocado Toast

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 UI Components

The app includes a comprehensive set of custom UI components:

- Button, Input, Textarea, Select
- Card, Badge, Avatar
- Modal, Dropdown, Tabs
- Toast notifications
- Empty states, Skeleton loaders

## 🔒 Security

- Session-based authentication using secure HTTP-only cookies
- Protected routes via Next.js middleware
- Password hashing (base64 for demo - use bcrypt in production)
- Input validation with Zod schemas

## 📱 Responsive Design

RecipeHub is designed mobile-first with responsive breakpoints:
- Mobile: Default styles
- Tablet: `sm:` (640px+)
- Desktop: `lg:` (1024px+)

## 🌙 Dark Mode

Dark mode is automatically applied based on system preferences using Tailwind's `dark:` variant.

## 🚧 Future Enhancements

- [ ] Bcrypt password hashing for production
- [ ] File upload for recipe images
- [ ] OAuth providers (Google, GitHub)
- [ ] Follow users
- [ ] Recipe ratings
- [ ] Nutrition information
- [ ] SQLite or PostgreSQL database option

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for beautiful icons
- [Unsplash](https://unsplash.com/) for recipe images

---

Made with ❤️ for food lovers everywhere
