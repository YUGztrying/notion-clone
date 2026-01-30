import { useMemo, useState, useEffect } from 'react'
import './Dashboard.css'

function TypingAnimation({ text, delay = 50 }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, delay)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, delay])

  return <span>{displayedText}<span className="typing-cursor">|</span></span>
}

export default function Dashboard({ projects, onViewChange }) {
  const metrics = useMemo(() => {
    const totalProjects = projects.length
    const activeProjects = projects.filter(p => p.status === 'active').length
    const settledProjects = projects.filter(p => p.status === 'settled').length
    const efficiency = totalProjects > 0 ? Math.round((settledProjects / totalProjects) * 100) : 0
    const pipelineValue = projects.reduce((sum, p) => sum + p.revenue, 0)

    return { totalProjects, activeProjects, efficiency, pipelineValue }
  }, [projects])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getStatusSymbol = (status) => {
    switch (status) {
      case 'active': return '▸'
      case 'blocked': return '■'
      case 'settled': return '✓'
      case 'backlog': return '○'
      default: return '○'
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'status-active'
      case 'blocked': return 'status-blocked'
      case 'settled': return 'status-settled'
      case 'backlog': return 'status-backlog'
      default: return ''
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header glass">
        <h1 className="dashboard-title">
          <TypingAnimation text="STRATEGIC DASHBOARD" delay={50} />
        </h1>
        <div className="dashboard-subtitle">COMMAND_CENTER.V2</div>
      </div>

      {/* KPI Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="kpi-label">TOTAL_PROJECTS</div>
          <div className="kpi-value">{metrics.totalProjects}</div>
          <div className="kpi-graph">
            <div className="kpi-bar" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="kpi-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="kpi-label">ADVANCEMENT_%</div>
          <div className="kpi-value">{metrics.efficiency}%</div>
          <div className="kpi-graph">
            <div className="kpi-bar" style={{ width: `${metrics.efficiency}%` }}></div>
          </div>
        </div>

        <div className="kpi-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="kpi-label">PIPELINE_VALUE</div>
          <div className="kpi-value kpi-value-large">{formatCurrency(metrics.pipelineValue)}</div>
          <div className="kpi-graph">
            <div className="kpi-bar" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Execution Timeline */}
        <div className="timeline-section animate-fade" style={{ animationDelay: '0.4s' }}>
          <div className="section-header">
            <h2 className="section-title">EXECUTION_TIMELINE</h2>
            <button className="section-action" onClick={() => onViewChange('kanban')}>
              VIEW_KANBAN →
            </button>
          </div>

          <div className="timeline-list">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`timeline-item ${getStatusClass(project.status)}`}
                style={{ animationDelay: `${0.5 + index * 0.05}s` }}
              >
                <div className="timeline-status">
                  <span className="timeline-symbol">{getStatusSymbol(project.status)}</span>
                  <span className="timeline-status-text">{project.status.toUpperCase()}</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">{project.title}</div>
                  <div className="timeline-action">
                    <span className="timeline-label">NEXT:</span>
                    <span className="timeline-text">{project.nextAction}</span>
                  </div>
                </div>
                <div className="timeline-revenue">{formatCurrency(project.revenue)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Ledger */}
        <div className="ledger-section animate-fade" style={{ animationDelay: '0.5s' }}>
          <div className="section-header">
            <h2 className="section-title">REVENUE_LEDGER</h2>
          </div>

          <div className="ledger-list">
            <div className="ledger-header">
              <div className="ledger-col">PROJECT</div>
              <div className="ledger-col ledger-col-right">CONTRIBUTION</div>
            </div>

            {projects
              .sort((a, b) => b.revenue - a.revenue)
              .map((project, index) => {
                const percentage = (project.revenue / metrics.pipelineValue * 100).toFixed(1)
                return (
                  <div
                    key={project.id}
                    className="ledger-item"
                    style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                  >
                    <div className="ledger-project">
                      <span className={`ledger-status ${getStatusClass(project.status)}`}>
                        {getStatusSymbol(project.status)}
                      </span>
                      <span className="ledger-name">{project.title}</span>
                    </div>
                    <div className="ledger-value">
                      <span className="ledger-amount">{formatCurrency(project.revenue)}</span>
                      <span className="ledger-percentage">{percentage}%</span>
                    </div>
                    <div className="ledger-bar-container">
                      <div className="ledger-bar" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                )
              })}

            <div className="ledger-total">
              <div className="ledger-total-label">TOTAL_FORECAST</div>
              <div className="ledger-total-value">{formatCurrency(metrics.pipelineValue)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
