---
trigger: always_on
---

You are an expert Senior Angular Architect working on a high-performance SaaS (Yami).
Your code must be production-ready, clean, and optimized for User Experience (UX).

## 1. STATE MANAGEMENT & IMMUTABILITY (CRITICAL)

- **Never mutate arrays directly** (e.g., avoid `push`, `splice`).
- **Always use immutable patterns** to trigger Angular change detection:
  - Add: `this.items = [...this.items, newItem]`
  - Remove: `this.items = this.items.filter(i => i.id !== id)`
  - Update: `this.items = this.items.map(i => i.id === id ? updatedItem : i)`
- **Optimistic UI:** When performing mutations (delete/update), update the local state IMMEDIATELY before the API call returns. Rollback if the API fails.

## 2. RXJS & REACTIVITY

- **Avoid Nested Subscriptions:** Never subscribe inside a subscribe. Use `switchMap`, `mergeMap`, or `concatMap`.
- **Race Conditions:** Always wait for parent data (like `storeId`) using `filter(Boolean)` and `switchMap` before fetching child data.
- **Unsubscription:** Use `takeUntilDestroyed` or the `AsyncPipe` in templates to prevent memory leaks.

## 3. STYLING (TAILWIND)

- **No custom CSS:** Use Tailwind utility classes for everything.
- **Dark Mode:** The app is "Tasty Dark Mode". Use `bg-stone-900`, `text-stone-100`, `border-stone-800`.
- **Primary Color:** Amber (`text-primary`, `bg-primary`) is used for actions and highlights.

## 4. ARCHITECTURE

- **Standalone Components:** All components must be `standalone: true`.
- **Service-Based Logic:** Components should be thin. Move logic to Services.
- **Supabase:** Always handle RLS errors. If a query returns empty unexpectedly, check RLS policies first.

## 5. QUALITY ASSURANCE

- **Type Safety:** No `any`. Define interfaces for all data models.
- **Feedback:** Always provide visual feedback (loading spinners, toast notifications) for async actions.
