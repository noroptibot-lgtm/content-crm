# Content CRM Dashboard

A professional Kanban-style dashboard for managing social media content workflow from idea to analytics.

## 🚀 Live Demo

Visit: [https://noroptibot-lgtm.github.io/content-crm/](https://noroptibot-lgtm.github.io/content-crm/)

## ✨ Features

### 📋 Kanban Board with 5 Columns
- **💡 Script Ideas** - New suggestions from analysis
- **📝 Ready to Film** - Albert approved content
- **🎬 Filmed** - Recorded content ready for editing
- **📱 Posted** - Live content on social platforms
- **📊 Analytics** - Performance data and metrics

### 🎯 Core Functionality
- **Drag & Drop** - Move cards between workflow stages
- **Card Details** - Click any card to view/edit full content
- **Platform Support** - Instagram, YouTube, X (Twitter)
- **Virality Scoring** - 1-10 scale for content potential
- **Notes System** - Albert's feedback and collaboration
- **Analytics Tracking** - Views, likes, comments, shares
- **Data Persistence** - localStorage saves everything locally
- **Mobile Friendly** - Responsive design works on all devices

### 🎨 Design
- **Dark Theme** - Easy on the eyes (#0a0a0a background)
- **Gold Accents** - Professional highlights (#d4af37)
- **Clean UI** - Modern, minimal interface
- **Smooth Animations** - Polished user experience

## 🛠 Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Data Storage**: localStorage (browser-based)
- **Styling**: CSS Grid/Flexbox, Custom CSS
- **Deployment**: GitHub Pages
- **Mobile**: Responsive design with mobile-first approach

## 📱 Pre-loaded Content

The dashboard comes pre-populated with 5 sample Instagram scripts covering:
1. Brain science and junk food cravings
2. The 60-second productivity rule
3. Color psychology in marketing
4. Why smart people make bad decisions
5. 3-minute morning routine vs meditation

## 🔄 Workflow Stages

1. **Script Ideas** → New content suggestions (automated daily population ready)
2. **Ready to Film** → Albert-approved scripts ready for recording
3. **Filmed** → Recorded content awaiting post-production
4. **Posted** → Live content across social platforms
5. **Analytics** → Performance tracking and optimization

## 🚀 Getting Started

### For Users
1. Visit the live dashboard
2. Click any card to view details
3. Drag cards between columns to update status
4. Add new cards with the "+ Add Card" button
5. Export your data anytime with the "Export" button

### For Developers
1. Clone the repository
2. Open `index.html` in your browser
3. No build process required - pure HTML/CSS/JS

## 🔧 API Integration Ready

The dashboard includes a global `ContentCRM` object for future API integration:

```javascript
// Add new card programmatically
ContentCRM.addCard({
    title: "New Script Idea",
    hook: "Engaging opening line...",
    platform: "IG",
    viralityScore: 8
});

// Update existing card
ContentCRM.updateCard(cardId, { status: "ready" });

// Get all cards
const allCards = ContentCRM.getCards();

// Auto-populate (ready for cron integration)
ContentCRM.autoPopulate();
```

## 📊 Data Export/Import

- **Export**: Click "Export" to download JSON backup
- **Import**: Data persists automatically in localStorage
- **Format**: Standard JSON structure for easy integration

## 🎯 Future Enhancements

- **API Integration** - Connect to content generation systems
- **Cloud Sync** - Cross-device synchronization
- **Team Collaboration** - Multi-user support
- **Analytics API** - Real platform data integration
- **Automated Workflows** - Smart status transitions
- **Content Templates** - Pre-defined script structures

## 🔒 Privacy & Data

- All data stored locally in browser
- No external data transmission
- Export functionality for backups
- No tracking or analytics on the dashboard itself

## 📝 License

MIT License - Feel free to modify and use as needed.

---

Built with ❤️ for efficient content workflow management.