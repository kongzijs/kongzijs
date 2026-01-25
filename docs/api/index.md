# API Reference

This section provides API documentation for hooks, utilities, and components.

## Hooks

### `useLanguage()`

Custom hook for language management.

**Location:** `src/hooks/useLanguage.ts`

**Returns:**

```typescript
{
  language: string;        // Current language code
  changeLanguage: (lng: string) => void;  // Function to change language
}
```

**Usage:**

```typescript
import { useLanguage } from "../hooks/useLanguage";

function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={changeLanguage}>
      {/* options */}
    </Select>
  );
}
```

**Behavior:**

- Automatically syncs with i18n language changes
- Updates component state when language changes
- Provides `changeLanguage` function that updates i18n

## i18n Configuration

### `i18n` Instance

**Location:** `src/i18n/config.ts`

**Exports:**

- Default export: Configured i18n instance

**Features:**

- Automatic language detection
- Cookie persistence
- URL parameter support
- Event listeners for language changes

**Usage:**

```typescript
import i18n from "../i18n/config";

// Change language programmatically
i18n.changeLanguage("zh");

// Get current language
const currentLang = i18n.language;

// Listen to language changes
i18n.on("languageChanged", (lng) => {
  console.log("Language changed to:", lng);
});
```

## Translation Function

### `t(key: string, options?: object)`

Translation function from `react-i18next`.

**Usage:**

```typescript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  // Simple translation
  const title = t("homePage.title");

  // With interpolation
  const message = t("profile.welcome", { name: "John" });

  // With pluralization
  const count = t("lessons.count", { count: 5 });

  return <div>{title}</div>;
}
```

**Parameters:**

- `key`: Translation key (e.g., `"homePage.title"`)
- `options`: Optional object with variables for interpolation

**Returns:** Translated string

## Utilities

### Cookie Utilities

**Location:** `src/i18n/config.ts` (internal)

**Functions:**

- `cookieUtils.get(name: string)`: Get cookie value
- `cookieUtils.set(name: string, value: string, days?: number)`: Set cookie

**Usage:** Internal use only, managed by i18n system.

## Component Props

### Common Component Props

Most UI components accept:

```typescript
interface ComponentProps {
  className?: string; // Additional CSS classes
  // ... component-specific props
}
```

### Card Components

```typescript
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

<Card className="custom-class">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Button Component

```typescript
import { Button } from "./ui/button";

<Button variant="outline" size="lg" className="custom-class">
  Click me
</Button>
```

## Type Definitions

### Language Code

```typescript
type LanguageCode = "en" | "zh" | "ja" | "ko" | "hi" | "ar" | "ru" | "es";
```

### Translation Key

Translation keys follow hierarchical structure:

```typescript
type TranslationKey = string; // e.g., "homePage.hero.title"
```

## Events

### i18n Events

The i18n instance emits these events:

- `languageChanged`: Emitted when language changes
  ```typescript
  i18n.on("languageChanged", (lng: string) => {
    // Handle language change
  });
  ```

## Resources

- [RFC 0001: i18n System](../rfc/0001-i18n-multilanguage-system.md)
- [Internationalization Guide](../guides/internationalization.md)
