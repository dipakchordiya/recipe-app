# Contentstack Live Preview Setup Guide

This guide explains how to set up Live Preview for the RecipeHub application.

## Prerequisites

- Contentstack account with admin access
- The recipe-app running locally or deployed

## Step 1: Create a Preview Token in Contentstack

1. Go to your Contentstack dashboard
2. Navigate to **Settings** → **Tokens** → **Delivery Tokens**
3. Click **+ Add Token**
4. Configure the token:
   - **Name**: `Preview Token`
   - **Description**: `Token for live preview`
   - **Environment**: Select `development`
   - **Enable Preview**: Toggle ON
5. Click **Save**
6. Copy the generated **Preview Token**

## Step 2: Configure Live Preview in Contentstack

1. Go to **Settings** → **Live Preview**
2. Click **+ Add Live Preview Configuration**
3. Configure:
   - **Name**: `RecipeHub Preview`
   - **Environment**: `development`
   - **Preview URL**: `http://localhost:3000` (or your deployed URL)
   - **Enable Live Preview**: Toggle ON
4. Click **Save**

## Step 3: Update Environment Variables

Add these variables to your `.env.local` file:

```bash
# Contentstack Configuration
NEXT_PUBLIC_CONTENTSTACK_API_KEY=your_api_key
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN=your_preview_token
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=development

# Enable Live Preview
NEXT_PUBLIC_CONTENTSTACK_LIVE_PREVIEW=true
```

## Step 4: Configure Content Type for Live Preview

For each content type you want to enable live preview:

1. Go to **Content Models** → Select content type (e.g., `Home Page`)
2. Click **Settings** (gear icon)
3. Under **Live Preview**, configure:
   - **URL Pattern**: For Home Page: `/`
   - **URL Pattern**: For Recipe: `/recipes/{entry.url}`

### URL Patterns by Content Type

| Content Type | URL Pattern |
|--------------|-------------|
| Home Page | `/` |
| Recipe | `/recipes/{entry.uid}` |
| Category | `/categories` |
| Header | `/` |
| Footer | `/` |

## Step 5: Test Live Preview

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to Contentstack dashboard
3. Open any entry (e.g., Home Page)
4. Click the **Live Preview** button (eye icon) in the top right
5. A new window will open with your site
6. Edit content in Contentstack - changes should appear in real-time!

## Troubleshooting

### Preview not updating

1. Check browser console for errors
2. Verify all environment variables are set correctly
3. Make sure `NEXT_PUBLIC_CONTENTSTACK_LIVE_PREVIEW=true`
4. Clear browser cache and reload

### "Access Denied" errors

1. Verify your Preview Token has the correct permissions
2. Ensure the Preview Token is for the correct environment

### Edit buttons not appearing

1. The edit button feature requires proper `data-cslp` attributes
2. Check that the content type UID and entry UID are correct

## Architecture

The Live Preview implementation consists of:

1. **`lib/contentstack/client.ts`** - SDK initialization with Live Preview config
2. **`lib/contentstack/live-preview.tsx`** - React hooks and components:
   - `useLivePreviewUpdate` - Hook for real-time content updates
   - `useLivePreview` - Hook for preview mode detection
   - `LivePreviewIndicator` - Visual indicator when in preview mode
   - `getEditableProps` - Helper for adding edit button data attributes

3. **`components/layout/live-preview-provider.tsx`** - Provider component
4. **`app/home-content.tsx`** - Example of Live Preview enabled page

## Adding Live Preview to New Pages

1. Create a client component for your page content
2. Use `useLivePreviewUpdate` hook for data that should update live:

```tsx
"use client";

import { useLivePreviewUpdate } from "@/lib/contentstack";

function MyPageContent({ initialData, fetchFn }) {
  const data = useLivePreviewUpdate(initialData, fetchFn);
  
  return (
    <div>
      <h1 {...getEditableProps("content_type", "entry_uid", "field_path")}>
        {data.title}
      </h1>
    </div>
  );
}
```

3. Add `data-cslp` attributes for inline editing:

```tsx
<p data-cslp="content_type.entry_uid.field_path">
  {content}
</p>
```

## Support

For more information, refer to:
- [Contentstack Live Preview Documentation](https://www.contentstack.com/docs/developers/set-up-live-preview/)
- [Contentstack JavaScript SDK](https://www.contentstack.com/docs/developers/sdks/content-delivery-sdk/javascript-browser/)
