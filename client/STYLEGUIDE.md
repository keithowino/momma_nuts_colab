# Momma Nut App – Style Guide 🎨

This document defines the styling rules, color palette, and UI guidelines for the app.  
Copilot should always use these when generating CSS or Tailwind classes.  

---

## 🎨 Color Palette

- **Primary Pink**: `#FF3CB0`  
- **Orange**: `#F7941D`  
- **Red-Orange**: `#F1531C`  
- **Golden Yellow**: `#F7A720`  
- **Dark Brown**: `#4B1E0E`  

---

## 🖌️ Styling Rules

1. **Theme**  
   - Use the **warm, vibrant palette** (pink, orange, red-orange, yellow, brown).  
   - Dark brown (`#4B1E0E`) should be used for text and headers where possible.  

2. **Typography**  
   - Headings: bold, larger sizes (`xl`, `2xl`, `3xl` depending on context).  
   - Body text: normal weight, comfortable spacing, good contrast.  

3. **Buttons**  
   - Rounded (`rounded-2xl`) with **soft shadows**.  
   - Primary buttons: pink (`#FF3CB0`) background, white text.  
   - Secondary buttons: orange (`#F7941D`) or yellow (`#F7A720`).  
   - Hover states should darken slightly.  

4. **Cards & Containers**  
   - Use white background with **soft drop shadows**.  
   - Rounded corners (`rounded-2xl`).  
   - Padding: at least `p-4`.  

5. **Animations**  
   - Use **Framer Motion** for smooth fades and slides.  
   - Subtle transitions for hover effects.  

6. **Layout**  
   - Grid-based layouts to avoid clutter.  
   - Adequate spacing (`gap-4`, `gap-6`).  

---

## ✅ Usage Notes
- Always use **Tailwind classes** (preferred).  
- Stick to this palette for consistency.  
- Copilot: when generating CSS or Tailwind, follow this guide.  
