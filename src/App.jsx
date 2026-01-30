import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import Editor from './components/Editor'
import KanbanBoard from './components/KanbanBoard'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects')
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Client Platform Rebuild', status: 'active', revenue: 85000, nextAction: 'Deploy staging environment', blockedReason: null },
      { id: 2, title: 'API Integration Sprint', status: 'active', revenue: 42000, nextAction: 'Code review session', blockedReason: null },
      { id: 3, title: 'Mobile App Prototype', status: 'blocked', revenue: 120000, nextAction: 'Waiting for design approval', blockedReason: 'Pending stakeholder feedback' },
      { id: 4, title: 'Analytics Dashboard', status: 'backlog', revenue: 35000, nextAction: 'Define requirements', blockedReason: null },
      { id: 5, title: 'Payment Gateway', status: 'settled', revenue: 95000, nextAction: 'Completed', blockedReason: null },
    ]
  })

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('documents')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents))
  }, [documents])

  const addProject = (project) => {
    setProjects([...projects, { ...project, id: Date.now() }])
  }

  const updateProject = (id, updates) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  const addDocument = (doc) => {
    setDocuments([...documents, { ...doc, id: Date.now(), createdAt: new Date().toISOString() }])
  }

  const updateDocument = (id, updates) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, ...updates } : d))
  }

  const handleQuickAction = (action) => {
    if (action === 'new-page') {
      const newDoc = {
        title: 'Untitled Document',
        blocks: [{ id: Date.now(), type: 'text', content: '' }]
      }
      addDocument(newDoc)
      setCurrentView('editor')
    } else if (action === 'new-project') {
      setCurrentView('kanban')
    }
    setShowQuickActions(false)
  }

  return (
    <div className="app">
      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <aside className={`mobile-drawer glass-strong ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-brand">COMMAND_CENTER</span>
          <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>
            ✕
          </button>
        </div>
        <nav className="drawer-nav">
          <button
            className={`drawer-link ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('dashboard')
              setIsDrawerOpen(false)
            }}
          >
            <span className="drawer-link-icon">▸</span>
            Dashboard
          </button>
          <button
            className={`drawer-link ${currentView === 'editor' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('editor')
              setIsDrawerOpen(false)
            }}
          >
            <span className="drawer-link-icon">▸</span>
            Editor
          </button>
          <button
            className={`drawer-link ${currentView === 'kanban' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('kanban')
              setIsDrawerOpen(false)
            }}
          >
            <span className="drawer-link-icon">▸</span>
            Kanban
          </button>
        </nav>
      </aside>

      {/* Top Navigation Bar */}
      <nav className="nav-bar glass">
        <button className="mobile-menu-btn" onClick={() => setIsDrawerOpen(true)}>
          ☰
        </button>
        <div className="nav-brand">
          <span className="nav-brand-symbol">█</span>
          <span className="nav-brand-text">COMMAND_CENTER</span>
        </div>
        <div className="nav-links">
          <button
            className={`nav-link glass-hover ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-link glass-hover ${currentView === 'editor' ? 'active' : ''}`}
            onClick={() => setCurrentView('editor')}
          >
            Editor
          </button>
          <button
            className={`nav-link glass-hover ${currentView === 'kanban' ? 'active' : ''}`}
            onClick={() => setCurrentView('kanban')}
          >
            Kanban
          </button>
        </div>
        <div className="nav-status">
          <span className="status-indicator pulse"></span>
          <span className="status-text">LIVE</span>
        </div>
      </nav>

      {/* Floating Plus Menu */}
      <div className="floating-menu">
        {showQuickActions && (
          <div className="quick-actions glass-strong">
            <button
              className="quick-action glass-hover"
              onClick={() => handleQuickAction('new-page')}
            >
              <span className="quick-action-icon">📄</span>
              <span className="quick-action-text">New Page</span>
            </button>
            <button
              className="quick-action glass-hover"
              onClick={() => handleQuickAction('new-project')}
            >
              <span className="quick-action-icon">📊</span>
              <span className="quick-action-text">New Project</span>
            </button>
          </div>
        )}
        <button
          className="floating-plus glass"
          onClick={() => setShowQuickActions(!showQuickActions)}
        >
          {showQuickActions ? '✕' : '+'}
        </button>
      </div>

      <main className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard
            projects={projects}
            onViewChange={setCurrentView}
          />
        )}
        {currentView === 'editor' && (
          <Editor
            documents={documents}
            onAddDocument={addDocument}
            onUpdateDocument={updateDocument}
          />
        )}
        {currentView === 'kanban' && (
          <KanbanBoard
            projects={projects}
            onAddProject={addProject}
            onUpdateProject={updateProject}
            onDeleteProject={deleteProject}
          />
        )}
      </main>
    </div>
  )
}

export default App
