# Đặng Hoài Nam - 2280611346
# Product Catalog - Web Application

A simple, elegant product catalog web application built with vanilla HTML, CSS, and JavaScript. Fetch product data from `db.json` and display it with real-time search functionality.

## Features

✨ **Core Features:**
- 📱 Responsive design that works on all devices
- 🔍 Real-time search filtering by product name and description
- 📋 Product listing in card-based grid layout
- 🎯 Click to view detailed product information
- 🎨 Modern, beautiful UI with gradient backgrounds
- ⚡ Fast loading and smooth animations
- ♿ Keyboard support (ESC to close modal)

## Project Structure

```
/
├── index.html           # Main HTML file with structure and styles
├── app.js              # JavaScript for functionality and DOM manipulation
├── db.json             # Product data in JSON format
└── README.md           # This file
```

## How It Works

1. **Data Loading**: On page load, `app.js` fetches data from `db.json` using the Fetch API
2. **Display**: Products are rendered as cards in a responsive grid
3. **Search**: Type in the search box to filter products in real-time
4. **Details**: Click any product card to view full details in a modal popup

## db.json Structure

```json
{
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 99,
      "image": "https://image-url.jpg",
      "description": "Product description text"
    }
  ]
}
```

Each product must have:
- `id` (number) - Unique product identifier
- `name` (string) - Product name
- `price` (number) - Product price
- `image` (string) - URL to product image
- `description` (string) - Brief product description

## Getting Started

### Local Development

1. Clone or download this repository
2. Ensure all files are in the root directory
3. Open `index.html` in a web browser
4. The application will automatically load products from `db.json`

### GitHub Pages Deployment

1. Push the repository to GitHub
2. Go to repository settings → Pages
3. Select the main branch as source
4. Your site will be available at `https://username.github.io/repo-name`

## Customization

### Adding New Products

Edit `db.json` and add new items to the `items` array:

```json
{
  "items": [
    {
      "id": 7,
      "name": "New Product",
      "price": 199,
      "image": "https://example.com/image.jpg",
      "description": "New product description"
    }
  ]
}
```

### Styling

Modify the CSS in `<style>` section of `index.html` to change:
- Colors and gradients
- Card layouts and spacing
- Font sizes and styles
- Animation effects

### JavaScript Functions

Main functions in `app.js`:
- `loadProducts()` - Fetch and initialize product data
- `displayProducts(products)` - Render products to DOM
- `filterProducts()` - Real-time search filtering
- `showProductDetail(productId)` - Open detail modal
- `closeModal()` - Close detail modal

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Features in Detail

### Search Functionality
- Real-time filtering as you type
- Searches by product name and description
- Case-insensitive matching
- Shows "no products found" when filter has no results

### Responsive Design
- Mobile-first approach
- Grid adapts: 3 columns on desktop, 2 on tablet, 1 on mobile
- Touch-friendly buttons and interactive elements
- Optimized modal for all screen sizes

### Error Handling
- Clear error messages if db.json fails to load
- Graceful fallbacks for missing data
- Console logging for debugging

### UX Features
- Smooth animations and transitions
- Hover effects on cards and buttons
- Click outside modal to close
- ESC key to close modal
- Loading state while fetching data

## Code Quality

- Pure vanilla JavaScript (no frameworks)
- Well-commented code
- Semantic HTML5 structure
- CSS with modern features (Grid, Flexbox, Gradients)
- DRY principles applied

## Troubleshooting

### Products not loading?
1. Ensure `db.json` is in the same directory as `index.html`
2. Check browser console (F12) for error messages
3. Verify `db.json` has valid JSON syntax
4. If using locally, run a local server: `python -m http.server 8000`

### Images not showing?
- Verify image URLs in `db.json` are correct
- Check that URLs are publicly accessible
- Use placeholder images if needed: `https://placehold.co/600x400`

### Search not working?
- Check browser console for JavaScript errors
- Ensure product fields match those in code (case-sensitive)

## License

This project is open source and available for personal and commercial use.

## Author

Created as a simple product catalog example with vanilla web technologies.
