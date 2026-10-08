// Lógica Principal Refactorizada (Ultra Premium)
const $ = (s, r=document) => r.querySelector(s), esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
let RM = motionQuery.matches;
motionQuery.addEventListener?.('change', e => { RM = e.matches; });
let seed = 7; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;

const TEN = {t101: 'Panadería La Espiga', t102: 'Horno Dorado'};
const PR = [
  ['Baguette tradicional', 6.5, 300, [0.25, 0, 0]], 
  ['Pan dulce surtido', 4.2, 400, [0.08, 0.02, 0.015]], 
  ['Croissant', 9, 150, [0.07, 0.01, 0.04]], 
  ['Pan de caja', 22, 80, [0.5, 0.03, 0.02]]
];
const CL = ['Café Central', 'Hotel Miramar', 'Tienda La Esquina', 'Cafetería Norte'];
const EST = ['Recibido', 'Horneando', 'Listo'];
const NAV = [['pedidos','Pedidos','pedidos'], ['prod','Producción','prod'], ['rep','Reportes','rep'], ['cat','Catálogo','cat']];
const FE = [['hoy','hoy'], ['manana','mañana']];
const DB = {productos:[], clientes:[], pedidos:[], detalle:[]};
let uid = 1;

Object.keys(TEN).forEach(t => {
  PR.forEach(p => DB.productos.push({id:'p'+uid++, tenant_id:t, nombre:p[0], unidad:'pza', costo:p[1], cap:p[2], rec:p[3]}));
  CL.forEach(c => DB.clientes.push({id:'c'+uid++, tenant_id:t, nombre:c}));
  const ps = DB.productos.filter(p => p.tenant_id === t), cs = DB.clientes.filter(c => c.tenant_id === t);
  for(let n=0; n<6; n++){
    const pid = 'o'+uid++;
    DB.pedidos.push({id:pid, tenant_id:t, cliente_id:cs[n%4].id, estado:EST[n%3], fecha:n<4?'manana':'hoy'});
    ps.filter((p,i) => i===n%4 || rnd()>0.5).forEach(p => DB.detalle.push({id:'d'+uid++, pedido_id:pid, producto_id:p.id, cantidad:Math.round((20+rnd()*60)/5)*5}));
  }
});

const S = {tenant: null, role: null, view: 'pedidos', fecha: 'manana', pick: 't101', rol: 'Administrador', query: '', orderDate: 'todos', checked: new Set()};
const isAdmin = () => S.role === 'Administrador';
const mine = k => DB[k].filter(r => r.tenant_id === S.tenant);
const prodMap = () => Object.fromEntries(mine('productos').map(p => [p.id, p]));
const items = pid => DB.detalle.filter(d => d.pedido_id === pid);
const money = n => '$' + n.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2});

function totals(f, all) {
  const ids = new Set(mine('pedidos').filter(p => p.fecha === f && (all || p.estado !== 'Listo')).map(p => p.id)), m = {};
  DB.detalle.forEach(d => { if(ids.has(d.pedido_id)) m[d.producto_id] = (m[d.producto_id] || 0) + d.cantidad });
  return m;
}

const STORE_KEY = 'la-libreta:demo:v2';
const cleanText = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const checklistKey = id => `${S.tenant}|${S.fecha}|${id}`;

function restoreSavedData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (!saved || saved.version !== 1) return;

    const tenantByClient = new Map(DB.clientes.map(row => [row.id, row.tenant_id]));
    const tenantByProduct = new Map(DB.productos.map(row => [row.id, row.tenant_id]));
    if (Array.isArray(saved.orders) && Array.isArray(saved.details)) {
      const seenOrders = new Set();
      DB.pedidos = saved.orders.filter(row => {
        if (!row || !/^o\d+$/.test(row.id) || seenOrders.has(row.id)) return false;
        if (!Object.hasOwn(TEN, row.tenant_id) || tenantByClient.get(row.cliente_id) !== row.tenant_id) return false;
        if (!EST.includes(row.estado) || !['hoy', 'manana'].includes(row.fecha)) return false;
        seenOrders.add(row.id);
        return true;
      }).slice(0, 2000);
      const orderById = new Map(DB.pedidos.map(row => [row.id, row]));
      const seenDetails = new Set();
      DB.detalle = saved.details.filter(row => {
        const order = row && orderById.get(row.pedido_id);
        if (!row || !/^d\d+$/.test(row.id) || seenDetails.has(row.id) || !order) return false;
        if (tenantByProduct.get(row.producto_id) !== order.tenant_id) return false;
        if (!Number.isSafeInteger(row.cantidad) || row.cantidad < 1) return false;
        seenDetails.add(row.id);
        return true;
      }).slice(0, 10000);
      const suffixes = [...DB.pedidos.map(row => row.id), ...DB.detalle.map(row => row.id)].map(id => Number(id.slice(1)) + 1);
      uid = Math.max(uid, ...suffixes);
    }

    if (Array.isArray(saved.checks)) {
      const validTenants = new Set(Object.keys(TEN));
      const tenantByProduct = new Map(DB.productos.map(row => [row.id, row.tenant_id]));
      S.checked = new Set(saved.checks.filter(key => {
        const parts = String(key).split('|');
        if (parts.length !== 3) return false;
        const [tenant, date, product] = parts;
        return validTenants.has(tenant) && ['hoy', 'manana'].includes(date) && tenantByProduct.get(product) === tenant;
      }).slice(0, 1000));
    }
    if (saved.theme === 'light' || saved.theme === 'dark') document.documentElement.dataset.theme = saved.theme;
  } catch (_) { }
}

