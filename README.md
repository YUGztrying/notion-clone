# Command Center - Glassmorphic Notion Clone

A sophisticated B&W Notion clone featuring a glassmorphic design language, built with React and Vite. This application combines a strategic dashboard, block-based editor, and financial Kanban board in a stunning monochrome aesthetic.

![Command Center](https://img.shields.io/badge/React-18.3.1-blue) ![Vite](https://img.shields.io/badge/Vite-7.3.1-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## Features

### Strategic Dashboard
- **Real-time KPIs**: Track total projects, advancement percentage, and pipeline value
- **Execution Timeline**: Live feed of project statuses with next action visibility
- **Revenue Ledger**: Financial contribution breakdown with visual percentage bars
- **Typing Animation**: Character-by-character reveal with 50ms delay on headline

### Block-Based Editor
- **Keyboard-First Navigation**:
  - `Enter` - Create new block
  - `Backspace` - Delete empty block
  - `/` - Open slash command menu
- **Block Types**:
  - Text blocks
  - H1 and H2 headings
  - Interactive to-do lists
  - Tables
- **Auto-Detection**: Markdown-style shortcuts (`#`, `##`, `- [ ]`)
- **Document Management**: Create, edit, and organize documents

### Financial Kanban Board
- **Three-Column Workflow**: Backlog → Active Execution → Settled
- **Revenue-Focused**: Prominent revenue display on each project card
- **Drag-and-Drop**: Move projects between columns
- **Project Management**: Edit, block, and delete projects with detailed tracking

### Design Language
- **Pure Black Background**: `#000000` for maximum contrast
- **Glassmorphic Components**: Subtle borders with `rgba(255, 255, 255, 0.1)`
- **Backdrop-Blur Effects**: Creating depth and layering
- **Mobile-First**: Responsive side-drawer menu for mobile devices
- **Floating Quick Actions**: Bottom-right menu for instant page/project creation
- **Smooth Animations**: Fade-ins, slide-ups, and hover transitions

## Tech Stack

- **React 18.3.1** - UI framework
- **Vite 7.3.1** - Build tool and dev server
- **CSS3** - Glassmorphic styling with backdrop-filter
- **LocalStorage** - Data persistence

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YUGztrying/notion-clone.git

# Navigate to project directory
cd notion-clone

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

## Project Structure

```
notion-clone/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx       # Strategic dashboard with KPIs
│   │   ├── Dashboard.css
│   │   ├── Editor.jsx          # Block-based editor
│   │   ├── Editor.css
│   │   ├── KanbanBoard.jsx     # Financial Kanban
│   │   └── KanbanBoard.css
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # Navigation and layout
│   ├── index.css               # Global styles and theme
│   └── main.jsx                # App entry point
├── index.html
├── package.json
└── vite.config.js
```

## Key Features Explained

### Glassmorphic Design
All components use a consistent glassmorphic design with:
- `backdrop-filter: blur(8px)` for frosted glass effect
- Semi-transparent backgrounds (`rgba(255, 255, 255, 0.05)`)
- Subtle borders for component separation
- Smooth hover transitions

### Data Persistence
- All projects and documents are saved to `localStorage`
- Automatic save on every change
- Data persists across browser sessions

### Responsive Design
- Desktop: Full navigation bar with three views
- Mobile: Hamburger menu with slide-out drawer
- Adaptive layouts for all screen sizes

## Keyboard Shortcuts

### Editor
- `Enter` - New block
- `Backspace` - Delete empty block
- `/` - Slash command menu
- `#` + `Space` - H1 heading
- `##` + `Space` - H2 heading
- `- [ ]` + `Space` - To-do list

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - feel free to use this project for your own purposes.

## Credits

Built with React and Vite. Designed with a focus on minimalism and functionality.

Co-Authored-By: Claude Sonnet 4.5

---

**Live Demo**: [View on GitHub](https://github.com/YUGztrying/notion-clone)
