# Roadmap

Future features and enhancements planned for MyPomo.

## 🔧 Configuration

### 1. Timer Duration Presets
- [x] Config popup to customize duration presets (5m, 10m, 25m, Custom)
- [x] Add, remove, and rename presets
- [x] Set default preset

### 2. Category Management
- [x] Config popup for category management
- [x] Add new categories
- [x] Remove existing categories
- [x] Rename categories
- [x] Set default categories list

### 3. Database Reset
- [x] Config popup to reset IndexedDB
- [x] Confirm before data loss
- [x] Clear all sessions and stats

## ✅ Task Management

### 4. Daily Task List
- [x] Task list panel (today's tasks)
- [x] Add, edit, remove tasks
- [x] Set priority / order (up/down reorder)
- [x] Mark tasks complete
- [x] Auto-clear completed tasks on new day

### 5. Task + Timer Integration
- [x] Start pomodoro session directly from a task
- [x] Auto-fill session title and category from task
- [x] Track completed pomodoros per task
- [x] Show task progress (sessions done / estimated)
- [x] Task status: todo → in progress → done

### 6. Task Persistence
- [x] IndexedDB `tasks` store
- [x] Task schema: title, category, priority, status, estimatedSessions, completedSessions, createdAt, completedAt
- [x] Query tasks by date and status

## 📝 Notes System

### 7. Markdown Note Editor
- [ ] New page with vim-motion friendly markdown editor
- [ ] Syntax highlighting for markdown
- [ ] Real-time preview
- [ ] Keyboard shortcuts (similar to vim motions)

### 8. Storage Options
- [ ] Evaluate PWA storage options for notes
- [ ] Assess offline-first approach
- [ ] Consider migration path to desktop framework if needed
  - **Option A**: Continue with PWA (fully offline)
  - **Option B**: Migrate to Tauri (desktop app)
  - **Option C**: Migrate to Electron (desktop app)

### 9. Note Management
- [ ] Create notes and organize in folders
- [ ] Categorize notes by project/topic
- [ ] Search and filter notes
- [ ] Tag system for organization

## 🔗 Notes + Timer Integration

### 10. Auto-Create Notes on Timer Start
- [ ] Create new note when starting a focus session
- [ ] Auto-fill note with task title and category
- [ ] Link note to specific session

### 11. Open Notes from Timer
- [ ] Button to open/edit related note while timer is running
- [ ] Quick access to reference materials
- [ ] Notes panel in timer view

### 12. Trigger Focus Sessions from Notes
- [ ] Start timer directly from note interface
- [ ] Set duration based on note content
- [ ] Assign category from note tags

## 🤖 AI Planning

### 13. Project Planning Assistant
- [ ] Connect to Google AI Studio initially
- [ ] Integration with Claude API for advanced features
- [ ] Integration with Z.ai API as alternative
- [ ] Create project briefs based on user input
- [ ] Generate task lists from project briefs
- [ ] Suggest optimal session timing based on task complexity

### 14. API Key Management
- [ ] Secure storage of API keys
- [ ] Support multiple AI providers
- [ ] Easy provider switching
- [ ] Usage tracking and limits

## ☁️ Cloud Sync

### 15. Notion Integration
- [ ] Backup notes to Notion workspace
- [ ] Sync session history to Notion database
- [ ] Define database schema for Notion
- [ ] Initialize from existing Notion data
- [ ] Permission system for accessing user's Notion

### 16. Space/Parent Page Access
- [ ] Request permission to access specific Notion page
- [ ] Request permission to access parent page (workspace root)
- [ ] OAuth flow for secure authorization
- [ ] Granular permission controls

### 17. Sync Configuration
- [ ] Auto-sync toggle
- [ ] Manual sync button
- [ **Sync notes only** (default)
- [ ] **Sync sessions only**
- [ ] **Sync everything** (notes + sessions)
- [ ] Conflict resolution strategies

## 📊 Enhanced Statistics

### 18. Advanced Analytics
- [ ] Daily/Weekly/Monthly productivity reports
- [ ] Charts and graphs for visualization
- [ ] Productivity trends over time
- [ ] Category performance comparison
- [ ] Streak analysis and insights

### 19. Export Formats
- [ ] Export to CSV
- [x] Export to JSON
- [ ] Export to PDF
- [ ] Export summary reports

## 🎨 UI/UX Improvements

### 20. Theme System
- [ ] Light mode option
- [ ] Custom color schemes
- [ ] High contrast mode
- [ ] Import/export themes

### 21. Animations
- [ ] Smooth transitions between modes
- [ ] Timer countdown animation
- [ ] Session completion celebration
- [ ] Reduced motion option

### 22. Keyboard Shortcuts
- [x] Global hotkeys for timer controls
- [x] Vim-style navigation (j/k for task navigation)
- [x] Help modal with key reference (? key)
- [ ] Customizable shortcuts

## 📱 Cross-Platform

### 23. Desktop Applications
- [ ] Evaluate Tauri for native desktop app
- [ ] Evaluate Electron for native desktop app
- [ ] Native notifications
- [ ] System tray integration
- [ ] Cross-platform file system access

## 🔒 Security & Privacy

### 24. Data Security
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
   - ~~Configuration popups (1, 2, 3)~~ ✅ Done
   - ~~Task management (4, 5, 6)~~ ✅ Done
   - ~~Keyboard shortcuts (22)~~ ✅ Done (minus customizable shortcuts)

2. **Medium Term** (Next 3-6 months)
   - Basic notes page (7)
   - Notes management system (9)
   - Notes + Timer integration (10, 11, 12)
   - Notion integration (15, 16, 17)

3. **Long Term** (6+ months)
   - AI Planning (13, 14)
   - Desktop app migration (23)
   - Advanced analytics (18)

## Completed

- **v0.1** — Timer, session tracking, IndexedDB persistence, chime audio, PWA
- **v0.2** — Settings modal (timer presets, category management, database reset), config persistence, testing infrastructure (Vitest + 27 tests), formatRelativeTime bug fix
- **v0.3** — Task management (daily task list, task+timer integration, task persistence, session linking), 43 tests
- **v0.4** — Keyboard shortcuts (global hotkeys, vim-style j/k task navigation, help modal), ShortcutsHelpModal component, useKeyboardShortcuts composable
