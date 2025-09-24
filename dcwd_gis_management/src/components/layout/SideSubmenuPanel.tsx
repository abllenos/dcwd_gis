import React from 'react';

export interface SideSubmenuItem {
  key: string;
  label: string;
  type?: 'header' | 'item';
}

interface SideSubmenuPanelProps {
  open: boolean;
  title: string;
  items: SideSubmenuItem[];
  leftOffset: number; // distance from the left edge (to sit beside the sidebar)
  onClose: () => void;
  onSelect: (key: string) => void;
}

// Lightweight side panel that appears next to the sidebar instead of using dropdowns
const SideSubmenuPanel: React.FC<SideSubmenuPanelProps> = ({
  open,
  title,
  items,
  leftOffset,
  onClose,
  onSelect,
}) => {
  return (
    <>
      {/* Mask */}
      <div
        className="sidepanel-mask"
        style={{ display: open ? 'block' : 'none' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="sidepanel-container"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(-8px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          left: leftOffset,
        }}
        aria-hidden={!open}
      >
        <div className="sidepanel-header">
          <div className="sidepanel-title">{title}</div>
          <button className="sidepanel-close" onClick={onClose} aria-label="Close submenu">
            ×
          </button>
        </div>
        <div className="sidepanel-body">
          {items.map((it) =>
            it.type === 'header' ? (
              <div key={it.key} className="sidepanel-group-header">{it.label}</div>
            ) : (
              <button key={it.key} className="sidepanel-item" onClick={() => onSelect(it.key)}>
                {it.label}
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default SideSubmenuPanel;