function persistSavedData() {
  try {
    const theme = document.documentElement.dataset.theme;
    localStorage.setItem(STORE_KEY, JSON.stringify({
      version: 1, orders: DB.pedidos, details: DB.detalle, checks: [...S.checked],
      theme: theme === 'light' || theme === 'dark' ? theme : 'light'
    }));
  } catch (_) { }
}

restoreSavedData();

// --- UI Sistema Premium ---

function toast(m, bad) {
  const c = $('#toaster'); const t = document.createElement('div');
  t.className = 'toast ' + (bad ? 'error' : '');
  t.innerHTML = `<svg><use href="#i-${bad ? 'close' : 'check'}"></use></svg>${esc(m)}`;
  c.prepend(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(-16px) scale(0.9)'; setTimeout(() => t.remove(), 300) }, 3000);
}

// Counter Spring Animation
const count = r => r.querySelectorAll('[data-n]').forEach(el => {
  const to = +el.dataset.n, d = +(el.dataset.d||0), t0 = performance.now();
  if(RM) { el.textContent = to.toFixed(d); return; }
  const f = t => { 
    // Spring-like ease out
    const k = Math.min(1, (t-t0)/1200); 
    const ease = 1 - Math.pow(1 - k, 4);
    el.textContent = (to*ease).toFixed(d); 
    if(k<1) requestAnimationFrame(f); 
  };
  requestAnimationFrame(f);
});

const post = r => {
  count(r);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    r.querySelectorAll('[data-w]').forEach(e => e.style.width = e.dataset.w + '%');
  }));
};

const paint = h => {
  const m = $('#main-view');
  m.innerHTML = h;
  m.classList.remove('view-enter'); void m.offsetWidth; m.classList.add('view-enter');
  post(m);
  if (S.view === 'pedidos') applyOrderFilters(true); // true para inicializar
};

// Smooth Filter Hiding
function applyOrderFilters(isInitial = false) {
  const query = cleanText(S.query);
  let visibleTotal = 0;
  
  document.querySelectorAll('.k-col').forEach(col => {
    let visible = 0;
    const cards = [...col.querySelectorAll('.order-card')];
    
    cards.forEach(card => {
      const matches = (!query || cleanText(card.dataset.search || '').includes(query)) &&
        (S.orderDate === 'todos' || card.dataset.date === S.orderDate);
      
      if (matches) {
        if(!isInitial) {
          card.classList.remove('hidden-card');
        } else {
          card.classList.remove('hidden-card');
        }
        visible++;
      } else {
        if(!isInitial) {
          card.classList.add('hidden-card');
        } else {
          card.classList.add('hidden-card');
        }
      }
    });
    
    visibleTotal += visible;
    const countEl = col.querySelector('.k-count');
    if (countEl) countEl.textContent = visible;
    const empty = col.querySelector('.filter-empty');
    if (empty) {
      if(cards.length === 0 || visible > 0) {
        empty.style.display = 'none';
      } else {
        empty.style.display = 'block';
      }
    }
  });
  
  const result = $('#filter-result');
  if (result) result.textContent = query || S.orderDate !== 'todos' ? `${visibleTotal} ${visibleTotal === 1 ? 'pedido' : 'pedidos'}` : '';
}

