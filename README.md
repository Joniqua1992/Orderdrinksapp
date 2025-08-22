# Drink Ordering App

A simple web application for managing drink and food orders with a beautiful, responsive interface.

## Features

- 📱 Responsive design that works on mobile and desktop
- 🌍 Multi-language support (English, Dutch, French)
- 🍹 Manage drinks and foods with custom prices and emojis
- 📋 Order tracking with quantity controls
- 📊 Order history
- 💾 Local storage for persistence
- 📤 Import/Export menu functionality
- 🎯 Load default menu items

## How to Use

### Option 1: GitHub Pages (Recommended)
1. Upload this folder to your GitHub repository
2. Enable GitHub Pages in your repository settings
3. Access the app via the GitHub Pages URL
4. The "Load Defaults" button will work properly

### Option 2: Local Web Server
If you want to test locally:
1. Use VS Code with the "Live Server" extension
2. Or run a local web server: `python -m http.server 8000`
3. Access via `http://localhost:8000`

### Option 3: Direct File Opening (Limited)
- You can open `index.html` directly in your browser
- Note: The "Load Defaults" button won't work due to browser security restrictions
- You'll need to manually add drinks/foods or use the fallback menu

## Default Menu

The app includes a comprehensive default menu in `padel_party_menu.json` with:
- Various drinks (wine, beer, soft drinks, spirits)
- Food items (chips, hamburgers, snacks)
- All items have appropriate emojis and prices

## File Structure

```
Orderdrinksapp/
├── index.html          # Main HTML file
├── app.js             # JavaScript application logic
├── styles.css         # CSS styling
├── translations.js    # Multi-language translations
├── padel_party_menu.json  # Default menu data
└── README.md          # This file
```

## Troubleshooting

**"Load Defaults" button doesn't work:**
- This happens when opening the HTML file directly in a browser
- Solution: Use GitHub Pages or a local web server
- Alternative: Click "OK" when prompted to load the fallback menu

**Menu items not saving:**
- Check if your browser supports localStorage
- Try clearing browser cache and reloading

## Browser Compatibility

Works in all modern browsers:
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
