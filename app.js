// datos
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

// pantalla
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

const seg = (id, o, c) => `<div class="segment" id="${id}" style="--idx:${o.findIndex(a=>a[0]===c)}" role="radiogroup" aria-label="${id === 'rol' ? 'perfil' : 'fecha'}">
  ${o.map(([v, l]) => `<button role="radio" aria-checked="${v===c}" class="seg-btn ${v===c?'on':''}" data-sg="${v}">${l}</button>`).join('')}<div class="seg-ind"></div>
</div>`;

// vistas

function vPed(pop) {
  const P = mine('pedidos'), cm = Object.fromEntries(mine('clientes').map(c => [c.id, c.nombre])), pm = prodMap();
  const themes = ['recv', 'bake', 'done'];
  const col = (e, i) => {
    const L = P.filter(p => p.estado === e);
    return `<div class="k-col">
      <div class="k-col-head">
        <h3><span class="dot bg-${themes[i]}"></span> ${e.toLowerCase()}</h3>
        <span class="k-count">${L.length}</span>
      </div>
      ${L.map((p, j) => {
        const it = items(p.id), tot = it.reduce((a,d) => a+d.cantidad, 0);
        return `<article class="card order-card stagger ${pop===p.id?'new':''}" style="--i:${j}">
          <div class="oc-top">
            <div><h4 title="${esc(cm[p.cliente_id].toLowerCase())}">${esc(cm[p.cliente_id].toLowerCase())}</h4><span class="oc-id">ped-${p.id.replace('o','')}</span></div>
            <span class="badge bg-${themes[i]} theme-${themes[i]}">${e.toLowerCase()}</span>
          </div>
          <div class="oc-items">
            ${it.map(d => `<div class="oc-item"><span>${d.cantidad}×</span><b>${esc(pm[d.producto_id].nombre.toLowerCase())}</b></div>`).join('')}
          </div>
          <div class="oc-bot">
            <span class="oc-date"><svg><use href="#i-clock"></use></svg>${p.fecha==='hoy'?'hoy':'mañana'} • ${tot} pz</span>
            ${e!=='Listo' ? `<button class="oc-action bg-${themes[i+1]} theme-${themes[i+1]}" data-a="${p.id}">${e==='Recibido'?'hornear':'terminar'} →</button>` : `<svg class="theme-done" style="width:20px;height:20px"><use href="#i-check"></use></svg>`}
          </div>
        </article>`;
      }).join('') || `<div class="empty-state"><svg><use href="#i-pedidos"></use></svg><p>sin pedidos pendientes</p></div>`}
    </div>`;
  };
  return `
    <header class="header-row stagger" style="--i:0">
      <div><p class="eyebrow">la libreta / pedidos</p><h2>lo que sale del horno</h2><p>cada pedido, de la mesa de trabajo a la entrega.</p></div>
      <button class="btn-primary" id="new"><svg style="width:18px;height:18px"><use href="#i-plus"></use></svg>nuevo pedido</button>
    </header>
    <div class="jornada">
      <span><b>${P.filter(p => p.estado !== 'Listo').length}</b> por preparar</span>
      <span><b>${P.filter(p => p.estado === 'Horneando').length}</b> en el horno</span>
      <span><b>${P.filter(p => p.estado === 'Listo').length}</b> listos para salir</span>
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
      <span>por preparar</span><strong data-n="${totalPed}">0</strong>
      ${enBake > 0 ? `<div class="badge bg-bake theme-bake" style="width:fit-content;margin-top:8px"><span class="dot bg-bake theme-bake" style="background:currentColor"></span>${enBake} en horno</div>` : ''}
    </div>
  `;
  const ins = [['harina',0],['azúcar',1],['mantequilla',2]].map(([n,k]) => [n, ids.reduce((a,id) => a+t[id]*pm[id].rec[k], 0)]);
  if(isAdmin()){
    const c = ids.reduce((a,id) => a+t[id]*pm[id].costo, 0);
    h += `<div class="card metric-card"><span>costo de la hornada</span><strong>${money(c).split('.')[0]}</strong></div>`;
  }
  h += `</section>`;

  h += `<h3 class="stagger" style="--i:2; margin-top:16px">la hornada</h3><div class="prod-list">`;
  if(!ids.length) h += `<div class="empty-state stagger" style="--i:3"><svg><use href="#i-prod"></use></svg><p>todo listo por hoy.</p></div>`;
  
  h += ids.map((id, i) => {
    const p = pm[id], pc = Math.min(100, t[id]/p.cap*100);
    const cls = pc > 90 ? 'critical' : pc > 70 ? 'warning' : '';
    return `<article class="card prod-item stagger" style="--i:${i+3}">
      <div class="prod-info">
        <div><h4>${esc(p.nombre.toLowerCase())}</h4><small>${pc.toFixed(0)}% del horno ocupado</small></div>
        <div class="prod-nums"><b data-n="${t[id]}">0</b> <small>${p.unidad}</small></div>
      </div>
      <div class="progress-bg" role="progressbar" aria-valuenow="${pc.toFixed(0)}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar ${cls}" data-w="${pc.toFixed(0)}"></div></div>
    </article>`;
  }).join('');
  
  h += `</div><h3 class="stagger" style="--i:6; margin-top:32px">lo que vamos a necesitar</h3><div class="dash-grid">`;
  h += ins.map(([n,v], i) => `<div class="card metric-card stagger" style="--i:${i+7}"><span>${n}</span><strong><span data-n="${v.toFixed(1)}" data-d="1">0</span> <small style="font-size:16px">kg</small></strong></div>`).join('') + `</div>`;
  return h;
}