const seg = (id, o, c) => `<div class="segment" id="${id}" style="--idx:${o.findIndex(a=>a[0]===c)}" role="radiogroup" aria-label="${id === 'rol' ? 'perfil' : 'fecha'}" aria-orientation="horizontal">
  ${o.map(([v, l]) => `<button type="button" role="radio" aria-checked="${v===c}" tabindex="${v===c?0:-1}" class="seg-btn ${v===c?'on':''}" data-sg="${v}">${l}</button>`).join('')}<div class="seg-ind"></div>
</div>`;

// --- VISTAS ---

function vPed(pop) {
  const P = mine('pedidos'), cm = Object.fromEntries(mine('clientes').map(c => [c.id, c.nombre])), pm = prodMap();
  const themes = ['recv', 'bake', 'done'];
  const col = (e, i) => {
    const L = P.filter(p => p.estado === e);
    return `<section class="k-col">
      <div class="k-col-head">
        <h3><span class="dot bg-${themes[i]}"></span> ${e.toLowerCase()}</h3>
        <span class="k-count">${L.length}</span>
      </div>
      ${L.map((p, j) => {
        const it = items(p.id), tot = it.reduce((a,d) => a+d.cantidad, 0);
        const client = cm[p.cliente_id] || 'cliente';
        const searchText = cleanText([
          client,
          p.id,
          `ped-${p.id.slice(1)}`,
          ...it.map(d => pm[d.producto_id]?.nombre || '')
        ]).join(' ');

        return `<article class="card order-card stagger ${pop===p.id?'new':''}" data-search="${esc(searchText)}" data-date="${p.fecha}" style="--i:${j}">
          <div class="oc-top">
            <div><h4 title="${esc(client.toLowerCase())}">${esc(client.toLowerCase())}</h4><span class="oc-id">PED-${p.id.replace('o','')}</span></div>
            <span class="badge bg-${themes[i]} theme-${themes[i]}">${e.toLowerCase()}</span>
          </div>
          <div class="oc-items">
            ${it.map(d => `<div class="oc-item"><span>${d.cantidad}×</span><b>${esc(pm[d.producto_id].nombre.toLowerCase())}</b></div>`).join('')}
          </div>
          <div class="oc-bot">
            <span class="oc-date"><svg><use href="#i-clock"></use></svg>${p.fecha==='hoy'?'hoy':'mañana'} • ${tot} pz</span>
            ${e!=='Listo' ? `<button class="oc-action bg-${themes[i+1]} theme-${themes[i+1]}" data-a="${p.id}">${e==='Recibido'?'hornear':'terminar'} →</button>` : `<svg class="theme-done" style="width:22px;height:22px"><use href="#i-check"></use></svg>`}
          </div>
        </article>`;
      }).join('') || `<div class="empty-state"><svg><use href="#i-pedidos"></use></svg><p>Sin pedidos pendientes</p></div>`}
      <div class="filter-empty" style="display:none">Filtro sin resultados.</div>
    </section>`;
  };
  return `
    <header class="header-row stagger" style="--i:0">
      <div><p class="eyebrow">La Libreta / Pedidos</p><h2>Lo que sale del horno</h2><p>Control del piso de producción en tiempo real.</p></div>
      <button type="button" class="btn-primary" id="new"><svg><use href="#i-plus"></use></svg>Nuevo pedido</button>
    </header>
    <div class="board-controls stagger" style="--i:1">
      <label class="search-field"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="m16 16 4 4"></path></svg><input id="order-search" type="search" value="${esc(S.query)}" placeholder="Busca pedido, cliente o pan" autocomplete="off" aria-label="Buscar pedidos"></label>
      <label class="filter-field"><span>Entrega</span><select id="order-date" aria-label="Filtrar por fecha de entrega">
        <option value="todos" ${S.orderDate==='todos'?'selected':''}>Todas las fechas</option>
        <option value="hoy" ${S.orderDate==='hoy'?'selected':''}>Hoy</option>
        <option value="manana" ${S.orderDate==='manana'?'selected':''}>Mañana</option>
      </select></label>
      <span class="filter-result" id="filter-result" aria-live="polite"></span>
    </div>
    <div class="jornada stagger" style="--i:2">
      <span><b>${P.filter(p => p.estado !== 'Listo').length}</b> por preparar</span>
      <span><b class="theme-bake">${P.filter(p => p.estado === 'Horneando').length}</b> en el horno</span>
      <span><b class="theme-done">${P.filter(p => p.estado === 'Listo').length}</b> listos para salir</span>
    </div>
    <div class="kanban">${EST.map(col).join('')}</div>
  `;
}

