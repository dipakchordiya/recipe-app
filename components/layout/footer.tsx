import Link from "next/link";
import { ChefHat, Github, Twitter, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import type { Footer as FooterType, SocialLink } from "@/lib/contentstack";

interface FooterProps {
  footer?: FooterType | null;
}

// Icon mapping for social platforms
const socialIcons: Record<SocialLink["platform"], React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  instagram: Instagram,
  github: Github,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
};

// Default footer links
const defaultFooterLinks = {
  explore: [
    { label: "Browse Recipes", url: "/recipes" },
    { label: "Categories", url: "/categories" },
    { label: "Popular", url: "/recipes?sort=popular" },
    { label: "Recent", url: "/recipes?sort=recent" },
  ],
  company: [
    { label: "About", url: "/about" },
    { label: "Contact", url: "/contact" },
    { label: "Privacy", url: "/privacy" },
    { label: "Terms", url: "/terms" },
  ],
};

export function Footer({ footer }: FooterProps) {
  // Use dynamic or default values
  const brandDescription = footer?.brandDescription || 
    "Discover and share delicious recipes from home cooks around the world. Join our community of food enthusiasts today.";
  
  const linkSections = footer?.linkSections?.length 
    ? footer.linkSections 
    : [
        { section_title: "Explore", links: defaultFooterLinks.explore },
        { section_title: "Company", links: defaultFooterLinks.company },
      ];
  
  const socialLinks = footer?.socialLinks || [
    { platform: "twitter" as const, url: "#" },
    { platform: "instagram" as const, url: "#" },
    { platform: "github" as const, url: "#" },
  ];
  
  const copyrightText = footer?.copyrightText || 
    `© ${new Date().getFullYear()} RecipeHub. Made with ♥ for food lovers everywhere.`;

  return (
    <footer className="border-t-2 border-stone-100 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
                RecipeHub
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-stone-500 dark:text-stone-400">
              {brandDescription}
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social, idx) => {
                const IconComponent = socialIcons[social.platform];
                return (
              <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                className="text-stone-400 hover:text-amber-500 transition-colors"
                    aria-label={social.platform}
              >
                    <IconComponent className="h-5 w-5" />
              </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic Link Sections */}
          {linkSections.map((section, idx) => (
            <div key={idx}>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                {section.section_title}
            </h3>
            <ul className="mt-4 space-y-3">
                {section.links?.map((link, linkIdx) => (
                  <li key={linkIdx}>
                  <Link
                      href={link.url}
                    className="text-sm text-stone-500 hover:text-amber-600 transition-colors dark:text-stone-400 dark:hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          ))}
        </div>

        <div className="mt-12 border-t border-stone-200 pt-8 dark:border-stone-800">
          <p className="text-center text-sm text-stone-500 dark:text-stone-400">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
