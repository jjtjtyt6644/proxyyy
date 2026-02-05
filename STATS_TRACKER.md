# Stats Tracker Feature

## Overview
The Stats Tracker is a movable widget that appears on proxied webpages, tracking how long users spend on each site.

## Features

### ✨ **Tracking**
- Real-time session timer for current page
- Historical statistics for all visited pages
- Top 5 most visited pages display
- Automatic save on page unload

### 🎨 **Design**
- Modern glass-morphism design
- Gradient borders and effects
- Smooth animations
- Matches Ambient theme

### 🖱️ **Interactions**
- **Draggable**: Click and drag header to move anywhere on screen
- **Minimizable**: Click minimize button to collapse widget
- **Closeable**: Close button to hide widget
- **Clear History**: Button to reset all statistics
- **Persistent Position**: Widget remembers its position

### 📊 **Data Display**
- **Current Session**: Shows hours:minutes:seconds for active page
- **Current URL**: Displays the page you're currently on
- **History**: Top 5 pages with total time spent
- **Storage**: All data saved in localStorage

### ⚙️ **Enable/Disable**
- Toggle checkbox on homepage footer
- Setting is persistent across sessions
- Enabled by default

## How It Works

1. **On Homepage**: Check/uncheck "Enable Stats Tracker" in footer
2. **Navigate to Site**: Stats widget appears in top-right corner
3. **Move Widget**: Click and drag header to reposition
4. **View Stats**: See current session time and history
5. **Minimize**: Click (-) button to collapse
6. **Close**: Click (X) to hide completely
7. **Clear Data**: Click "Clear History" to reset all stats

## Technical Details

- **File**: `/public/assets/js/stats-tracker.js`
- **Storage**: localStorage (keys: `page-stats`, `stats-position`, `stats-enabled`)
- **Framework**: Vanilla JavaScript (no dependencies)
- **Performance**: Updates every 1 second, minimal overhead
- **Cross-Origin**: Works with proxied content

## Customization

The widget appearance can be customized by editing the inline styles in `stats-tracker.js`:
- Colors: Change gradient values and rgba colors
- Size: Adjust `min-width` and padding
- Position: Modify default `position` values
- Animation: Edit transition timings

## Future Enhancements
- Export statistics to CSV
- Chart visualization of time spent
- Daily/weekly reports
- Category tracking
- Productivity insights