function pdata() {
  const t = totals(S.fecha), pm = prodMap(), ids = Object.keys(t);
  const totalPed = new Set(mine('pedidos').filter(p => p.fecha === S.fecha && p.estado !== 'Listo').map(p=>p.id)).size;
  const enBake = mine('pedidos').filter(p => p.fecha === S.fecha && p.estado === 'Horneando').length;
  
  let h = `<section class="dash-grid stagger" style="--i:1">
    <div class="card metric-card">
      <span>Por Preparar</span><strong data-n="${totalPed}">0</strong>
      ${enBake > 0 ? `<div class="badge bg-bake theme-bake" style="width:fit-content;margin-top:12px"><span class="dot bg-bake theme-bake" style="background:currentColor"></span>${enBake} en horno</div>` : ''}
    </div>
  `;
  const ins = [['Harina',0],['Azúcar',1],['Mantequilla',2]].map(([n,k]) => [n, ids.reduce((a,id) => a+t[id]*pm[id].rec[k], 0)]);
  if(isAdmin()){
    const c = ids.reduce((a,id) => a+t[id]*pm[id].costo, 0);
    h += `<div class="card metric-card"><span>Inversión Estimada</span><strong>${money(c).split('.')[0]}</strong></div>`;
  }
  h += `</section>`;

  h += `<h3 class="stagger" style="--i:2; margin-top:24px">Ocupación del Horno</h3><div class="prod-list">`;
  if(!ids.length) h += `<div class="empty-state stagger" style="--i:3"><svg><use href="#i-prod"></use></svg><p>Jornada despejada.</p></div>`;
  
  h += ids.map((id, i) => {
    const p = pm[id], pc = Math.min(100, t[id]/p.cap*100);
    const cls = pc > 90 ? 'critical' : pc > 70 ? 'warning' : '';
    return `<article class="card prod-item stagger" style="--i:${i+3}">
      <div class="prod-info">
        <div><h4>${esc(p.nombre.toLowerCase())}</h4><small>${pc.toFixed(0)}% de carga operativa</small></div>
        <div class="prod-nums"><b data-n="${t[id]}">0</b> <small>${p.unidad}</small></div>
      </div>
      <div class="progress-bg" role="progressbar" aria-valuenow="${pc.toFixed(0)}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar ${cls}" data-w="${pc.toFixed(0)}"></div></div>
    </article>`;
  }).join('');
  
  h += `</div><h3 class="stagger" style="--i:6; margin-top:32px">Materia Prima Requerida</h3><div class="dash-grid">`;
  h += ins.map(([n,v], i) => `<div class="card metric-card stagger" style="--i:${i+7}"><span>${n}</span><strong><span data-n="${v.toFixed(1)}" data-d="1">0</span> <small style="font-size:20px; font-weight:600">kg</small></strong></div>`).join('') + `</div>`;
  return h;
}

const vProd = () => `
  <header class="header-row stagger" style="--i:0">
    <div><p class="eyebrow">La Libreta / Producción</p><h2>Manos a la masa</h2><p>Métricas operativas y requerimientos de la jornada.</p></div>
    ${seg('sf', FE, S.fecha)}
  </header>
  <div id="pd">${pdata()}</div>
`;

function rdata() {
  const t = totals(S.fecha), pm = prodMap(), ids = Object.keys(t);
  let h = ids.map((id, i) => `
    <label class="card chk-item stagger ${S.checked.has(checklistKey(id)) ? 'checked' : ''}" style="--i:${i+2}">
      <input type="checkbox" data-check="${esc(checklistKey(id))}" aria-label="Marcar ${esc(pm[id].nombre)}" ${S.checked.has(checklistKey(id)) ? 'checked' : ''}>
      <div class="chk-box"><svg><use href="#i-check"></use></svg></div>
      <div class="chk-info"><b>${esc(pm[id].nombre.toLowerCase())}</b>${isAdmin() ? `<small>Costo unitario: ${money(pm[id].costo)}</small>` : ''}</div>
      <div class="chk-val">${t[id]} <small style="font-weight:600">${pm[id].unidad}</small></div>
    </label>
  `).join('') || `<div class="empty-state stagger" style="--i:2"><svg><use href="#i-rep"></use></svg><p>Jornada auditada.</p></div>`;
  return h + '<div id="csv"></div>';
}

