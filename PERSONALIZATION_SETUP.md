# Location-Based Personalization Setup Guide

This guide explains how to set up location-based content personalization using **Contentstack Personalize** and **Lytics CDP** for the Recipe App.

## Overview

The personalization system works as follows:
1. **Lytics CDP** collects visitor data and segments users by location
2. **Contentstack Personalize** delivers different content variants based on segments
3. **Recipe App** displays personalized content (Indian recipes for India, American recipes for USA)

---

## Part 1: Content Setup in Contentstack

### Step 1: Run the Setup Script

The setup script creates regional content in Contentstack:

```bash
# Set environment variables
export CONTENTSTACK_API_KEY=blt837255d7d0d157c5
export CONTENTSTACK_MANAGEMENT_TOKEN=cs4b3b60b8ac28532fc37fbe37

# Run the script
cd recipe-app
npx ts-node scripts/setup-personalization-content.ts
```

This creates:
- **Indian Cuisine** category with 4 recipes (Butter Chicken, Biryani, Palak Paneer, Masala Dosa)
- **American Cuisine** category with 4 recipes (Cheeseburger, BBQ Ribs, Mac & Cheese, Apple Pie)
- **Home Page - India** variant with Indian-themed content
- **Home Page - USA** variant with American-themed content

### Step 2: Verify Content in Contentstack

1. Go to your Contentstack stack
2. Check **Entries** → **Category** → Verify "Indian Cuisine" and "American Cuisine" exist
3. Check **Entries** → **Recipe** → Verify regional recipes are created
4. Check **Entries** → **Home Page** → Verify regional variants exist

---

## Part 2: Contentstack Personalize Configuration

### Step 1: Enable Personalize

1. Go to **Contentstack Dashboard**
2. Navigate to **Personalize** (in left sidebar)
3. Click **Enable Personalize** if not already enabled

### Step 2: Create Project

1. Click **+ New Project**
2. Name: "Recipe App Personalization"
3. Note down the **Project UID** (needed for SDK)

### Step 3: Create Audiences

Create audiences based on location:

#### Audience 1: Indian Users
1. Click **Audiences** → **+ New Audience**
2. Name: "Indian Users"
3. Short ID: `indian_users`
4. Rules:
   - Attribute: `country_code`
   - Operator: `equals`
   - Value: `IN`

#### Audience 2: American Users
1. Click **+ New Audience**
2. Name: "American Users"
3. Short ID: `american_users`
4. Rules:
   - Attribute: `country_code`
   - Operator: `equals`
   - Value: `US`

### Step 4: Create Experiences

#### Experience 1: Home Page Hero
1. Click **Experiences** → **+ New Experience**
2. Name: "Home Page Location Experience"
3. Short ID: `home_hero_location`
4. Add Variants:
   - **Default**: Links to "Home Page" entry
   - **India**: Links to "Home Page - India" entry (Audience: Indian Users)
   - **USA**: Links to "Home Page - USA" entry (Audience: American Users)

### Step 5: Get Credentials

Note down these values from Personalize settings:
- **Project UID**: `your_project_uid`
- **Edge API URL**: `https://personalize-edge.contentstack.com`

---

## Part 3: Lytics CDP Configuration

### Step 1: Create Lytics Account

