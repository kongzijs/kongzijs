# Component Development Guide

This guide explains how to develop new components for the Kongzijs FLF-based lesson builder project.

## Component Structure

Components are located in `src/components/` and follow this structure:

```
src/components/
├── ui/              # Reusable UI components (Radix UI based)
├── figma/           # Figma-specific components
└── [PageName].tsx   # Page components
```

## Creating a New Component

### 1. Create Component File

```typescript
// src/components/MyComponent.tsx
import { useTranslation } from "react-i18next";

export function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("myComponent.title")}</h1>
    </div>
  );
}
```

### 2. Add Translations

Add translation keys to all language files:

```json
// src/i18n/locales/en.json
{
  "myComponent": {
    "title": "My Component Title"
  }
}
```

### 3. Use Component

```typescript
import { MyComponent } from "./components/MyComponent";

function MyPage() {
  return <MyComponent />;
}
```

## Using UI Components

The project uses Radix UI primitives wrapped in custom components:

```typescript
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## Component Best Practices

### 1. Use TypeScript

Always use TypeScript for type safety:

```typescript
interface MyComponentProps {
  title: string;
  count?: number;
}

export function MyComponent({ title, count = 0 }: MyComponentProps) {
  // ...
}
```

### 2. Use i18n

Never hardcode user-facing text:

```typescript
// ❌ Bad
<h1>Welcome</h1>

// ✅ Good
const { t } = useTranslation();
<h1>{t("welcome.title")}</h1>
```

### 3. Follow Naming Conventions

- Use PascalCase for component names
- Use descriptive, clear names
- Group related components in folders

### 4. Keep Components Focused

- One component, one responsibility
- Extract reusable logic into hooks
- Keep components small and focused

### 5. Use Custom Hooks

Extract complex logic into custom hooks:

```typescript
// hooks/useMyFeature.ts
export function useMyFeature() {
  // logic here
  return { data, loading, error };
}

// Component
function MyComponent() {
  const { data, loading, error } = useMyFeature();
  // ...
}
```

## Styling

The project uses Tailwind CSS with custom colors:

```typescript
<div className="bg-fluence-blue text-white rounded-full">
  Content
</div>
```

### Available Color Classes

- `bg-fluence-blue` - Primary blue
- `bg-fluence-tea-green` - Tea green
- `bg-fluence-vanilla` - Vanilla
- `bg-fluence-ivory` - Ivory
- `text-fluence-dark` - Dark text

## Component Patterns

### Page Component

```typescript
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function MyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("myPage.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Content */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### Form Component

```typescript
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export function MyForm() {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <Label htmlFor="input">{t("form.label")}</Label>
      <Input
        id="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit">{t("form.submit")}</Button>
    </form>
  );
}
```

## Testing Components

### Manual Testing Checklist

- [ ] Component renders correctly
- [ ] Translations work in all languages
- [ ] Responsive design works on mobile
- [ ] Interactive elements work (buttons, forms, etc.)
- [ ] Error states are handled
- [ ] Loading states are shown

## Resources

- [UI Components](../src/components/ui/) - Available UI components
- [Internationalization Guide](./internationalization.md) - i18n usage
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
