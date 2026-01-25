# Internationalization Guide

This guide explains how to use the internationalization (i18n) system in the Kongzijs FLF-based lesson builder project.

## Overview

The i18n system supports 8 languages with automatic detection, URL parameters, and cookie persistence. See [RFC 0001](../rfc/0001-i18n-multilanguage-system.md) for detailed design information.

## Basic Usage

### Using Translations in Components

Import and use the `useTranslation` hook:

```typescript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("homePage.hero.title")}</h1>
      <p>{t("homePage.hero.subtitle")}</p>
    </div>
  );
}
```

### Language Switching

Use the `useLanguage` hook for language switching UI:

```typescript
import { useLanguage } from "../hooks/useLanguage";

function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={changeLanguage}>
      <SelectItem value="en">English</SelectItem>
      <SelectItem value="zh">中文</SelectItem>
      {/* ... more languages */}
    </Select>
  );
}
```

## Translation Key Structure

Translation keys follow a hierarchical structure:

```
page.section.item
```

Examples:

- `common.save` - Common save button
- `homePage.hero.title` - Home page hero title
- `settings.language.interfaceLanguage` - Settings language option

## Adding New Translations

### 1. Add to English Translation File

Edit `src/i18n/locales/en.json`:

```json
{
  "myPage": {
    "title": "My Page Title",
    "description": "Page description"
  }
}
```

### 2. Add to All Other Languages

Add the same structure to all other language files:

- `src/i18n/locales/zh.json`
- `src/i18n/locales/ja.json`
- etc.

### 3. Use in Component

```typescript
const { t } = useTranslation();
<h1>{t("myPage.title")}</h1>
```

## Translation with Variables

Use interpolation for dynamic content:

```json
{
  "profile": {
    "welcome": "Welcome, {{name}}!",
    "lessonsCompleted": "You completed {{count}} lessons"
  }
}
```

```typescript
const { t } = useTranslation();
<p>{t("profile.welcome", { name: "John" })}</p>
<p>{t("profile.lessonsCompleted", { count: 5 })}</p>
```

## Language Detection

The system automatically detects language in this order:

1. URL parameter (`?lang=xx`)
2. Cookie (`i18next`)
3. Browser language
4. Default (English)

## URL Parameter Support

Users can switch language via URL:

```
https://example.com/?lang=zh
https://example.com/?lang=ja
```

The language preference is automatically saved to cookie.

## Best Practices

1. **Never hardcode text**: Always use translation keys
2. **Use descriptive keys**: Follow hierarchical structure
3. **Keep keys consistent**: Use the same structure across pages
4. **Update all languages**: When adding new keys, update all language files
5. **Use the hook**: Always use `useLanguage()` for language switching

## Common Patterns

### Conditional Translation

```typescript
const { t } = useTranslation();
const isLoggedIn = true;

return (
  <div>
    {isLoggedIn ? t("common.welcome") : t("common.signIn")}
  </div>
);
```

### Pluralization

```json
{
  "lessons": {
    "count": "{{count}} lesson",
    "count_plural": "{{count}} lessons"
  }
}
```

```typescript
const { t } = useTranslation();
<p>{t("lessons.count", { count: 5 })}</p> // "5 lessons"
```

## Troubleshooting

### Translation Not Showing

1. Check the key exists in the translation file
2. Verify the key path is correct
3. Ensure the language file is imported in `config.ts`
4. Check browser console for errors

### Language Not Switching

1. Verify `useLanguage()` hook is used
2. Check that `changeLanguage()` is called
3. Ensure the language code is in `supportedLanguages`
4. Check cookie is being set correctly

## Resources

- [RFC 0001: i18n Multi-Language System](../rfc/0001-i18n-multilanguage-system.md)
- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
