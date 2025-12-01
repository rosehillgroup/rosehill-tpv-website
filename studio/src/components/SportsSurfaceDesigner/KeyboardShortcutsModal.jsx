import React from 'react';

/**
 * Keyboard Shortcuts Help Modal
 * Shows all available keyboard shortcuts for the Sports Surface Designer
 */
function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { category: 'Selection', items: [
      { keys: ['Delete'], description: 'Remove selected element' },
      { keys: ['Escape'], description: 'Deselect element' },
    ]},
    { category: 'Edit', items: [
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
      { keys: ['Ctrl', 'D'], description: 'Duplicate selected' },
    ]},
    { category: 'Move', items: [
      { keys: ['Arrow Keys'], description: 'Nudge element (10mm)' },
      { keys: ['Shift', 'Arrow Keys'], description: 'Large nudge (100mm)' },
    ]},
    { category: 'Layers', items: [
      { keys: ['['], description: 'Send backward' },
      { keys: [']'], description: 'Bring forward' },
    ]},
    { category: 'View', items: [
      { keys: ['G'], description: 'Toggle snap to grid' },
      { keys: ['?'], description: 'Show this help' },
    ]},
  ];

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const ctrlKey = isMac ? '⌘' : 'Ctrl';

  return (
    <div
      className="keyboard-shortcuts-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
    >
      <div
        className="keyboard-shortcuts-modal"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '480px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '4px 8px',
              color: '#666',
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {shortcuts.map(section => (
          <div key={section.category} style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: '#666',
              marginBottom: '8px',
              letterSpacing: '0.5px'
            }}>
              {section.category}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {section.items.map((shortcut, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                  }}
                >
                  <span style={{ color: '#333', fontSize: '0.9rem' }}>
                    {shortcut.description}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {shortcut.keys.map((key, keyIdx) => (
                      <kbd
                        key={keyIdx}
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          background: '#f5f5f5',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          minWidth: '24px',
                          textAlign: 'center',
                        }}
                      >
                        {key === 'Ctrl' ? ctrlKey : key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p style={{
          fontSize: '0.8rem',
          color: '#888',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #eee',
          marginBottom: 0
        }}>
          Press <kbd style={{
            padding: '2px 6px',
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '3px',
            fontSize: '0.75rem',
          }}>?</kbd> at any time to show this help
        </p>
      </div>
    </div>
  );
}

export default KeyboardShortcutsModal;