const vProd = () => `
  <header class="header-row stagger" style="--i:0">
    <div><h2>manos a la masa</h2><p>las cantidades y los ingredientes para la jornada.</p></div>
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
      <div class="chk-info"><b>${esc(pm[id].nombre.toLowerCase())}</b>${isAdmin() ? `<small>costo por pieza: ${money(pm[id].costo)}</small>` : ''}</div>
      <div class="chk-val">${t[id]} <small style="font-weight:500">${pm[id].unidad}</small></div>
    </label>
  `).join('') || `<div class="empty-state stagger" style="--i:2"><svg><use href="#i-rep"></use></svg><p>todo revisado.</p></div>`;
  return h + '<div id="csv"></div>';
}

const vRep = () => `
  <header class="header-row stagger" style="--i:0">
    <div><h2>antes de salir</h2><p>repasa lo que falta por entregar.</p></div>
    <div style="display:flex;gap:12px;align-items:center">
      ${seg('sf', FE, S.fecha)}
      <button class="btn-secondary btn-sm" id="csvb"><svg style="width:16px;height:16px"><use href="#i-rep"></use></svg> ver csv</button>
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
    <div><h2>nuestros panes</h2><p>recetas y cantidades con las que trabajamos.</p></div>
    <span class="badge admin"><svg style="width:14px;height:14px"><use href="#i-user"></use></svg>administración</span>
  </header>
  <div class="dash-grid">
    ${mine('productos').map((p, i) => `
      <article class="card metric-card stagger" style="--i:${i+1}">
        <h4 style="margin-bottom:12px">${esc(p.nombre.toLowerCase())}</h4>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:8px"><small>costo</small><b style="font-size:16px">${money(p.costo)}</b></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:16px"><small>piezas por día</small><b style="font-size:16px">${p.cap}</b></div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span class="badge">harina: ${p.rec[0]}</span><span class="badge">azúcar: ${p.rec[1]}</span><span class="badge">mantequilla: ${p.rec[2]}</span>
        </div>
      </article>
    `).join('')}
  </div>
`;

