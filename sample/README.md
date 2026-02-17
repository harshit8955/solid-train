# Pushpak — Plant Store (Local demo)

This repository is a small static plant store built with HTML, CSS and vanilla JavaScript. Data is stored in the browser's localStorage so you can run the site locally without any backend.

## What I implemented ✅
- Responsive, modern UI for listing plants and product details
- Admin section to add / edit / delete plants (uses localStorage)
- Cart and Favorites (persisted to localStorage)
- Image upload in Admin uses local preview (base64) — no external service required
- Seed/sample data is added automatically on first load

## How to run
1. Open `index.html` in your browser (no server required).
2. Browse `Plants`, view `Plant Details`, add items to Cart/Favorites.

## Admin
- Open `admin/add-plant.html` to add plants (image preview included).
- Open `admin/manage-plants.html` to edit/delete plants.
- Admin pages use the same `localStorage` dataset as the public UI.

## Developer notes
- Data model for a plant: `{ id, name, category, price, image }` (image is a URL or base64 string).
- Cart stores objects `{ id, qty }`.
- Sample data is injected on first page load by `assets/js/main.js`.

## Where to edit
- Frontend logic: `assets/js/main.js`
- Admin logic: `assets/js/admin.js`
- Styles: `assets/css/style.css`

## Next improvements (optional)
- Add a small backend (Node/Express or Firebase) to persist data across devices
- Integrate Cloudinary or S3 for image hosting
- Add form validation and unit/UI tests

If you want, I can: add deployment instructions (GitHub Pages), implement a Node backend, or wire Cloudinary uploads — tell me which next. 🌿