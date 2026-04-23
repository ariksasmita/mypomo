# Roadmap

Future features and enhancements planned for MyPomo.

## 🔧 Configuration

### 1. Timer Duration Presets
- [ ] Config popup to customize duration presets (5m, 10m, 25m, Custom)
- [ ] Add, remove, and rename presets
- [ ] Set default preset

### 2. Category Management
- [ ] Config popup for category management
- [ ] Add new categories
- [ ] Remove existing categories
- [ ] Rename categories
- [ ] Set default categories list

### 3. Database Reset
- [ ] Config popup to reset IndexedDB
- [ ] Confirm before data loss
- [ ] Clear all sessions and stats

## 📝 Notes System

### 4. Markdown Note Editor
- [ ] New page with vim-motion friendly markdown editor
- [ ] Syntax highlighting for markdown
- [ ] Real-time preview
- [ ] Keyboard shortcuts (similar to vim motions)

### 5. Storage Options
- [ ] Evaluate PWA storage options for notes
- [ ] Assess offline-first approach
- [ ] Consider migration path to desktop framework if needed
  - **Option A**: Continue with PWA (fully offline)
  - **Option B**: Migrate to Tauri (desktop app)
  - **Option C**: Migrate to Electron (desktop app)

### 6. Note Management
- [ ] Create notes and organize in folders
- [ ] Categorize notes by project/topic
- [ ] Search and filter notes
- [ ] Tag system for organization

## 🔗 Notes + Timer Integration

### 7. Auto-Create Notes on Timer Start
- [ ] Create new note when starting a focus session
- [ ] Auto-fill note with task title and category
- [ ] Link note to specific session

### 8. Open Notes from Timer
- [ ] Button to open/edit related note while timer is running
- [ ] Quick access to reference materials
- [ ] Notes panel in timer view

### 9. Trigger Focus Sessions from Notes
- [ ] Start timer directly from note interface
- [ ] Set duration based on note content
- [ ] Assign category from note tags

## 🤖 AI Planning

### 10. Project Planning Assistant
- [ ] Connect to Google AI Studio initially
- [ ] Integration with Claude API for advanced features
- [ ] Integration with Z.ai API as alternative
- [ ] Create project briefs based on user input
- [ ] Generate task lists from project briefs
- [ ] Suggest optimal session timing based on task complexity

### 11. API Key Management
- [ ] Secure storage of API keys
- [ ] Support multiple AI providers
- [ ] Easy provider switching
- [ ] Usage tracking and limits

## ☁️ Cloud Sync

### 12. Notion Integration
- [ ] Backup notes to Notion workspace
- [ ] Sync session history to Notion database
- [ ] Define database schema for Notion
- [ ] Initialize from existing Notion data
- [ ] Permission system for accessing user's Notion

### 13. Space/Parent Page Access
- [ ] Request permission to access specific Notion page
- [ ] Request permission to access parent page (workspace root)
- [ ] OAuth flow for secure authorization
- [ ] Granular permission controls

### 14. Sync Configuration
- [ ] Auto-sync toggle
- [ ] Manual sync button
- [ **Sync notes only** (default)
- [ ] **Sync sessions only**
- [ ] **Sync everything** (notes + sessions)
- [ ] Conflict resolution strategies

## 📊 Enhanced Statistics

### 15. Advanced Analytics
- [ ] Daily/Weekly/Monthly productivity reports
- [ ] Charts and graphs for visualization
- [ ] Productivity trends over time
- [ ] Category performance comparison
- [ ] Streak analysis and insights

### 16. Export Formats
- [ ] Export to CSV
- [ ] Export to JSON
- [ ] Export to PDF
- [ ] Export summary reports

## 🎨 UI/UX Improvements

### 17. Theme System
- [ ] Light mode option
- [ ] Custom color schemes
- [ ] High contrast mode
- [ ] Import/export themes

### 18. Animations
- [ ] Smooth transitions between modes
- [ ] Timer countdown animation
- [ ] Session completion celebration
- [ ] Reduced motion option

### 19. Keyboard Shortcuts
- [ ] Global hotkeys for timer controls
- [ ] Vim-style navigation
- [ ] Customizable shortcuts
- [ ] Help modal with key reference

## 📱 Cross-Platform

### 20. Desktop Applications
- [ ] Evaluate Tauri for native desktop app
- [ ] Evaluate Electron for native desktop app
- [ ] Native notifications
- [ ] System tray integration
- [ ] Cross-platform file system access

## 🔒 Security & Privacy

### 21. Data Security
- [ ] Local-first approach (all data stored locally)
- [ ] Encrypted sync to cloud services
- [ ] API key encryption
- [ ] Clear data on request

---

## Priority Levels

- 🔴 **High Priority** - Core features for improved productivity
- 🟡 **Medium Priority** - Nice-to-have enhancements
- 🟢 **Low Priority** - Future considerations

## Current Focus Areas

1. **Short Term** (Next 1-2 releases)
   - Configuration popups (1, 2, 3)
   - Basic notes page (4)

2. **Medium Term** (Next 3-6 months)
   - Notes management system (6)
   - Notes + Timer integration (7, 8, 9)
   - Notion integration (12, 13, 14)

3. **Long Term** (6+ months)
   - AI Planning (10, 11)
   - Desktop app migration (20)
   - Advanced analytics (15)
