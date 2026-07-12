import { useState } from 'react';

export default function Tabs({ items, large = false, className = '' }) {
  const [active, setActive] = useState(0);

  return (
    <div className={`tabs${large ? ' tabs--large' : ''} ${className}`.trim()}>
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          className={`tab${active === index ? ' tab--active' : ''}`}
          onClick={() => setActive(index)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
