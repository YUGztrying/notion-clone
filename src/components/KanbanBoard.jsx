import { useState } from 'react'
import './KanbanBoard.css'

export default function KanbanBoard({ projects, onAddProject, onUpdateProject, onDeleteProject }) {
  const [showAddForm, setShowAddForm] = useState(null)
  const [newProject, setNewProject] = useState({ title: '', revenue: '', status: 'backlog' })

  const columns = [
    { id: 'backlog', title: 'BACKLOG', status: 'backlog' },
    { id: 'active', title: 'ACTIVE_EXECUTION', status: 'active' },
    { id: 'settled', title: 'SETTLED', status: 'settled' },
  ]

  const getProjectsByStatus = (status) => {
    return projects.filter(p => p.status === status || (status === 'active' && p.status === 'blocked'))
  }

  const handleAddProject = (status) => {
    if (newProject.title && newProject.revenue) {
      onAddProject({
        ...newProject,
        status,
        revenue: parseFloat(newProject.revenue),
        nextAction: 'Define next steps',
        blockedReason: null,
      })
      setNewProject({ title: '', revenue: '', status: 'backlog' })
      setShowAddForm(null)
    }
  }

  const handleDragStart = (e, projectId) => {
    e.dataTransfer.setData('projectId', projectId.toString())
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    const projectId = parseInt(e.dataTransfer.getData('projectId'))
    onUpdateProject(projectId, { status })
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getTotalRevenue = (status) => {
    return getProjectsByStatus(status).reduce((sum, p) => sum + p.revenue, 0)
  }

  return (
    <div className="kanban">
      <div className="kanban-header">
        <h1 className="kanban-title">FINANCIAL_KANBAN</h1>
        <div className="kanban-subtitle">PROJECT_PIPELINE_MANAGEMENT</div>
      </div>

      <div className="kanban-board">
        {columns.map((column, colIndex) => (
          <div
            key={column.id}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
            style={{ animationDelay: `${colIndex * 0.1}s` }}
          >
            <div className="column-header">
              <div className="column-title-group">
                <h2 className="column-title">{column.title}</h2>
                <div className="column-count">
                  {getProjectsByStatus(column.status).length}
                </div>
              </div>
              <div className="column-revenue">
                {formatCurrency(getTotalRevenue(column.status))}
              </div>
            </div>

            <div className="column-content">
              {getProjectsByStatus(column.status).map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onDragStart={handleDragStart}
                  onUpdate={onUpdateProject}
                  onDelete={onDeleteProject}
                  formatCurrency={formatCurrency}
                />
              ))}

              {showAddForm === column.status ? (
                <div className="add-form">
                  <input
                    type="text"
                    className="add-input"
                    placeholder="Project title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    autoFocus
                  />
                  <input
                    type="number"
                    className="add-input"
                    placeholder="Revenue ($)"
                    value={newProject.revenue}
                    onChange={(e) => setNewProject({ ...newProject, revenue: e.target.value })}
                  />
                  <div className="add-actions">
                    <button
                      className="add-button add-submit"
                      onClick={() => handleAddProject(column.status)}
                    >
                      [ADD]
                    </button>
                    <button
                      className="add-button add-cancel"
                      onClick={() => {
                        setShowAddForm(null)
                        setNewProject({ title: '', revenue: '', status: 'backlog' })
                      }}
                    >
                      [CANCEL]
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="add-project-button"
                  onClick={() => setShowAddForm(column.status)}
                >
                  + ADD_PROJECT
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectCard({ project, index, onDragStart, onUpdate, onDelete, formatCurrency }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState({
    nextAction: project.nextAction,
    blockedReason: project.blockedReason || '',
  })

  const handleSave = () => {
    onUpdate(project.id, editValues)
    setIsEditing(false)
  }

  const toggleBlocked = () => {
    const newStatus = project.status === 'blocked' ? 'active' : 'blocked'
    onUpdate(project.id, { status: newStatus })
  }

  return (
    <div
      className={`project-card ${project.status === 'blocked' ? 'blocked' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, project.id)}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="card-header">
        <div className="card-title-row">
          <button
            className="card-expand"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼' : '▸'}
          </button>
          <h3 className="card-title">{project.title}</h3>
        </div>
        {project.status === 'blocked' && (
          <div className="card-blocked-badge">BLOCKED</div>
        )}
      </div>

      <div className="card-revenue">
        <span className="revenue-label">REVENUE:</span>
        <span className="revenue-value">{formatCurrency(project.revenue)}</span>
      </div>

      {isExpanded && (
        <div className="card-expanded">
          <div className="card-section">
            <div className="card-section-label">NEXT_ACTION:</div>
            {isEditing ? (
              <input
                type="text"
                className="card-input"
                value={editValues.nextAction}
                onChange={(e) => setEditValues({ ...editValues, nextAction: e.target.value })}
              />
            ) : (
              <div className="card-section-value">{project.nextAction}</div>
            )}
          </div>

          {(project.status === 'blocked' || isEditing) && (
            <div className="card-section">
              <div className="card-section-label">BLOCKED_REASON:</div>
              {isEditing ? (
                <input
                  type="text"
                  className="card-input"
                  value={editValues.blockedReason}
                  onChange={(e) => setEditValues({ ...editValues, blockedReason: e.target.value })}
                />
              ) : (
                <div className="card-section-value">{project.blockedReason || 'N/A'}</div>
              )}
            </div>
          )}

          <div className="card-actions">
            {isEditing ? (
              <>
                <button className="card-action" onClick={handleSave}>
                  [SAVE]
                </button>
                <button className="card-action" onClick={() => setIsEditing(false)}>
                  [CANCEL]
                </button>
              </>
            ) : (
              <>
                <button className="card-action" onClick={() => setIsEditing(true)}>
                  [EDIT]
                </button>
                <button className="card-action" onClick={toggleBlocked}>
                  [{project.status === 'blocked' ? 'UNBLOCK' : 'BLOCK'}]
                </button>
                <button className="card-action card-action-danger" onClick={() => onDelete(project.id)}>
                  [DELETE]
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
