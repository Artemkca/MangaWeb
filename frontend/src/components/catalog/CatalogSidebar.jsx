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
        el => el.querySelector('summary')?.textContent === group.title,
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
          <input type="text" placeholder="Поиск по жанрам и тегам..." />
        </div>

        <div className="filters-scroll">
          {filterGroups.map(group => (
            <details key={group.title} className="filters-group" open={group.open}>
              <summary>{group.title}</summary>
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