1. Go to [lytics.com](https://www.lytics.com/)
2. Sign up for an account
3. Create a new workspace for "Recipe App"

### Step 2: Install Lytics JavaScript Tag

Add to your website (already included in the app):

```html
<script>
  !function(){"use strict";var e=window.jstag||(window.jstag={}),t=[];function n(e){t.push(e)}
  e.send=n,e.mock=!0;var r=document.createElement("script");
  r.async=!0,r.src="https://c.lytics.io/api/tag/YOUR_ACCOUNT_ID/lio.js";
  var i=document.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)}();
</script>
```

### Step 3: Configure Location Data Collection

Lytics automatically collects:
- IP-based geolocation
- Country, region, city
- Browser language

### Step 4: Create Location Segments

#### Segment 1: India Visitors
1. Go to **Audiences** → **+ Create Segment**
2. Name: "India Visitors"
3. Rules:
   ```
   geo_country = "IN"
   ```

#### Segment 2: USA Visitors
1. Create another segment
2. Name: "USA Visitors"
3. Rules:
   ```
   geo_country = "US"
   ```

### Step 5: Connect to Contentstack Personalize

1. Go to Lytics **Integrations**
2. Find "Contentstack" or use webhook integration
3. Configure to send audience membership to Contentstack

---

## Part 4: Frontend Integration

### Environment Variables

Add to `.env.local`:

```bash
# Contentstack Personalize
NEXT_PUBLIC_PERSONALIZE_PROJECT_UID=your_project_uid
NEXT_PUBLIC_PERSONALIZE_EDGE_API_URL=https://personalize-edge.contentstack.com

# Lytics
NEXT_PUBLIC_LYTICS_ACCOUNT_ID=your_lytics_account_id
```

### How Personalization Works in the App

1. **Server-Side Detection**: The app detects location from request headers (Cloudflare, Vercel geo headers)

2. **Content Fetching**: Based on detected region, the app fetches:
   - Regional home page variant
   - Regional recipes (Indian/American)

3. **Client-Side Switching**: A region switcher allows testing different variants

4. **Personalize SDK**: For full integration, the SDK handles:
   - Visitor identification
   - Audience evaluation
   - Variant delivery

---

## Part 5: Testing

### Local Testing

1. Use the **Region Switcher** (bottom-left corner) to simulate different locations
2. Click 🇮🇳 for India, 🇺🇸 for USA, 🌍 for Global

### Production Testing

1. Use VPN to connect from different countries
2. Or use browser dev tools to modify geo headers:
   ```
   x-vercel-ip-country: IN
   ```

### Verify Personalization

1. **India Users** should see:
   - "🇮🇳 Namaste, Food Lovers!" badge
   - "Discover Authentic Indian Flavors" headline
   - Indian recipes (Butter Chicken, Biryani, etc.)

2. **USA Users** should see:
   - "🇺🇸 Welcome, Home Cooks!" badge
   - "Classic American Comfort Food" headline
   - American recipes (Cheeseburger, BBQ Ribs, etc.)

---

## Architecture Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│   Lytics CDP    │────▶│   Contentstack   │────▶│   Recipe App    │
│                 │     │   Personalize    │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Visitor Data:   │     │ Experiences:     │     │ Displays:       │
│ - Location      │     │ - Indian variant │     │ - Personalized  │
│ - Behavior      │     │ - USA variant    │     │   content       │
│ - Segments      │     │ - Default        │     │ - Regional      │
└─────────────────┘     └──────────────────┘     │   recipes       │
                                                 └─────────────────┘
```

---

## Files Created

| File | Purpose |
|------|---------|
| `lib/contentstack/personalize.ts` | Personalize SDK integration |
| `components/personalize/personalize-provider.tsx` | React context for personalization |
| `scripts/setup-personalization-content.ts` | Content creation script |
| `app/page.tsx` | Updated with region detection |
| `app/home-content.tsx` | Updated with region switching |

---

## Troubleshooting

### Content not showing regional variants
- Verify entries are published to `development` environment
- Check that entry titles match exactly ("Home Page - India", "Home Page - USA")

### Region detection not working
- In development, use the Region Switcher
- In production, ensure your CDN/host provides geo headers

### Lytics not sending data
- Verify Lytics JavaScript tag is loaded
- Check browser console for Lytics errors
- Verify account ID is correct

---

## Next Steps

1. ✅ Content created in Contentstack
2. ⬜ Configure Contentstack Personalize (manual step in dashboard)
3. ⬜ Set up Lytics account and segments
4. ⬜ Connect Lytics to Personalize
5. ⬜ Deploy and test in production