// navegacion
function go(v) {
  if(v === 'cat' && !isAdmin()) return toast('el catálogo se abre desde administración', 1);
  S.view = v;
  document.querySelectorAll('.nav-btn').forEach(b => {
    const isActive = b.dataset.v === v;
    b.classList.toggle('on', isActive);
    b.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
    paint({pedidos: vPed, prod: vProd, rep: vRep, cat: vCat}[v]());
}

const marca = () => `<span class="marca"><svg aria-hidden="true"><use href="#i-espiga"></use></svg>la libreta</span>`;

function shell() {
  const enlaces = () => NAV.map(([k, l, i]) => `
    <button class="nav-btn ${k === 'cat' && !isAdmin() ? 'lock' : ''}" data-v="${k}">
      <svg aria-hidden="true"><use href="#i-${i}"></use></svg>${l.toLowerCase()}
    </button>`).join('');

  $('#app').innerHTML = `
    <aside class="sidebar" aria-label="navegacion principal">
      <div class="sidebar-brand">
        ${marca()}
        <p>${esc(TEN[S.tenant].toLowerCase())}</p>
        <small>${S.role.toLowerCase()}</small>
      </div>
      <nav class="nav-bottom">${enlaces()}</nav>
      <div class="sidebar-bottom">
        <button class="btn-ghost" data-action="tema"><svg aria-hidden="true"><use href="#i-moon"></use></svg>cambiar tema</button>
        <button class="btn-ghost" data-action="salir"><svg aria-hidden="true"><use href="#i-out"></use></svg>salir del obrador</button>
        <p class="sidebar-note">harina, agua y tiempo.</p>
      </div>
    </aside>
    <header class="topbar">
      <div><b>${esc(TEN[S.tenant].toLowerCase())}</b><br><small>la libreta / ${S.role.toLowerCase()}</small></div>
      <div class="topbar-actions">
        <button data-action="tema" aria-label="cambiar tema"><svg><use href="#i-moon"></use></svg></button>
        <button data-action="salir" aria-label="salir"><svg><use href="#i-out"></use></svg></button>
      </div>
    </header>
    <main class="main-content" id="main-view"></main>
    <nav class="nav-bottom mobile-only" aria-label="navegacion movil">${enlaces()}</nav>
  `;
  go(S.view);
}

function login() {
  $('#app').innerHTML = `
    <div class="login-wrap">
      <header class="login-top">${marca()}<span>el cuaderno de tu panadería</span></header>
      <main class="login-content">
        <section class="login-story">
          <p class="eyebrow">del obrador a la mesa</p>
          <h1>el pan de<br>cada <em>día.</em></h1>
          <svg class="pan-dibujo" viewBox="0 0 420 190" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M16 169c98-5 221-6 389-2" opacity=".35"/>
            <path d="M29 131c-7-11-3-24 9-36C79 57 153 22 216 18c21-1 37 6 36 20-1 19-37 45-81 66-49 24-122 44-142 27Z"/>
            <path d="M36 128C74 110 180 74 244 31M45 110c7 3 14 5 22 5m-3-22c8 3 17 3 24 2m-6-23c7 4 17 4 25 2m-3-21c8 3 16 3 23 1m1-16c7 3 14 3 20 2" opacity=".45"/>
            <path d="M83 78c-4 9-2 16 5 20m20-35c-4 9-1 16 6 20m20-35c-3 9 0 16 7 20m18-32c-2 8 1 14 8 18m15-26c-1 7 2 12 9 15"/>
            <path d="M199 136c-6-28 7-60 35-73 28-14 70-10 95 9 23 17 36 47 27 73-5 14-23 21-72 22-52 1-81-8-85-31Z"/>
            <path d="M202 137c37 16 112 18 151 5M215 97c19-15 30-19 43-19m-33 42c21-20 43-28 65-31m-34 43c17-17 34-27 54-30"/>
            <path d="m224 144 2 1m19 6 3 1m32 3 2 0m30-5 2-1m23-12 2-1m-121-20 1-2m101-36 1 2m-21-14 2 1m-79 28 2-1m-6 12 1-1m-155-9 2-1m35-16 2-1m51-25 2-1m37-16 2 0" opacity=".6"/>
            <path d="M363 134c6-28 12-44 28-67m-15 39c-12-5-15-14-14-20 12 2 17 9 14 20Zm7-16c2-13 8-18 16-20 1 12-5 19-16 20Zm-14 35c-12-3-16-10-17-17 12 0 18 6 17 17Zm5-16c4-11 11-15 19-15-1 11-8 16-19 15Z"/>
          </svg>
          <p>pedidos, hornadas y cuentas.<br>cada cosa en su lugar, a tu ritmo.</p>
        </section>
        <section class="login-box" aria-labelledby="acceso-titulo">
          <p class="eyebrow">01 / antes de encender el horno</p>
          <h2 id="acceso-titulo">entra al obrador</h2>
          <p>elige tu panadería para abrir la libreta.</p>
          <div class="tenant-list">
            ${Object.entries(TEN).map(([id, n], i) => `
              <button class="tenant-btn ${S.pick === id ? 'on' : ''}" data-t="${id}" aria-pressed="${S.pick === id}">
                <span class="tenant-num">0${i + 1}</span>
                <span><b>${esc(n.toLowerCase())}</b><small>${i === 0 ? 'pan de todos los días' : 'recién salido del horno'}</small></span>
                <span class="tenant-mark" aria-hidden="true"></span>
              </button>`).join('')}
          </div>
          <span class="field-label">¿cómo vas a trabajar hoy?</span>
          ${seg('rol', [['Administrador', 'administración'], ['Operador', 'operación']], S.rol)}
          <button class="btn-primary login-submit" id="go">abrir la libreta <span aria-hidden="true">↗</span></button>
          <small class="login-note">elige un perfil para probar el cuaderno.</small>
        </section>
      </main>
      <footer class="login-foot"><span>hecho para el trabajo de cada día.</span><span>harina, agua y tiempo.</span></footer>
    </div>
  `;
}

// nuevo pedido
function newOrder() {
  const pm = mine('productos'), cl = mine('clientes'), q = {};
  const el = document.createElement('div'); el.className = 'modal-overlay';
  el.innerHTML = `
    <div class="modal-content" role="dialog" aria-modal="true" aria-label="nuevo pedido" tabindex="-1">
      <div class="modal-handle"></div>
      <header style="margin-bottom:24px"><h2>nuevo pedido</h2></header>
      <div class="form-group">
        <label for="fc">¿para quién es?</label>
        <select id="fc">${cl.map(c => `<option value="${c.id}">${esc(c.nombre.toLowerCase())}</option>`).join('')}</select>
      </div>
      <div class="form-group" style="margin-bottom:32px">
        <label for="ff">¿cuándo se entrega?</label>
        <select id="ff"><option value="manana">mañana</option><option value="hoy">hoy</option></select>
      </div>
      <div class="form-group"><label>los panes</label>
        ${pm.map(p => `
          <div class="qty-row">
            <b>${esc(p.nombre.toLowerCase())}</b>
            <div class="qty-ctrl">
              <button data-s="-10" data-p="${p.id}" aria-label="restar 10">−</button>
              <span id="q${p.id}">0</span>
              <button data-s="10" data-p="${p.id}" aria-label="sumar 10">+</button>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:32px">
        <button class="btn-ghost" id="cx">cancelar</button>
        <button class="btn-primary" id="ok"><svg style="width:18px;height:18px"><use href="#i-check"></use></svg>guardar pedido</button>
      </div>
    </div>
  `;
  const anterior = document.activeElement;
  document.body.append(el);
  el.querySelector('select').focus();
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  
  const close = () => {
    el.classList.remove('open');
    setTimeout(() => el.remove(), 250);
    if(anterior?.isConnected) anterior.focus();
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
    if(e.target === el) return close();
    const b = e.target.closest('button'); if(!b) return;
    if(b.dataset.s) {
      const id = b.dataset.p; q[id] = Math.max(0, (q[id]||0) + +b.dataset.s);
      const n = $('#q'+id, el); n.textContent = q[id];
      n.style.transform = 'scale(1.2)'; setTimeout(() => n.style.transform = 'none', 150);
    } else if(b.id === 'cx') close();
    else if(b.id === 'ok') {
      const f = $('#ff', el).value, ex = Object.entries(q).filter(([,n]) => n>0);
      if(!ex.length) return toast('agrega al menos un pan', 1);
      
      const cur = totals(f, true), over = ex.find(([id, n]) => (cur[id]||0)+n > pm.find(p=>p.id===id).cap);
      if(over) {
        const p = pm.find(p=>p.id===over[0]);
        return toast(`${p.nombre} supera capacidad diaria.`, 1);
      }
      
      const pid = 'o'+uid++;
      DB.pedidos.unshift({id:pid, tenant_id:S.tenant, cliente_id:$('#fc', el).value, estado:'Recibido', fecha:f});
      ex.forEach(([id, n]) => DB.detalle.push({id:'d'+uid++, pedido_id:pid, producto_id:id, cantidad:n}));
      close(); toast('pedido anotado'); paint(vPed(pid));
    }
  };
}

// botones
$('#app').addEventListener('click', async e => {
  const b = e.target.closest('button, .chk-item'); if(!b) return; const d = b.dataset;
  if(d.sg) {
    const s = b.closest('.segment');
    s.querySelectorAll('.seg-btn').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); });
    s.style.setProperty('--idx', [...s.querySelectorAll('.seg-btn')].indexOf(b));
    if(s.id === 'rol') S.rol = d.sg; 
    else { S.fecha = d.sg; $('#pd').innerHTML = S.view === 'prod' ? pdata() : rdata(); post($('#main-view')); }
  } 
  else if(d.t) { S.pick = d.t; document.querySelectorAll('.tenant-btn').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); }
  else if(b.id === 'go') { S.tenant = S.pick; S.role = S.rol; S.view = 'pedidos'; shell(); }
  else if(d.v) go(d.v);
  else if(d.a) {
    const p = DB.pedidos.find(x => x.id === d.a); p.estado = EST[EST.indexOf(p.estado)+1];
    paint(vPed(p.id)); toast(p.estado === 'Listo' ? 'pedido listo' : 'al horno');
  }
  else if(b.id === 'new') newOrder();
  else if(b.id === 'csvb') {
    const c = $('#csv');
    c.innerHTML = c.innerHTML ? '' : `<div class="card stagger" style="--i:0; margin-top:24px; padding:16px"><pre style="margin:0 0 16px; font-size:12px; overflow-x:auto; color:var(--ink-mut); font-family:ui-monospace, monospace">${esc(csv())}</pre><button class="btn-secondary btn-sm" id="cpy">copiar lista</button></div>`;
  }
  else if(b.id === 'cpy') {
    try { await navigator.clipboard.writeText(csv()); toast('lista copiada'); } catch(_) { toast('no se pudo copiar la lista', 1); }
  }
  else if(d.action === 'tema') {
    const r = document.documentElement;
    const isDark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    r.dataset.theme = isDark ? 'light' : 'dark';
  }
  else if(d.action === 'salir') login();
});

login();
