import { useState } from 'react';

export default function Tabs({ items, activeTab, onTabChange, large = false, className = '' }) {
  const [internalActive, setInternalActive] = useState(0);
  
  const active = activeTab !== undefined ? activeTab : internalActive;
  const handleTabClick = (index) => {
    if (onTabChange) {
      onTabChange(index);
    } else {
      setInternalActive(index);
    }
  };

  return (
    <div className={`tabs${large ? ' tabs--large' : ''} ${className}`.trim()}>
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          className={`tab${active === index ? ' tab--active' : ''}`}
          onClick={() => handleTabClick(index)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
