import { useState, useEffect, useRef } from 'react'
import './Editor.css'

const BLOCK_TYPES = [
  { id: 'text', label: 'Text', icon: '📝', description: 'Plain text block' },
  { id: 'h1', label: 'Heading 1', icon: 'H1', description: 'Large heading' },
  { id: 'h2', label: 'Heading 2', icon: 'H2', description: 'Medium heading' },
  { id: 'todo', label: 'To-do List', icon: '☑', description: 'Checkbox item' },
  { id: 'table', label: 'Table', icon: '⊞', description: 'Simple table' },
]

export default function Editor({ documents, onAddDocument, onUpdateDocument }) {
  const [activeDoc, setActiveDoc] = useState(null)
  const [blocks, setBlocks] = useState([{ id: Date.now(), type: 'text', content: '' }])
  const [focusedBlock, setFocusedBlock] = useState(null)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashMenuBlock, setSlashMenuBlock] = useState(null)
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (activeDoc) {
      const doc = documents.find(d => d.id === activeDoc)
      if (doc && doc.blocks) {
        setBlocks(doc.blocks)
      }
    }
  }, [activeDoc, documents])

  const createNewDocument = () => {
    const newDoc = {
      title: 'Untitled Document',
      blocks: [{ id: Date.now(), type: 'text', content: '' }]
    }
    onAddDocument(newDoc)
    setActiveDoc(newDoc.id)
    setBlocks(newDoc.blocks)
  }

  const updateBlocks = (newBlocks) => {
    setBlocks(newBlocks)
    if (activeDoc) {
      onUpdateDocument(activeDoc, { blocks: newBlocks })
    }
  }

  const handleKeyDown = (e, blockId, index) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const newBlock = { id: Date.now(), type: 'text', content: '' }
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      updateBlocks(newBlocks)
      setTimeout(() => setFocusedBlock(newBlock.id), 0)
    } else if (e.key === 'Backspace' && blocks[index].content === '' && blocks.length > 1) {
      e.preventDefault()
      const newBlocks = blocks.filter(b => b.id !== blockId)
      updateBlocks(newBlocks)
      if (index > 0) {
        setTimeout(() => setFocusedBlock(blocks[index - 1].id), 0)
      }
    }
  }

  const handleBlockChange = (blockId, content, event) => {
    // Show slash menu when user types "/"
    if (content === '/' && !showSlashMenu) {
      setShowSlashMenu(true)
      setSlashMenuBlock(blockId)
      if (event && event.target) {
        const rect = event.target.getBoundingClientRect()
        setSlashMenuPosition({ top: rect.bottom + 4, left: rect.left })
      }
      return
    }

    // Hide slash menu if content is cleared or changed
    if (showSlashMenu && content !== '/') {
      setShowSlashMenu(false)
    }

    const newBlocks = blocks.map(block => {
      if (block.id === blockId) {
        // Auto-detect block type based on content
        let type = 'text'
        let actualContent = content

        if (content.startsWith('# ')) {
          type = 'h1'
          actualContent = content.substring(2)
        } else if (content.startsWith('## ')) {
          type = 'h2'
          actualContent = content.substring(3)
        } else if (content.startsWith('- [ ]') || content.startsWith('- [x]')) {
          type = 'todo'
        }

        return { ...block, type, content: actualContent }
      }
      return block
    })
    updateBlocks(newBlocks)
  }

  const handleSlashCommand = (blockType) => {
    const newBlocks = blocks.map(block => {
      if (block.id === slashMenuBlock) {
        let content = ''
        if (blockType === 'todo') {
          content = '- [ ] '
        } else if (blockType === 'table') {
          content = '| Header 1 | Header 2 |\n|----------|----------|'
        }
        return { ...block, type: blockType, content }
      }
      return block
    })
    updateBlocks(newBlocks)
    setShowSlashMenu(false)
    setFocusedBlock(slashMenuBlock)
  }

  const toggleTodo = (blockId) => {
    const newBlocks = blocks.map(block => {
      if (block.id === blockId && block.type === 'todo') {
        const isChecked = block.content.startsWith('- [x]')
        const newContent = isChecked
          ? block.content.replace('- [x]', '- [ ]')
          : block.content.replace('- [ ]', '- [x]')
        return { ...block, content: newContent }
      }
      return block
    })
    updateBlocks(newBlocks)
  }

  return (
    <div className="editor">
      <div className="editor-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">DOCUMENTS</h2>
          <button className="sidebar-action" onClick={createNewDocument}>
            [+NEW]
          </button>
        </div>

        <div className="document-list">
          {documents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">□</div>
              <div className="empty-text">NO DOCUMENTS</div>
              <div className="empty-hint">Create your first document</div>
            </div>
          ) : (
            documents.map((doc, index) => (
              <button
                key={doc.id}
                className={`document-item ${activeDoc === doc.id ? 'active' : ''}`}
                onClick={() => setActiveDoc(doc.id)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="document-icon">▸</div>
                <div className="document-info">
                  <div className="document-title">{doc.title}</div>
                  <div className="document-meta">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="editor-main">
        {!activeDoc ? (
          <div className="editor-empty">
            <div className="editor-empty-content">
              <h2 className="editor-empty-title">WORKSPACE_EDITOR</h2>
              <div className="editor-empty-text">
                Select a document or create a new one to begin
              </div>
              <button className="editor-empty-action" onClick={createNewDocument}>
                [CREATE_DOCUMENT]
              </button>
            </div>
          </div>
        ) : (
          <div className="editor-canvas">
            <div className="editor-header">
              <input
                type="text"
                className="editor-title-input"
                value={documents.find(d => d.id === activeDoc)?.title || ''}
                onChange={(e) => onUpdateDocument(activeDoc, { title: e.target.value })}
                placeholder="UNTITLED_DOCUMENT"
              />
            </div>

            <div className="editor-blocks">
              {blocks.map((block, index) => (
                <Block
                  key={block.id}
                  block={block}
                  index={index}
                  focused={focusedBlock === block.id}
                  onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                  onChange={(content) => handleBlockChange(block.id, content)}
                  onToggleTodo={() => toggleTodo(block.id)}
                />
              ))}
            </div>

            {/* Slash Command Menu */}
            {showSlashMenu && (
              <div className="slash-menu glass-strong">
                <div className="slash-menu-header">
                  <span>BLOCKS</span>
                </div>
                {BLOCK_TYPES.map((blockType) => (
                  <button
                    key={blockType.id}
                    className="slash-menu-item glass-hover"
                    onClick={() => handleSlashCommand(blockType.id)}
                  >
                    <span className="slash-menu-icon">{blockType.icon}</span>
                    <div className="slash-menu-content">
                      <div className="slash-menu-label">{blockType.label}</div>
                      <div className="slash-menu-desc">{blockType.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="editor-hints">
              <div className="hint-item">
                <span className="hint-key">ENTER</span>
                <span className="hint-desc">New block</span>
              </div>
              <div className="hint-item">
                <span className="hint-key">BACKSPACE</span>
                <span className="hint-desc">Delete empty block</span>
              </div>
              <div className="hint-item">
                <span className="hint-key">#</span>
                <span className="hint-desc">Heading 1</span>
              </div>
              <div className="hint-item">
                <span className="hint-key">##</span>
                <span className="hint-desc">Heading 2</span>
              </div>
              <div className="hint-item">
                <span className="hint-key">- [ ]</span>
                <span className="hint-desc">Todo</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Block({ block, index, focused, onKeyDown, onChange, onToggleTodo }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [focused])

  const renderBlock = () => {
    const baseProps = {
      ref: inputRef,
      value: block.content,
      onChange: (e) => onChange(e.target.value, e),
      onKeyDown,
      placeholder: 'Type something...',
      className: 'block-input',
    }

    switch (block.type) {
      case 'h1':
        return <input {...baseProps} className="block-input block-h1" placeholder="Heading 1" />
      case 'h2':
        return <input {...baseProps} className="block-input block-h2" placeholder="Heading 2" />
      case 'todo':
        return (
          <div className="block-todo">
            <button
              className="todo-checkbox"
              onClick={onToggleTodo}
            >
              {block.content.startsWith('- [x]') ? '■' : '□'}
            </button>
            <input
              {...baseProps}
              className="block-input block-todo-input"
              value={block.content.replace(/^- \[[x ]\] /, '')}
              onChange={(e) => {
                const checked = block.content.startsWith('- [x]')
                onChange(`- [${checked ? 'x' : ' '}] ${e.target.value}`, e)
              }}
              placeholder="Todo item"
            />
          </div>
        )
      default:
        return <textarea {...baseProps} className="block-input block-text" rows={1} />
    }
  }

  return (
    <div className={`editor-block ${block.type}`} style={{ animationDelay: `${index * 0.02}s` }}>
      <div className="block-handle">▸</div>
      <div className="block-content">
        {renderBlock()}
      </div>
    </div>
  )
}
