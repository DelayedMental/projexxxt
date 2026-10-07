// === LÓGICA DE NEGOCIO (INTACTA) ===
const $ = (s, r=document) => r.querySelector(s), esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
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
const FE = [['hoy','Hoy'], ['manana','Mañana']];
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

const S = {tenant: null, role: null, view: 'pedidos', fecha: 'manana', pick: 't101', rol: 'Administrador'};
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

// === UI HELPERS ===
function toast(m, bad) {
  const c = $('#toaster'); const t = document.createElement('div');
  t.className = 'toast ' + (bad ? 'error' : '');
  t.innerHTML = `<svg><use href="#i-${bad ? 'plus' : 'check'}"></use></svg>${esc(m)}`;
  if(bad) t.querySelector('svg').style.transform = 'rotate(45deg)';
  c.prepend(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(-10px)'; setTimeout(() => t.remove(), 300) }, 3000);
}

const count = r => r.querySelectorAll('[data-n]').forEach(el => {
  const to = +el.dataset.n, d = +(el.dataset.d||0), t0 = performance.now();
  if(RM) { el.textContent = to.toFixed(d); return; }
  const f = t => { const k = Math.min(1, (t-t0)/1000); el.textContent = (to*k).toFixed(d); if(k<1) requestAnimationFrame(f); };
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
};

const seg = (id, o, c) => `<div class="segment" id="${id}" style="--idx:${o.findIndex(a=>a[0]===c)}" role="radiogroup">
  ${o.map(([v, l]) => `<button role="radio" aria-checked="${v===c}" class="seg-btn ${v===c?'on':''}" data-sg="${v}">${l}</button>`).join('')}<div class="seg-ind"></div>
</div>`;

// === VISTAS GENERADORAS HTML ===

function vPed(pop) {
  const P = mine('pedidos'), cm = Object.fromEntries(mine('clientes').map(c => [c.id, c.nombre])), pm = prodMap();
  const themes = ['recv', 'bake', 'done'];
  const col = (e, i) => {
    const L = P.filter(p => p.estado === e);
    return `<div class="k-col">
      <div class="k-col-head">
        <h3><span class="dot bg-${themes[i]}"></span> ${e}</h3>
        <span class="k-count">${L.length}</span>
      </div>
      ${L.map((p, j) => {
        const it = items(p.id), tot = it.reduce((a,d) => a+d.cantidad, 0);
        return `<article class="card order-card stagger ${pop===p.id?'new':''}" style="--i:${j}">
          <div class="oc-top">
            <div><h4 title="${esc(cm[p.cliente_id])}">${esc(cm[p.cliente_id])}</h4><span class="oc-id">PED-${p.id.replace('o','')}</span></div>
            <span class="badge bg-${themes[i]} theme-${themes[i]}">${e}</span>
          </div>
          <div class="oc-items">
            ${it.map(d => `<div class="oc-item"><span>${d.cantidad}×</span><b>${esc(pm[d.producto_id].nombre)}</b></div>`).join('')}
          </div>
          <div class="oc-bot">
            <span class="oc-date"><svg><use href="#i-clock"></use></svg>${p.fecha==='hoy'?'Hoy':'Mañana'} • ${tot} pz</span>
            ${e!=='Listo' ? `<button class="oc-action bg-${themes[i+1]} theme-${themes[i+1]}" data-a="${p.id}">${e==='Recibido'?'Hornear':'Terminar'} →</button>` : `<svg class="theme-done" style="width:20px;height:20px"><use href="#i-check"></use></svg>`}
          </div>
        </article>`;
      }).join('') || `<div class="empty-state"><svg><use href="#i-pedidos"></use></svg><p>Sin tareas pendientes</p></div>`}
    </div>`;
  };
  return `
    <header class="header-row stagger" style="--i:0">
      <div><h2>Flujo Operativo</h2><p>Gestión de pedidos por fase</p></div>
      <button class="btn-primary" id="new"><svg style="width:18px;height:18px"><use href="#i-plus"></use></svg>Nuevo Pedido</button>
    </header>
    <div class="kanban">${EST.map(col).join('')}</div>
  `;
}

function pdata() {
  const t = totals(S.fecha), pm = prodMap(), ids = Object.keys(t);
  const totalPed = new Set(mine('pedidos').filter(p => p.fecha === S.fecha && p.estado !== 'Listo').map(p=>p.id)).size;
  const enBake = mine('pedidos').filter(p => p.fecha === S.fecha && p.estado === 'Horneando').length;
  
  let h = `<section class="dash-grid stagger" style="--i:1">
    <div class="card metric-card">
      <span>Pendientes</span><strong data-n="${totalPed}">0</strong>
      ${enBake > 0 ? `<div class="badge bg-bake theme-bake" style="width:fit-content;margin-top:8px"><span class="dot bg-bake theme-bake" style="background:currentColor"></span>${enBake} en horno</div>` : ''}
    </div>
  `;
  const ins = [['Harina',0],['Azúcar',1],['Mantequilla',2]].map(([n,k]) => [n, ids.reduce((a,id) => a+t[id]*pm[id].rec[k], 0)]);
  if(isAdmin()){
    const c = ids.reduce((a,id) => a+t[id]*pm[id].costo, 0);
    h += `<div class="card metric-card"><span>Inversión Diaria</span><strong>${money(c).split('.')[0]}</strong></div>`;
  }
  h += `</section>`;

  h += `<h3 class="stagger" style="--i:2; margin-top:16px">Metas de Producción</h3><div class="prod-list">`;
  if(!ids.length) h += `<div class="empty-state stagger" style="--i:3"><svg><use href="#i-prod"></use></svg><p>Capacidad liberada.</p></div>`;
  
  h += ids.map((id, i) => {
    const p = pm[id], pc = Math.min(100, t[id]/p.cap*100);
    const cls = pc > 90 ? 'critical' : pc > 70 ? 'warning' : '';
    return `<article class="card prod-item stagger" style="--i:${i+3}">
      <div class="prod-info">
        <div><h4>${esc(p.nombre)}</h4><small>${pc.toFixed(0)}% de carga operativa</small></div>
        <div class="prod-nums"><b data-n="${t[id]}">0</b> <small>${p.unidad}</small></div>
      </div>
      <div class="progress-bg" role="progressbar" aria-valuenow="${pc.toFixed(0)}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar ${cls}" data-w="${pc.toFixed(0)}"></div></div>
    </article>`;
  }).join('');
  
  h += `</div><h3 class="stagger" style="--i:6; margin-top:32px">Insumos Calculados</h3><div class="dash-grid">`;
  h += ins.map(([n,v], i) => `<div class="card metric-card stagger" style="--i:${i+7}"><span>${n}</span><strong><span data-n="${v.toFixed(1)}" data-d="1">0</span> <small style="font-size:16px">kg</small></strong></div>`).join('') + `</div>`;
  return h;
}

const vProd = () => `
  <header class="header-row stagger" style="--i:0">
    <div><h2>Dashboard Analítico</h2><p>Métricas de capacidad y materia prima</p></div>
    ${seg('sf', FE, S.fecha)}
  </header>
  <div id="pd">${pdata()}</div>
`;

function rdata() {
  const t = totals(S.fecha), pm = prodMap(), ids = Object.keys(t);
  let h = ids.map((id, i) => `
    <label class="card chk-item stagger" style="--i:${i+2}">
      <input type="checkbox">
      <div class="chk-box"><svg><use href="#i-check"></use></svg></div>
      <div class="chk-info"><b>${esc(pm[id].nombre)}</b>${isAdmin() ? `<small>Costo unitario: ${money(pm[id].costo)}</small>` : ''}</div>
      <div class="chk-val">${t[id]} <small style="font-weight:500">${pm[id].unidad}</small></div>
    </label>
  `).join('') || `<div class="empty-state stagger" style="--i:2"><svg><use href="#i-rep"></use></svg><p>Jornada completada.</p></div>`;
  return h + '<div id="csv"></div>';
}

const vRep = () => `
  <header class="header-row stagger" style="--i:0">
    <div><h2>Reporte de Planta</h2><p>Checklist de salida</p></div>
    <div style="display:flex;gap:12px;align-items:center">
      ${seg('sf', FE, S.fecha)}
      <button class="btn-secondary btn-sm" id="csvb"><svg style="width:16px;height:16px"><use href="#i-rep"></use></svg> CSV</button>
    </div>
  </header>
  <div class="chk-list" id="pd">${rdata()}</div>
`;

function csv() {
  const t = totals(S.fecha), pm = prodMap(), a = isAdmin();
  return ['fecha,producto,unidad,cantidad' + (a ? ',costo_total' : ''), 
    ...Object.keys(t).map(id => [S.fecha, pm[id].nombre, pm[id].unidad, t[id]].concat(a ? [(t[id]*pm[id].costo).toFixed(2)] : []).join(','))
  ].join('\n');
}

const vCat = () => `
  <header class="header-row stagger" style="--i:0">
    <div><h2>Catálogo Maestro</h2><p>Configuración base del sistema</p></div>
    <span class="badge admin"><svg style="width:14px;height:14px"><use href="#i-user"></use></svg>Administrador</span>
  </header>
  <div class="dash-grid">
    ${mine('productos').map((p, i) => `
      <article class="card metric-card stagger" style="--i:${i+1}">
        <h4 style="margin-bottom:12px">${esc(p.nombre)}</h4>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:8px"><small>Costo</small><b style="font-size:16px">${money(p.costo)}</b></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:16px"><small>Capacidad Diaria</small><b style="font-size:16px">${p.cap}</b></div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span class="badge">Harina: ${p.rec[0]}</span><span class="badge">Azúcar: ${p.rec[1]}</span><span class="badge">Mant: ${p.rec[2]}</span>
        </div>
      </article>
    `).join('')}
  </div>
`;

// === ENRUTAMIENTO Y SHELL ===
function go(v) {
  if(v === 'cat' && !isAdmin()) return toast('Acceso restringido a administradores', 1);
  S.view = v;
  document.querySelectorAll('.nav-btn').forEach(b => {
    const isActive = b.dataset.v === v;
    b.classList.toggle('on', isActive);
    b.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
  const navBar = $('.nav-bottom') || $('.sidebar');
  if(navBar) navBar.style.setProperty('--idx', NAV.findIndex(n => n[0] === v));
  paint({pedidos: vPed, prod: vProd, rep: vRep, cat: vCat}[v]());
}

function shell() {
  $('#app').innerHTML = `
    <!-- Desktop Sidebar -->
    <aside class="sidebar" style="display:none" aria-label="Navegación principal">
      <div style="padding-bottom:32px">
        <b style="font-size:18px">${esc(TEN[S.tenant])}</b>
        <div class="badge admin" style="margin-top:8px">${S.role}</div>
      </div>
      <nav class="nav-bottom">
        ${NAV.map(([k, l, i]) => `<button class="nav-btn ${k==='cat'&&!isAdmin()?'lock':''}" data-v="${k}"><svg><use href="#i-${i}"></use></svg>${l}</button>`).join('')}
        <div class="nav-indicator"></div>
      </nav>
      <div style="margin-top:auto;display:flex;flex-direction:column;gap:12px">
        <button class="btn-ghost" id="th"><svg style="width:18px;height:18px"><use href="#i-moon"></use></svg> Tema visual</button>
        <button class="btn-ghost" id="out" style="color:var(--th-crit)"><svg style="width:18px;height:18px"><use href="#i-out"></use></svg> Cerrar sesión</button>
      </div>
    </aside>
    <!-- Mobile Topbar -->
    <header class="topbar">
      <div><b style="display:block">${esc(TEN[S.tenant])}</b><small>${S.role}</small></div>
      <div style="display:flex; gap:12px;">
        <button id="th" aria-label="Cambiar tema"><svg style="width:20px;height:20px"><use href="#i-moon"></use></svg></button>
        <button id="out" aria-label="Salir"><svg style="width:20px;height:20px;color:var(--th-crit)"><use href="#i-out"></use></svg></button>
      </div>
    </header>
    <!-- Main Content Area -->
    <main class="main-content" id="main-view"></main>
    <!-- Mobile Bottom Nav -->
    <nav class="nav-bottom mobile-only" aria-label="Navegación móvil">
      ${NAV.map(([k, l, i]) => `<button class="nav-btn ${k==='cat'&&!isAdmin()?'lock':''}" data-v="${k}"><svg><use href="#i-${i}"></use></svg>${l}</button>`).join('')}
      <div class="nav-indicator"></div>
    </nav>
  `;
  const fixNav = () => {
    const isDesktop = window.innerWidth >= 900;
    const sb = $('.sidebar'); const mn = $('.mobile-only');
    if(sb) sb.style.display = isDesktop ? 'flex' : 'none';
    if(mn) mn.style.display = isDesktop ? 'none' : 'flex';
  };
  window.addEventListener('resize', fixNav); fixNav();
  go(S.view);
}

function login() {
  $('#app').innerHTML = `
    <div class="login-wrap">
      <main class="login-box">
        <svg style="width:48px;height:48px;margin-bottom:16px;color:var(--brand)"><use href="#i-prod"></use></svg>
        <h1 style="margin-bottom:8px">Axiom Bakery</h1>
        <p style="color:var(--ink-mut); margin-bottom:40px">Plataforma operativa SaaS</p>
        <div style="display:grid; gap:12px; margin-bottom:32px">
          ${Object.entries(TEN).map(([id, n]) => `<button class="tenant-btn ${S.pick===id?'on':''}" data-t="${id}"><b style="font-size:16px">${n}</b><small style="color:inherit">Entorno: ${id}</small></button>`).join('')}
        </div>
        ${seg('rol', [['Administrador','Admin'], ['Operador','Operativo']], S.rol)}
        <button class="btn-primary" id="go" style="width:100%; margin-top:24px; padding:14px">Iniciar Entorno</button>
      </main>
    </div>
  `;
}

// === MODAL ENGINE (BOTTOM SHEET) ===
function newOrder() {
  const pm = mine('productos'), cl = mine('clientes'), q = {};
  const el = document.createElement('div'); el.className = 'modal-overlay';
  el.innerHTML = `
    <div class="modal-content" role="dialog" aria-modal="true">
      <div class="modal-handle"></div>
      <header style="margin-bottom:24px"><h2>Nuevo Pedido</h2></header>
      <div class="form-group">
        <label>Cliente / Destino</label>
        <select id="fc">${cl.map(c => `<option value="${c.id}">${esc(c.nombre)}</option>`).join('')}</select>
      </div>
      <div class="form-group" style="margin-bottom:32px">
        <label>Fecha de Entrega</label>
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
      <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:32px">
        <button class="btn-ghost" id="cx">Cancelar</button>
        <button class="btn-primary" id="ok"><svg style="width:18px;height:18px"><use href="#i-check"></use></svg>Confirmar</button>
      </div>
    </div>
  `;
  document.body.append(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  
  const close = () => { el.classList.remove('open'); setTimeout(() => el.remove(), 400); };
  
  el.onclick = e => {
    if(e.target === el) return close();
    const b = e.target.closest('button'); if(!b) return;
    if(b.dataset.s) {
      const id = b.dataset.p; q[id] = Math.max(0, (q[id]||0) + +b.dataset.s);
      const n = $('#q'+id, el); n.textContent = q[id];
      n.style.transform = 'scale(1.2)'; setTimeout(() => n.style.transform = 'none', 150);
    } else if(b.id === 'cx') close();
    else if(b.id === 'ok') {
      const f = $('#ff', el).value, ex = Object.entries(q).filter(([,n]) => n>0);
      if(!ex.length) return toast('Agrega al menos un producto', 1);
      
      const cur = totals(f, true), over = ex.find(([id, n]) => (cur[id]||0)+n > pm.find(p=>p.id===id).cap);
      if(over) {
        const p = pm.find(p=>p.id===over[0]);
        return toast(`${p.nombre} supera capacidad diaria.`, 1);
      }
      
      const pid = 'o'+uid++;
      DB.pedidos.unshift({id:pid, tenant_id:S.tenant, cliente_id:$('#fc', el).value, estado:'Recibido', fecha:f});
      ex.forEach(([id, n]) => DB.detalle.push({id:'d'+uid++, pedido_id:pid, producto_id:id, cantidad:n}));
      close(); toast('Orden registrada en sistema'); paint(vPed(pid));
    }
  };
}

// === EVENT DELEGATION GLOBAL ===
$('#app').addEventListener('click', async e => {
  const b = e.target.closest('button, .chk-item'); if(!b) return; const d = b.dataset;
  if(d.sg) {
    const s = b.closest('.segment');
    s.querySelectorAll('.seg-btn').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); });
    s.style.setProperty('--idx', [...s.querySelectorAll('.seg-btn')].indexOf(b));
    if(s.id === 'rol') S.rol = d.sg; 
    else { S.fecha = d.sg; $('#pd').innerHTML = S.view === 'prod' ? pdata() : rdata(); post($('#main-view')); }
  } 
  else if(d.t) { S.pick = d.t; document.querySelectorAll('.tenant-btn').forEach(x => x.classList.toggle('on', x === b)); }
  else if(b.id === 'go') { S.tenant = S.pick; S.role = S.rol; S.view = 'pedidos'; shell(); }
  else if(d.v) go(d.v);
  else if(d.a) {
    const p = DB.pedidos.find(x => x.id === d.a); p.estado = EST[EST.indexOf(p.estado)+1];
    paint(vPed(p.id)); toast(p.estado === 'Listo' ? 'Fase completada' : 'Transición iniciada');
  }
  else if(b.id === 'new') newOrder();
  else if(b.id === 'csvb') {
    const c = $('#csv');
    c.innerHTML = c.innerHTML ? '' : `<div class="card stagger" style="--i:0; margin-top:24px; padding:16px"><pre style="margin:0 0 16px; font-size:12px; overflow-x:auto; color:var(--ink-mut); font-family:ui-monospace, monospace">${esc(csv())}</pre><button class="btn-secondary btn-sm" id="cpy">Copiar al portapapeles</button></div>`;
  }
  else if(b.id === 'cpy') {
    try { await navigator.clipboard.writeText(csv()); toast('CSV Copiado'); } catch(_) { toast('Error al copiar', 1); }
  }
  else if(b.id === 'th') {
    const r = document.documentElement;
    const isDark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    r.dataset.theme = isDark ? 'light' : 'dark';
  }
  else if(b.id === 'out') login();
});

login();
