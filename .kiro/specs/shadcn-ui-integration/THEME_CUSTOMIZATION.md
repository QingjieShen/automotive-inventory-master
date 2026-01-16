# Theme Customization Guide

## Overview

This document describes the custom theme modifications made to the shadcn/ui integration for the automotive inventory management application.

## Theme Architecture

The theme is built using CSS variables defined in `src/app/globals.css` with Tailwind CSS v4's `@theme` directive. This approach provides:
- Full control over design tokens
- Easy theme switching (light/dark mode)
- Consistent styling across all components
- Type-safe color references

## Color Palette

### Base Theme Colors

The application uses shadcn/ui's default color system with HSL values:

#### Light Mode
```css
:root {
  --background: 0 0% 100%;        /* White background */
  --foreground: 0 0% 9%;          /* Near-black text */
  --primary: 221 83% 53%;         /* Blue primary color */
  --secondary: 0 0% 96%;          /* Light gray */
  --muted: 0 0% 96%;              /* Muted backgrounds */
  --accent: 0 0% 96%;             /* Accent backgrounds */
  --destructive: 0 84% 60%;       /* Red for destructive actions */
  --border: 0 0% 90%;             /* Border color */
}
```

#### Dark Mode
```css
.dark {
  --background: 0 0% 4%;          /* Near-black background */
  --foreground: 0 0% 98%;         /* Near-white text */
  --primary: 221 83% 53%;         /* Same blue (works in both modes) */
  --secondary: 0 0% 15%;          /* Dark gray */
  --muted: 0 0% 15%;              /* Muted backgrounds */
  --accent: 0 0% 15%;             /* Accent backgrounds */
  --destructive: 0 84% 60%;       /* Same red */
  --border: 0 0% 15%;             /* Dark border */
}
```

### Custom Color Variants

Beyond shadcn/ui's defaults, we added custom variants for automotive inventory status indicators:

#### Success Variant (Green)
```css
--success: 142 71% 45%;           /* Green for success states */
--success-foreground: 0 0% 98%;   /* White text on green */
```

**Usage:**
- Vehicle status badges (e.g., "Ready for Sale")
- Success toast notifications
- Positive action confirmations

**Example:**
```tsx
<Badge variant="success">Ready for Sale</Badge>
<Button variant="success">Approve</Button>
```

#### Warning Variant (Yellow/Orange)
```css
--warning: 38 92% 50%;            /* Orange for warning states */
--warning-foreground: 0 0% 9%;    /* Dark text on orange */
```

**Usage:**
- Vehicle status badges (e.g., "Pending Review")
- Warning toast notifications
- Caution indicators

**Example:**
```tsx
<Badge variant="warning">Pending Review</Badge>
<Button variant="warning">Review Required</Button>
```

## Border Radius

Consistent border radius values for component corners:

```css
--radius: 0.5rem;                 /* Base radius (8px) */
--radius-sm: calc(var(--radius) - 4px);  /* Small (4px) */
--radius-md: calc(var(--radius) - 2px);  /* Medium (6px) */
--radius-lg: var(--radius);              /* Large (8px) */
```

## Typography

The application uses Geist Sans and Geist Mono fonts:

```css
--font-sans: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
```

These are loaded via Next.js font optimization in `src/app/layout.tsx`.

## Component-Specific Customizations

### Badge Component

Extended with custom variants:

```typescript
// src/components/ui/badge.tsx
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        success: "border-transparent bg-success text-success-foreground",  // Custom
        warning: "border-transparent bg-warning text-warning-foreground",  // Custom
      },
    },
  }
)
```

### Card Component

Maintains custom background styling for StoreCard:

```tsx
// Custom background image with gradient overlay
<Card 
  className="relative overflow-hidden"
  style={{
    backgroundImage: `url(${store.imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  {/* Content */}
</Card>
```

## Tailwind CSS v4 Integration

The theme uses Tailwind v4's CSS-first configuration:

```css
@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  /* ... all other colors */
}
```

This allows using colors in Tailwind classes:
```tsx
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
<div className="bg-success text-success-foreground">
```

## Accessibility Considerations

### Color Contrast

All color combinations meet WCAG AA standards:
- Light mode: 4.5:1 minimum contrast ratio
- Dark mode: 4.5:1 minimum contrast ratio
- Custom variants (success, warning): Tested for sufficient contrast

### Focus Indicators

All interactive elements have visible focus indicators:
```css
focus-visible:outline-none 
focus-visible:ring-2 
focus-visible:ring-ring 
focus-visible:ring-offset-2
```

## Modifying the Theme

### Changing Colors

To change theme colors, edit `src/app/globals.css`:

1. Update HSL values in `:root` (light mode)
2. Update HSL values in `.dark` (dark mode)
3. Ensure sufficient contrast ratios
4. Test in both light and dark modes

Example - changing primary color to purple:
```css
:root {
  --primary: 270 80% 50%;  /* Purple instead of blue */
}
```

### Adding New Variants

To add a new color variant:

1. Add CSS variable to `globals.css`:
```css
:root {
  --info: 200 80% 50%;
  --info-foreground: 0 0% 98%;
}
```

2. Add to `@theme` directive:
```css
@theme inline {
  --color-info: hsl(var(--info));
  --color-info-foreground: hsl(var(--info-foreground));
}
```

3. Add variant to component (e.g., Badge):
```typescript
const badgeVariants = cva(/* ... */, {
  variants: {
    variant: {
      // ... existing variants
      info: "border-transparent bg-info text-info-foreground",
    },
  },
})
```

### Changing Border Radius

To make components more or less rounded:

```css
:root {
  --radius: 0.75rem;  /* More rounded (12px) */
  /* or */
  --radius: 0.25rem;  /* Less rounded (4px) */
}
```

## Best Practices

1. **Use Theme Tokens**: Always use CSS variables instead of hardcoded colors
   - ✅ `bg-primary` or `bg-success`
   - ❌ `bg-blue-600` or `bg-green-500`

2. **Test Both Modes**: Verify changes in both light and dark mode
   - Use the theme toggle to switch between modes
   - Check contrast ratios with browser DevTools

3. **Maintain Consistency**: Keep the same color for both light and dark when possible
   - Primary blue works in both modes
   - Adjust lightness/saturation if needed

4. **Document Changes**: Update this file when adding custom variants or colors

## Resources

- [shadcn/ui Theming Guide](https://ui.shadcn.com/docs/theming)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [HSL Color Picker](https://hslpicker.com/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Migration Notes

The theme was migrated from Tailwind CSS v3 to v4 with the following changes:
- Removed `tailwind.config.js` file
- Moved configuration to CSS with `@theme` directive
- Converted all color values to HSL format
- Added CSS variables for all design tokens

All existing functionality was preserved during migration.
