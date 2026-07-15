import { useEffect, useMemo, useState } from 'react';
import { filterGroups } from '../../data/mockData';

function FilterOption({ label, defaultChecked, isGenre }) {
  return (
    <label className={`cyber-filter-btn ${isGenre ? 'cyber-filter-btn--genre' : ''}`}>
      <input type="checkbox" defaultChecked={defaultChecked} />
      <span className="cyber-btn-content">{label}</span>
      <span className="cyber-btn-glow"></span>
    </label>
  );
}

export default function CatalogSidebar({ open, onClose }) {
  const defaultChecked = useMemo(() => {
    const set = new Set();
    filterGroups.forEach(group => {
      group.options?.forEach((opt, i) => {
        const key = `${group.title}-${opt.label ?? opt}-${i}`;
        if (opt.defaultChecked) set.add(key);
      });
    });
    return set;
  }, []);

  const [checkedCount, setCheckedCount] = useState(() => {
    let count = 0;
    filterGroups.forEach(g => g.options?.forEach(o => { if (o.defaultChecked) count += 1; }));
    return count;
  });

  useEffect(() => {
    const sidebar = document.getElementById('catalogSidebar');
    if (!sidebar) return undefined;

    const inputs = sidebar.querySelectorAll('input[type="checkbox"]');
    const onChange = () => {
      setCheckedCount(sidebar.querySelectorAll('input[type="checkbox"]:checked').length);
    };
    inputs.forEach(input => input.addEventListener('change', onChange));
    return () => inputs.forEach(input => input.removeEventListener('change', onChange));
  }, [open]);

  const resetFilters = () => {
    const sidebar = document.getElementById('catalogSidebar');
    if (!sidebar) return;
    
    sidebar.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.checked = false;
    });
    
    filterGroups.forEach(group => {
      if (!group.options) return;
      const groupEl = [...sidebar.querySelectorAll('.cyber-group')].find(
        el => el.querySelector('.cyber-group-title')?.textContent === group.title,
      );
      if (!groupEl) return;
      const boxes = groupEl.querySelectorAll('input[type="checkbox"]');
      group.options.forEach((opt, i) => {
        if (boxes[i]) boxes[i].checked = Boolean(opt.defaultChecked);
      });
    });
    sidebar.querySelectorAll('select').forEach(sel => { sel.selectedIndex = 0; });
    const search = sidebar.querySelector('.filters-search input');
    if (search) search.value = '';
    setCheckedCount(sidebar.querySelectorAll('input[type="checkbox"]:checked').length);
  };

  return (
    <>
      <aside className={`catalog-sidebar${open ? ' catalog-sidebar--open' : ''}`} id="catalogSidebar">
        <div className="catalog-sidebar__header">
          <div className="catalog-sidebar__header-info">
            <h3>ФИЛЬТРЫ</h3>
            <span className="catalog-sidebar__count">{checkedCount === 0 ? '0 Выбрано' : `${checkedCount} Выбрано`}</span>
          </div>
          <button type="button" className="catalog-sidebar__reset" onClick={resetFilters}>Сбросить</button>
          <button type="button" className="catalog-sidebar__close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="filters-search cyber-search">
          <div className="cyber-search-wrapper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="ПОИСК ПО ЖАНРАМ..." />
          </div>
        </div>

        <div className="filters-scroll">
          {filterGroups.map(group => (
            <div key={group.title} className="cyber-group">
              <div className="cyber-group-header">
                <div className="cyber-group-accent"></div>
                <h4 className="cyber-group-title">{group.title}</h4>
              </div>
              
              {group.isYearSelect ? (
                <div className="cyber-group-body cyber-group-body--row">
                  <select className="cyber-select" defaultValue="От">
                    <option>От</option>
                    <option>2020</option>
                    <option>2022</option>
                    <option>2024</option>
                  </select>
                  <select className="cyber-select" defaultValue="До">
                    <option>До</option>
                    <option>2023</option>
                    <option>2024</option>
                    <option>2025</option>
                  </select>
                </div>
              ) : (
                <div className={`cyber-group-body ${group.title === 'Жанры' ? 'cyber-group-body--genres' : 'cyber-group-body--grid'}`}>
                  {group.options?.map((opt) => (
                    <FilterOption
                      key={opt.label}
                      label={opt.label}
                      isGenre={group.title === 'Жанры'}
                      defaultChecked={opt.defaultChecked}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
      <div
        className={`catalog-sidebar-backdrop${open ? ' catalog-sidebar-backdrop--open' : ''}`}
        onClick={onClose}
      />
    </>
  );
}
