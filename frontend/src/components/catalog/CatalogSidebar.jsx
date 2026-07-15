import { useEffect, useMemo, useState } from 'react';
import { filterGroups } from '../../data/mockData';

function FilterOption({ label, withCheck, defaultChecked }) {
  if (withCheck) {
    return (
      <label className="filter-option">
        <input type="checkbox" defaultChecked={defaultChecked} />
        <span className="filter-check" />
        <span>{label}</span>
      </label>
    );
  }
  return (
    <label className="filter-option">
      <input type="checkbox" />
      {label}
    </label>
  );
}
const getGroupIcon = (title) => {
  switch(title.toLowerCase()) {
    case 'тип':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
    case 'статус':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>;
    case 'жанры':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
    case 'год выпуска':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    default:
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
  }
};

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
    sidebar.querySelectorAll('input[type="checkbox"]').forEach((cb, idx) => {
      const group = filterGroups.find(g => g.withCheck);
      cb.checked = false;
    });
    filterGroups.forEach(group => {
      group.options?.forEach((opt, i) => {
        const inputs = [...sidebar.querySelectorAll(`details summary`)];
        // reset by re-checking defaults via DOM
      });
    });
    sidebar.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.checked = false;
    });
    filterGroups.forEach(group => {
      if (!group.options) return;
      const groupEl = [...sidebar.querySelectorAll('.filters-group')].find(
        el => el.querySelector('summary')?.textContent.includes(group.title),
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
          <h3>Фильтры</h3>
          <span className="catalog-sidebar__count">{checkedCount === 0 ? '0 выбрано' : `${checkedCount} выбрано`}</span>
          <button type="button" className="catalog-sidebar__reset" onClick={resetFilters}>Сбросить</button>
          <button type="button" className="catalog-sidebar__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="filters-search">
          <svg className="filters-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Поиск по жанрам и тегам..." />
        </div>

        <div className="filters-scroll">
          {filterGroups.map(group => (
            <details key={group.title} className="filters-group" open={group.open}>
              <summary>
                <div className="summary-title">
                  {getGroupIcon(group.title)}
                  <span>{group.title}</span>
                </div>
              </summary>
              {group.isYearSelect ? (
                <div className="filters-group__body filters-group__body--row">
                  <select className="filter-select filter-select--sm" defaultValue="От">
                    <option>От</option>
                    <option>2020</option>
                    <option>2022</option>
                    <option>2024</option>
                  </select>
                  <select className="filter-select filter-select--sm" defaultValue="До">
                    <option>До</option>
                    <option>2023</option>
                    <option>2024</option>
                    <option>2025</option>
                  </select>
                </div>
              ) : (
                <div className="filters-group__body">
                  {group.options?.map((opt) => (
                    <FilterOption
                      key={opt.label}
                      label={opt.label}
                      withCheck={group.withCheck}
                      defaultChecked={opt.defaultChecked}
                    />
                  ))}
                </div>
              )}
            </details>
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
