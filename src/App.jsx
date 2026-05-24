import React, { useState, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { INVENTORY_DATA, WEEK_LABELS } from './data';

// ── Pill renderer for AG Grid cells ──────────────────────────
function PillRenderer({ value, colDef }) {
  if (!value) return null;
  const map = {
    'Active':        'pill pill-green',
    'Discontinued':  'pill pill-red',
    'In Stock':      'pill pill-green',
    'Low Stock':     'pill pill-amber',
    'Out of Stock':  'pill pill-red',
    'FOOD':          'pill pill-blue',
    'NON FOOD':      'pill pill-purple',
  };
  return <span className={map[value] || 'pill pill-gray'}>{value}</span>;
}

// ── Mini sparkline for the 4-week trend column ────────────────
function TrendRenderer({ data }) {
  if (!data?.weeks) return null;
  const last4 = data.weeks.slice(-4);
  const max = Math.max(...last4, 1);
  return (
    <div className="trend-wrap">
      {last4.map((v, i) => {
        const h = Math.max(2, Math.round((v / max) * 20));
        const color = v === 0 ? '#dc2626' : v < 10 ? '#d97706' : '#16a34a';
        return <div key={i} className="trend-bar" style={{ height: h, background: color }} />;
      })}
    </div>
  );
}

// ── Stock status value getter ─────────────────────────────────
function getStockStatus(params) {
  const { oh } = params.data;
  if (oh === 0) return 'Out of Stock';
  if (oh < 10)  return 'Low Stock';
  return 'In Stock';
}

// ── Price formatter ───────────────────────────────────────────
function priceFormatter(params) {
  return params.value != null ? `GH₵ ${params.value.toFixed(2)}` : '';
}

// ── OH cell style (red/amber/normal) ─────────────────────────
function ohCellStyle(params) {
  if (params.value === 0)  return { color: '#dc2626', fontWeight: 600 };
  if (params.value < 10)   return { color: '#d97706', fontWeight: 600 };
  return {};
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const gridRef = useRef();
  const [activeTab, setActiveTab] = useState('grid');
  const [search, setSearch]       = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFood, setFilterFood]     = useState('');
  const [filterStock, setFilterStock]   = useState('');
  const [grouped, setGrouped]     = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  // ── Derived data ─────────────────────────────────────────────
  const categories = useMemo(() => [...new Set(INVENTORY_DATA.map(r => r.cat))].sort(), []);
  const vendors    = useMemo(() => [...new Set(INVENTORY_DATA.map(r => r.vendor))].sort(), []);

  const filtered = useMemo(() => {
    return INVENTORY_DATA.filter(r => {
      if (search && ![r.id, r.name, r.vendor, r.cat, r.subcat].join(' ').toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCat    && r.cat    !== filterCat)    return false;
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterFood   && r.food   !== filterFood)   return false;
      if (filterStock === 'oos' && r.oh !== 0)        return false;
      if (filterStock === 'low' && (r.oh === 0 || r.oh >= 10)) return false;
      if (filterStock === 'ok'  && r.oh < 10)         return false;
      return true;
    });
  }, [search, filterCat, filterStatus, filterFood, filterStock]);

  // ── Summary stats ─────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:  INVENTORY_DATA.length,
    active: INVENTORY_DATA.filter(r => r.status === 'Active').length,
    disc:   INVENTORY_DATA.filter(r => r.status === 'Discontinued').length,
    oos:    INVENTORY_DATA.filter(r => r.oh === 0).length,
    low:    INVENTORY_DATA.filter(r => r.oh > 0 && r.oh < 10).length,
    cats:   new Set(INVENTORY_DATA.map(r => r.cat)).size,
  }), []);

  // ── AG Grid column definitions ────────────────────────────────
  const columnDefs = useMemo(() => [
    {
      field: 'id',
      headerName: 'Item ID',
      width: 90,
      pinned: 'left',
      cellStyle: { fontFamily: 'monospace', fontSize: '12px' },
    },
    {
      field: 'name',
      headerName: 'Product description',
      flex: 2,
      minWidth: 220,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'vendor',
      headerName: 'Vendor',
      flex: 1,
      minWidth: 140,
      filter: 'agSetColumnFilter',
    },
    {
      field: 'cat',
      headerName: 'Category',
      width: 160,
      filter: 'agSetColumnFilter',
      rowGroup: grouped,
      hide: grouped,
    },
    {
      field: 'subcat',
      headerName: 'Sub-category',
      width: 150,
      filter: 'agSetColumnFilter',
    },
    {
      field: 'food',
      headerName: 'Type',
      width: 100,
      cellRenderer: PillRenderer,
      filter: 'agSetColumnFilter',
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 110,
      type: 'numericColumn',
      valueFormatter: priceFormatter,
      filter: 'agNumberColumnFilter',
      aggFunc: 'avg',
    },
    {
      field: 'oh',
      headerName: 'On hand',
      width: 95,
      type: 'numericColumn',
      cellStyle: ohCellStyle,
      filter: 'agNumberColumnFilter',
      aggFunc: 'sum',
    },
    {
      field: 'sales',
      headerName: 'Wk sales',
      width: 95,
      type: 'numericColumn',
      filter: 'agNumberColumnFilter',
      aggFunc: 'sum',
    },
    {
      headerName: 'Stock status',
      width: 120,
      valueGetter: getStockStatus,
      cellRenderer: PillRenderer,
      filter: 'agSetColumnFilter',
    },
    {
      headerName: '4-wk trend',
      width: 90,
      cellRenderer: TrendRenderer,
      sortable: false,
      filter: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      cellRenderer: PillRenderer,
      filter: 'agSetColumnFilter',
    },
  ], [grouped]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
  }), []);

  // ── Export to Excel ───────────────────────────────────────────
  const exportExcel = useCallback(() => {
    gridRef.current?.api.exportDataAsExcel({
      fileName: `inventory_export_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Inventory',
    });
  }, []);

  // ── Row click → detail panel ──────────────────────────────────
  const onRowClicked = useCallback((e) => {
    if (!e.data) return;   // ignore group header rows
    setSelectedRow(e.data);
  }, []);

  // ── Detail panel ──────────────────────────────────────────────
  function DetailPanel({ row, onClose }) {
    const max = Math.max(...row.weeks, 1);
    return (
      <div className="detail-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{row.name}</span>
          <button className="btn" onClick={onClose}>✕ Close</button>
        </div>
        <div className="detail-grid">
          <div><div className="detail-field-label">Item ID</div><div className="detail-field-value" style={{ fontFamily: 'monospace' }}>{row.id}</div></div>
          <div><div className="detail-field-label">Vendor</div><div className="detail-field-value">{row.vendor}</div></div>
          <div><div className="detail-field-label">Category</div><div className="detail-field-value">{row.cat}</div></div>
          <div><div className="detail-field-label">Food type</div><div className="detail-field-value">{row.food}</div></div>
          <div><div className="detail-field-label">Sales price</div><div className="detail-field-value">GH₵ {row.price.toFixed(2)}</div></div>
          <div>
            <div className="detail-field-label">On hand</div>
            <div className="detail-field-value" style={{ color: row.oh === 0 ? '#dc2626' : row.oh < 10 ? '#d97706' : '#16a34a' }}>
              {row.oh} units
            </div>
          </div>
        </div>
        <div className="section-heading">17-week sales history</div>
        <div className="week-bars">
          {row.weeks.map((v, i) => {
            const h = Math.max(3, Math.round((v / max) * 48));
            const color = v === 0 ? '#dc2626' : v < 10 ? '#d97706' : '#16a34a';
            return <div key={i} className="week-bar" style={{ height: h, background: color }} />;
          })}
        </div>
        <div className="week-labels">
          {WEEK_LABELS.map(w => <div key={w} className="week-label">{w}</div>)}
        </div>
      </div>
    );
  }

  // ── Vendors tab ───────────────────────────────────────────────
  const vendorStats = useMemo(() => {
    const vm = {};
    INVENTORY_DATA.forEach(r => {
      if (!vm[r.vendor]) vm[r.vendor] = { items: 0, oos: 0, sales: 0 };
      vm[r.vendor].items++;
      if (r.oh === 0) vm[r.vendor].oos++;
      vm[r.vendor].sales += r.sales;
    });
    return Object.entries(vm).sort((a, b) => b[1].sales - a[1].sales);
  }, []);

  // ── Alerts tab ────────────────────────────────────────────────
  const oos = INVENTORY_DATA.filter(r => r.oh === 0 && r.status === 'Active');
  const low = INVENTORY_DATA.filter(r => r.oh > 0 && r.oh < 10 && r.status === 'Active');

  // ── Trends tab (top 6 sellers) ────────────────────────────────
  const topSellers = useMemo(() =>
    [...INVENTORY_DATA].sort((a, b) => b.sales - a.sales).slice(0, 6),
  []);

  return (
    <div className="app-shell">
      {/* ── Top bar ── */}
      <div className="topbar">
        <div className="topbar-left">
          <span style={{ fontSize: 20 }}>🏪</span>
          <span className="topbar-logo">Inventory Management System</span>
        </div>
        <div className="topbar-right">
          <button className="btn btn-primary" onClick={exportExcel}>⬇ Export to Excel</button>
        </div>
      </div>

      {/* ── Nav tabs ── */}
      <div className="nav-tabs">
        {[
          { key: 'grid',    label: '📋 Inventory grid' },
          { key: 'alerts',  label: '⚠️ Stock alerts' },
          { key: 'vendors', label: '🚚 Vendors' },
          { key: 'trends',  label: '📊 Weekly trends' },
        ].map(t => (
          <button
            key={t.key}
            className={`nav-tab${activeTab === t.key ? ' active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="main-content">

        {/* ═══════════ GRID TAB ═══════════ */}
        {activeTab === 'grid' && (
          <>
            {/* Summary cards */}
            <div className="summary-cards">
              <div className="summary-card"><div className="summary-card-label">Total SKUs</div><div className="summary-card-value">{stats.total}</div></div>
              <div className="summary-card"><div className="summary-card-label">Active</div><div className="summary-card-value green">{stats.active}</div></div>
              <div className="summary-card"><div className="summary-card-label">Discontinued</div><div className="summary-card-value red">{stats.disc}</div></div>
              <div className="summary-card"><div className="summary-card-label">Out of stock</div><div className="summary-card-value red">{stats.oos}</div></div>
              <div className="summary-card"><div className="summary-card-label">Low stock</div><div className="summary-card-value amber">{stats.low}</div></div>
              <div className="summary-card"><div className="summary-card-label">Categories</div><div className="summary-card-value">{stats.cats}</div></div>
            </div>

            {/* Toolbar */}
            <div className="toolbar">
              <input
                className="toolbar-input"
                placeholder="🔍  Search product, vendor, brand…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select className="toolbar-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="">All categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="toolbar-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All statuses</option>
                <option value="Active">Active</option>
                <option value="Discontinued">Discontinued</option>
              </select>
              <select className="toolbar-select" value={filterFood} onChange={e => setFilterFood(e.target.value)}>
                <option value="">Food &amp; Non-food</option>
                <option value="FOOD">Food only</option>
                <option value="NON FOOD">Non-food only</option>
              </select>
              <select className="toolbar-select" value={filterStock} onChange={e => setFilterStock(e.target.value)}>
                <option value="">All stock levels</option>
                <option value="oos">Out of stock</option>
                <option value="low">Low stock (&lt;10)</option>
                <option value="ok">In stock</option>
              </select>
              <div className="spacer" />
              <button
                className={`btn${grouped ? ' btn-primary' : ''}`}
                onClick={() => setGrouped(g => !g)}
              >
                ☰ Group by category
              </button>
              <span style={{ fontSize: 12, color: '#78716c' }}>{filtered.length} items</span>
            </div>

            {/* Detail panel */}
            {selectedRow && (
              <DetailPanel row={selectedRow} onClose={() => setSelectedRow(null)} />
            )}

            {/* AG Grid */}
            <div className="grid-container">
              <div className="ag-theme-quartz" style={{ height: 520 }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={filtered}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  rowGroupPanelShow="always"
                  sideBar={true}
                  pagination={true}
                  paginationPageSize={20}
                  rowSelection="multiple"
                  groupDefaultExpanded={1}
                  animateRows={true}
                  onRowClicked={onRowClicked}
                />
              </div>
            </div>
          </>
        )}

        {/* ═══════════ ALERTS TAB ═══════════ */}
        {activeTab === 'alerts' && (
          <>
            <div className="summary-cards" style={{ marginBottom: 20 }}>
              <div className="summary-card"><div className="summary-card-label">Out of stock</div><div className="summary-card-value red">{oos.length}</div></div>
              <div className="summary-card"><div className="summary-card-label">Low stock</div><div className="summary-card-value amber">{low.length}</div></div>
              <div className="summary-card"><div className="summary-card-label">Discontinued</div><div className="summary-card-value">{stats.disc}</div></div>
            </div>

            <div className="section-heading">🔴 Out of stock — reorder now</div>
            {oos.map(r => (
              <div key={r.id} className="alert-item danger">
                <span style={{ fontSize: 18 }}>⛔</span>
                <div>
                  <div className="alert-title">{r.name}</div>
                  <div className="alert-sub">{r.id} · {r.vendor} · Last week sales: {r.sales}</div>
                </div>
              </div>
            ))}

            <div className="section-heading" style={{ marginTop: 20 }}>🟡 Low stock — reorder soon</div>
            {low.map(r => (
              <div key={r.id} className="alert-item warning">
                <span style={{ fontSize: 18 }}>⚠️</span>
                <div>
                  <div className="alert-title">{r.name}</div>
                  <div className="alert-sub">{r.id} · {r.vendor} · On hand: {r.oh} · Last week sales: {r.sales}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ═══════════ VENDORS TAB ═══════════ */}
        {activeTab === 'vendors' && (
          <>
            <div className="section-heading">Top vendors by weekly sales</div>
            <div className="vendor-grid">
              {vendorStats.map(([vendor, d]) => (
                <div key={vendor} className="vendor-card">
                  <div className="vendor-name">{vendor}</div>
                  <div className="vendor-stats">
                    <span>{d.items} SKUs</span>
                    <span>{d.sales} wk sales</span>
                    {d.oos > 0 && <span style={{ color: '#dc2626' }}>{d.oos} OOS</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ═══════════ TRENDS TAB ═══════════ */}
        {activeTab === 'trends' && (
          <>
            <div className="section-heading">Top 6 products — 17-week sales trend</div>
            {topSellers.map(r => {
              const max = Math.max(...r.weeks, 1);
              const trend = r.weeks[r.weeks.length - 1] - r.weeks[0];
              return (
                <div key={r.id} className="trend-card">
                  <div className="trend-card-title">
                    <span>{r.name}</span>
                    <span style={{ fontSize: 12, color: trend >= 0 ? '#16a34a' : '#dc2626' }}>
                      {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)} vs Wk25
                    </span>
                  </div>
                  <div className="week-bars">
                    {r.weeks.map((v, i) => {
                      const h = Math.max(3, Math.round((v / max) * 48));
                      const color = v === 0 ? '#dc2626' : v < 10 ? '#d97706' : '#16a34a';
                      return <div key={i} className="week-bar" style={{ height: h, background: color }} />;
                    })}
                  </div>
                  <div className="week-labels">
                    {WEEK_LABELS.map(w => <div key={w} className="week-label">{w}</div>)}
                  </div>
                </div>
              );
            })}
          </>
        )}

      </div>
    </div>
  );
}
