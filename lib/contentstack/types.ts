// Contentstack Entry Types

export interface ContentstackAsset {
  uid: string;
  title: string;
  url: string;
  filename: string;
  content_type: string;
  file_size: string;
}

export interface ContentstackEntry {
  uid: string;
  title?: string;
  locale: string;
  created_at: string;
  updated_at: string;
}

// Author Content Type
export interface AuthorEntry extends ContentstackEntry {
  full_name: string;
  username: string;
  avatar?: ContentstackAsset;
  bio?: string;
}

// Category Content Type
export interface CategoryEntry extends ContentstackEntry {
  name: string;
  emoji?: string;
  description?: string;
  color_gradient?: string;
  image?: ContentstackAsset;
}

// Ingredient Group
export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

// Recipe Content Type
export interface RecipeEntry extends ContentstackEntry {
  title: string;
  url: string;
  description?: string;
  featured_image?: ContentstackAsset;
  author?: AuthorEntry[];
  category?: CategoryEntry[];
  cooking_time?: number;
  difficulty: "easy" | "medium" | "hard";
  ingredients: Ingredient[];
  steps: string;
  recipe_tags?: string[];
  is_published?: boolean;
}

// Navigation Link
export interface NavLink {
  label: string;
  url: string;
  open_new_tab?: boolean;
}

// CTA Button
export interface CTAButton {
  label: string;
  url: string;
  logged_out_only?: boolean;
}

// Header Content Type
export interface HeaderEntry extends ContentstackEntry {
  site_name: string;
  logo?: ContentstackAsset;
  navigation_links?: NavLink[];
  show_search?: boolean;
  cta_button?: CTAButton;
}

// Footer Link Section
export interface FooterLinkSection {
  section_title: string;
  links?: { label: string; url: string }[];
}

// Social Link
export interface SocialLink {
  platform: "twitter" | "instagram" | "facebook" | "github" | "linkedin" | "youtube";
  url: string;
}

// Footer Content Type
export interface FooterEntry extends ContentstackEntry {
  brand_description?: string;
  link_sections?: FooterLinkSection[];
  social_links?: SocialLink[];
  copyright_text?: string;
}

// Stat Item
export interface StatItem {
  value: string;
  label: string;
}

// Feature Item
export interface FeatureItem {
  icon?: string;
  title: string;
  description?: string;
}

// Home Page Content Type
export interface HomePageEntry extends ContentstackEntry {
  page_title: string;
  seo_meta_title?: string;
  seo_meta_description?: string;
  hero_banner_image?: ContentstackAsset;
  hero_badge_text?: string;
  hero_headline: string;
  hero_highlight_text?: string;
  hero_description?: string;
  hero_primary_btn_label?: string;
  hero_primary_btn_url?: string;
  hero_secondary_btn_label?: string;
  hero_secondary_btn_url?: string;
  stats?: StatItem[];
  categories_section_title?: string;
  categories_section_subtitle?: string;
  recipes_section_title?: string;
  recipes_section_subtitle?: string;
  features_section_title?: string;
  features_section_subtitle?: string;
  features?: FeatureItem[];
  cta_headline?: string;
  cta_description?: string;
  cta_primary_btn_label?: string;
  cta_primary_btn_url?: string;
  cta_secondary_btn_label?: string;
  cta_secondary_btn_url?: string;
}

// Transformed types for UI consumption
export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: Ingredient[];
  steps: string;
  cooking_time: number | null;
  difficulty: "easy" | "medium" | "hard";
  category: string | null;
  tags: string[] | null;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  profiles: Profile | null;
  likes_count: number;
  comments_count: number;
}

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji?: string;
  description?: string;
  color_gradient?: string;
  image_url?: string | null;
}

// Header for UI
export interface Header {
  siteName: string;
  logoUrl?: string | null;
  navigationLinks: NavLink[];
  showSearch: boolean;
  ctaButton?: CTAButton;
}

// Footer for UI
export interface Footer {
  brandDescription: string;
  linkSections: FooterLinkSection[];
  socialLinks: SocialLink[];
  copyrightText: string;
}

// Home Page for UI
export interface HomePage {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    bannerImage: string | null;
    badgeText: string;
    headline: string;
    highlightText: string;
    description: string;
    primaryButton: { label: string; url: string } | null;
    secondaryButton: { label: string; url: string } | null;
    stats: StatItem[];
  };
  categoriesSection: {
    title: string;
    subtitle: string;
  };
  recipesSection: {
    title: string;
    subtitle: string;
  };
  featuresSection: {
    title: string;
    subtitle: string;
    features: FeatureItem[];
  };
  ctaSection: {
    headline: string;
    description: string;
    primaryButton: { label: string; url: string } | null;
    secondaryButton: { label: string; url: string } | null;
  };
}