const vRep = () => `
  <header class="header-row stagger" style="--i:0">
    <div><p class="eyebrow">La Libreta / Reportes</p><h2>Auditoría de piso</h2><p>Checklist para revisión final y exportación de datos.</p></div>
    <div style="display:flex;gap:16px;align-items:center">
      ${seg('sf', FE, S.fecha)}
      <button class="btn-secondary btn-sm" id="csvb"><svg><use href="#i-rep"></use></svg> Generar CSV</button>
    </div>
  </header>
  <div class="chk-list" id="pd">${rdata()}</div>
`;

function csv() {
  const t = totals(S.fecha), pm = prodMap(), a = isAdmin();
  const cell = value => {
    let text = String(value);
    if (/^[\s\u0000-\u001f]*[=+@\-]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return [
    ['fecha','producto','unidad','cantidad',...(a ? ['costo_total'] : [])],
    ...Object.keys(t).map(id => [S.fecha, pm[id].nombre, pm[id].unidad, t[id], ...(a ? [(t[id]*pm[id].costo).toFixed(2)] : [])])
  ].map(row => row.map(cell).join(',')).join('\r\n');
}

const vCat = () => `
  <header class="header-row stagger" style="--i:0">
    <div><p class="eyebrow">La Libreta / Configuración</p><h2>Catálogo Maestro</h2><p>Parámetros base del sistema SaaS.</p></div>
    <span class="badge admin"><svg style="width:14px;height:14px"><use href="#i-user"></use></svg>Administración</span>
  </header>
  <div class="dash-grid">
    ${mine('productos').map((p, i) => `
      <article class="card metric-card stagger" style="--i:${i+1}">
        <h4 style="margin-bottom:16px">${esc(p.nombre.toLowerCase())}</h4>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:12px"><small>Costo Base</small><b style="font-size:16px">${money(p.costo)}</b></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:20px"><small>Capacidad Diaria</small><b style="font-size:16px">${p.cap}</b></div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span class="badge">Harina: ${p.rec[0]}</span><span class="badge">Azúcar: ${p.rec[1]}</span><span class="badge">Mant: ${p.rec[2]}</span>
        </div>
      </article>
    `).join('')}
  </div>
`;

// Navegación
function go(v) {
  if(v === 'cat' && !isAdmin()) return toast('Configuración requiere permisos de administrador', 1);
  S.view = v;
  document.querySelectorAll('.nav-btn').forEach(b => {
    const isActive = b.dataset.v === v;
    b.classList.toggle('on', isActive);
    b.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
  document.querySelectorAll('.nav-bottom').forEach(nav => {
    const activeIndex = [...nav.querySelectorAll('.nav-btn')].findIndex(b => b.dataset.v === v);
    if (activeIndex >= 0) nav.style.setProperty('--idx', activeIndex);
  });
  paint({pedidos: vPed, prod: vProd, rep: vRep, cat: vCat}[v]());
}

const marca = () => `<span class="marca"><svg aria-hidden="true"><use href="#i-espiga"></use></svg>La Libreta</span>`;

function syncThemeControls() {
  const dark = document.documentElement.dataset.theme === 'dark';
  document.querySelectorAll('[data-action="tema"]').forEach(button => {
    const label = dark ? 'Activar tema claro' : 'Activar tema oscuro';
    button.setAttribute('aria-label', label);
    const icon = button.querySelector('use');
    if (icon) icon.setAttribute('href', dark ? '#i-sun' : '#i-moon');
  });
}

function shell() {
  const enlaces = () => NAV.map(([k, l, i]) => `
    <button class="nav-btn ${k === 'cat' && !isAdmin() ? 'lock' : ''}" data-v="${k}">
      <svg aria-hidden="true"><use href="#i-${i}"></use></svg>${l}
    </button>`).join('');

  $('#app').innerHTML = `
    <aside class="sidebar" aria-label="Navegación principal">
      <div class="sidebar-brand">
        ${marca()}
        <p>${esc(TEN[S.tenant])}</p>
        <small>${S.role}</small>
      </div>
      <nav class="nav-bottom">${enlaces()}</nav>
      <div class="sidebar-bottom">
        <button class="btn-ghost" data-action="tema"><svg aria-hidden="true"><use href="#i-moon"></use></svg>Tema Visual</button>
        <button class="btn-ghost" data-action="salir" style="color:var(--th-crit)"><svg aria-hidden="true"><use href="#i-out"></use></svg>Cerrar Sesión</button>
        <p class="sidebar-note">Harina, agua y tiempo.</p>
      </div>
    </aside>
    <header class="topbar">
      <div><b>${esc(TEN[S.tenant])}</b><small>La Libreta / ${S.role}</small></div>
      <div class="topbar-actions">
        <button data-action="tema" aria-label="Cambiar tema"><svg><use href="#i-moon"></use></svg></button>
        <button data-action="salir" aria-label="Salir" style="color:var(--th-crit)"><svg><use href="#i-out"></use></svg></button>
      </div>
    </header>
    <main class="main-content" id="main-view"></main>
    <nav class="nav-bottom mobile-only" aria-label="Navegación móvil">${enlaces()}</nav>
  `;
  syncThemeControls();
  go(S.view);
}

function login() {
  $('#app').innerHTML = `
    <div class="login-wrap">
      <header class="login-top">${marca()}<span>Operativa SaaS B2B</span></header>
      <main class="login-content">
        <section class="login-story">
          <span class="eyebrow">Sistemas de Alto Rendimiento</span>
          <h1>El pan de<br>cada <em>día.</em></h1>
          <svg class="pan-dibujo" viewBox="0 0 420 190" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M16 169c98-5 221-6 389-2" opacity=".35"/>
            <path d="M29 131c-7-11-3-24 9-36C79 57 153 22 216 18c21-1 37 6 36 20-1 19-37 45-81 66-49 24-122 44-142 27Z"/>
            <path d="M36 128C74 110 180 74 244 31M45 110c7 3 14 5 22 5m-3-22c8 3 17 3 24 2m-6-23c7 4 17 4 25 2m-3-21c8 3 16 3 23 1m1-16c7 3 14 3 20 2" opacity=".45"/>
            <path d="M83 78c-4 9-2 16 5 20m20-35c-4 9-1 16 6 20m20-35c-3 9 0 16 7 20m18-32c-2 8 1 14 8 18m15-26c-1 7 2 12 9 15"/>
            <path d="M199 136c-6-28 7-60 35-73 28-14 70-10 95 9 23 17 36 47 27 73-5 14-23 21-72 22-52 1-81-8-85-31Z"/>
            <path d="M202 137c37 16 112 18 151 5M215 97c19-15 30-19 43-19m-33 42c21-20 43-28 65-31m-34 43c17-17 34-27 54-30"/>
            <path d="m224 144 2 1m19 6 3 1m32 3 2 0m30-5 2-1m23-12 2-1m-121-20 1-2m101-36 1 2m-21-14 2 1m-79 28 2-1m-6 12 1-1m-155-9 2-1m35-16 2-1m51-25 2-1m37-16 2 0" opacity=".6"/>
            <path d="M363 134c6-28 12-44 28-67m-15 39c-12-5-15-14-14-20 12 2 17 9 14 20Zm7-16c2-13 8-18 16-20 1 12-5 19-16 20Zm-14 35c-12-3-16-10-17-17 12 0 18 6 17 17Zm5-16c4-11 11-15 19-15-1 11-8 16-19 15Z"/>
          </svg>
          <p>Plataforma para control de pedidos, métricas de horneado e inventario. Cada cosa en su lugar, a tu ritmo.</p>
        </section>
        <section class="login-box" aria-labelledby="acceso-titulo">
          <span class="eyebrow">01 / Aislamiento de Entorno</span>
          <h2 id="acceso-titulo">Iniciar Sesión</h2>
          <p>Selecciona tu entorno empresarial Multi-Tenant.</p>
          <div class="tenant-list">
            ${Object.entries(TEN).map(([id, n], i) => `
              <button class="tenant-btn ${S.pick === id ? 'on' : ''}" data-t="${id}" aria-pressed="${S.pick === id}">
                <span class="tenant-num">0${i + 1}</span>
                <span><b>${esc(n)}</b><small>Identificador: ${id}</small></span>
                <span class="tenant-mark" aria-hidden="true"></span>
              </button>`).join('')}
          </div>
          <span class="field-label">Nivel de Acceso (RBAC)</span>
          ${seg('rol', [['Administrador', 'Admin'], ['Operador', 'Operativo']], S.rol)}
          <button class="btn-primary login-submit" id="go">Ingresar al Dashboard <span aria-hidden="true">↗</span></button>
          <small class="login-note">Selecciona un perfil para inicializar el demo.</small>
        </section>
      </main>
      <footer class="login-foot"><span>Axiom Digital Studio v2</span><span>Hecho para el trabajo de cada día.</span></footer>
    </div>
  `;
}

// Modal Nuevo Pedido (Mobile Bottom Sheet)
function newOrder() {
  if($('.modal-overlay')) return; // evitar abrir múltiples modales

  const pm = mine('productos'), cl = mine('clientes'), q = {};
  const el = document.createElement('div'); el.className = 'modal-overlay';
  el.innerHTML = `
    <div class="modal-content" role="dialog" aria-modal="true" aria-label="Nuevo pedido" tabindex="-1">
      <div class="modal-handle"></div>
      <div class="modal-head-row">
        <h2>Crear Pedido</h2>
        <button class="modal-close-btn" id="cx" aria-label="Cerrar pedido"><svg><use href="#i-close"></use></svg></button>
      </div>
      <div class="form-group">
        <label for="fc">Cliente / Destino</label>
        <select id="fc">${cl.map(c => `<option value="${c.id}">${esc(c.nombre)}</option>`).join('')}</select>
      </div>
      <div class="form-group" style="margin-bottom:32px">
        <label for="ff">Fecha Operativa</label>
        <select id="ff"><option value="manana">Mañana (Planificado)</option><option value="hoy">Hoy (Urgente)</option></select>
      </div>
      <div class="form-group"><label>Líneas de Producción</label>
        ${pm.map(p => `
          <div class="qty-row">
            <b>${esc(p.nombre)}</b>
            <div class="qty-ctrl">
              <button data-s="-10" data-p="${p.id}" aria-label="Restar 10">−</button>
              <span id="q${p.id}">0</span>
              <button data-s="10" data-p="${p.id}" aria-label="Sumar 10">+</button>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="display:flex; justify-content:flex-end; gap:16px; margin-top:40px">
        <button class="btn-primary w-full md:w-auto" id="ok"><svg><use href="#i-check"></use></svg>Registrar en sistema</button>
      </div>
    </div>
  `;
  const anterior = document.activeElement;
  document.body.append(el);
  document.body.classList.add('modal-open');
  // Trap Focus timeout to avoid breaking animations
  setTimeout(() => {
    if(!closing) el.querySelector('select')?.focus();
  }, 50);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  
  let closing = false;
  const close = () => {
    if (closing) return;
    closing = true;
    el.classList.remove('open');
    document.body.classList.remove('modal-open');
    setTimeout(() => el.remove(), 400);
    if(anterior && anterior.isConnected && typeof anterior.focus === 'function') anterior.focus();
  };
  
  el.addEventListener('keydown', e => {
    if(e.key === 'Escape') close();
    if(e.key !== 'Tab') return;
    const campos = [...el.querySelectorAll('button, select')];
    const primero = campos[0], ultimo = campos[campos.length - 1];
    if(e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if(!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
  
  el.onclick = e => {
    if(closing) return;

    if(e.target === el) return close();
    const b = e.target.closest('button'); if(!b) return;
    if(b.dataset.s) {
      const id = b.dataset.p; q[id] = Math.max(0, (q[id]||0) + +b.dataset.s);
      const n = $('#q'+id, el); n.textContent = q[id];
      n.style.transform = 'scale(1.3) translateY(-2px)'; n.style.color = 'var(--brand)';
      setTimeout(() => { n.style.transform = 'none'; n.style.color = '';}, 200);
    } else if(b.id === 'cx') close();
    else if(b.id === 'ok') {
      const f = $('#ff', el).value, ex = Object.entries(q).filter(([,n]) => n>0);
      if(!ex.length) return toast('Ingresa cantidad para al menos un producto', 1);
      
      const cur = totals(f, true), over = ex.find(([id, n]) => (cur[id]||0)+n > pm.find(p=>p.id===id).cap);
      if(over) {
        const p = pm.find(p=>p.id===over[0]);
        return toast(`${p.nombre} supera capacidad diaria.`, 1);
      }
      
      const pid = 'o'+uid++;
      DB.pedidos.unshift({id:pid, tenant_id:S.tenant, cliente_id:$('#fc', el).value, estado:'Recibido', fecha:f});
      ex.forEach(([id, n]) => {
        DB.detalle.push({
          id: 'd' + uid++,
          pedido_id: pid,
          producto_id: id,
          cantidad: n
        });

        S.checked.delete(`${S.tenant}|${f}|${id}`);
      });

      persistSavedData();
      close(); toast('Pedido capturado'); paint(vPed(pid));
    }
  };
}

// Delegación de Eventos Principal
$('#app').addEventListener('click', async e => {
  const b = e.target.closest('button, .chk-item'); if(!b) return; const d = b.dataset;
  if(d.sg) {
    const s = b.closest('.segment');
    s.querySelectorAll('.seg-btn').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); x.tabIndex = x === b ? 0 : -1; });
    s.style.setProperty('--idx', [...s.querySelectorAll('.seg-btn')].indexOf(b));
    if(s.id === 'rol') S.rol = d.sg; 
    else { S.fecha = d.sg; $('#pd').innerHTML = S.view === 'prod' ? pdata() : rdata(); post($('#main-view')); }
  } 
  else if(d.t) { S.pick = d.t; document.querySelectorAll('.tenant-btn').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); }
  else if(b.id === 'go') { S.tenant = S.pick; S.role = S.rol; S.view = 'pedidos'; shell(); }
  else if(d.v) go(d.v);
  
  // cambiar estado
  else if(d.a) {
    const pedido = DB.pedidos.find(p => p.id === d.a);
    if(!pedido || b.disabled || pedido.estado === 'Listo') return;

    const estado = pedido.estado;
    const siguiente = EST[EST.indexOf(estado)+1];
    if(!siguiente) return;
    
    b.disabled = true;

    const avanzar = () => {
      if(pedido.estado !== estado) return;

      pedido.estado = siguiente;
      persistSavedData();

      if($('#main-view') && S.tenant === pedido.tenant_id) {
        if(S.view === 'pedidos') paint(vPed(pedido.id));
        else go(S.view);
      }

      toast(siguiente === 'Listo' ? 'pedido listo' : 'al horno');
    };

    const tarjeta = b.closest('.order-card');

    if(tarjeta && !RM) {
      tarjeta.style.opacity = '0';
      tarjeta.style.transform = 'scale(0.95) translateY(10px)';
      tarjeta.style.filter = 'blur(4px)';
      setTimeout(() => avanzar(), 300);
    } else {
      avanzar();
    }
  }

  else if(b.id === 'new') newOrder();
  else if(b.id === 'csvb') {
    const c = $('#csv');
    c.innerHTML = c.innerHTML ? '' : `<div class="card stagger csv-card" style="--i:0; margin-top:24px;"><pre>${esc(csv())}</pre><div class="csv-actions"><button class="btn-secondary btn-sm" id="cpy">Copiar Datos</button><button class="btn-primary btn-sm" id="csv-download">Descargar CSV</button></div></div>`;
  }
  else if(b.id === 'cpy') {
    try {
      if (navigator.clipboard?.writeText) {
        try { await navigator.clipboard.writeText(csv()); toast('Datos copiados al portapapeles'); return; } catch (_) { }
      }
      {
        const area = document.createElement('textarea'); area.value = csv(); area.style.position = 'fixed'; area.style.opacity = '0';
        document.body.append(area); area.select(); const copied = document.execCommand('copy'); area.remove();
        if (!copied) throw new Error('copy unavailable');
      }
      toast('Datos copiados al portapapeles');
    } catch(_) { toast('Error al copiar', 1); }
  }
  else if(b.id === 'csv-download') {
    const blob = new Blob(['\uFEFF', csv()], {type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = `reporte_operativo_${S.fecha}.csv`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Descarga iniciada');
  }
  else if(d.action === 'tema') {
    const r = document.documentElement;
    const isDark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    r.dataset.theme = isDark ? 'light' : 'dark';
    syncThemeControls();
    persistSavedData();
  }
  else if(d.action === 'salir') login();
});

// Búsqueda Debounce / Animada
let searchTimeout;
$('#app').addEventListener('input', e => {
  if (e.target.id === 'order-search') {
    clearTimeout(searchTimeout);
    S.query = e.target.value;
    searchTimeout = setTimeout(() => applyOrderFilters(false), 150); // Small debounce for smooth feeling
  }
});

$('#app').addEventListener('change', e => {
  if (e.target.id === 'order-date') {
    S.orderDate = e.target.value;
    applyOrderFilters(false);
  } else if (e.target.matches('.chk-item input[type="checkbox"]')) {
    const key = e.target.dataset.check;
    if (e.target.checked) S.checked.add(key); else S.checked.delete(key);
    persistSavedData();
  }
});

$('#app').addEventListener('keydown', e => {
  const radio = e.target.closest('.segment [role="radio"]');
  if (!radio || !['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
  const options = [...radio.parentElement.querySelectorAll('[role="radio"]')];
  const current = options.indexOf(radio);
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? options.length - 1 : (current + (e.key === 'ArrowRight' ? 1 : -1) + options.length) % options.length;
  e.preventDefault(); options[next].focus(); options[next].click();
});

login();
