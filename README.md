<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Panadería SaaS - Ultra Premium v2</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
/* --- SISTEMA DE DISEÑO ULTRA PREMIUM --- */
:root {
  /* Espaciado Modular */
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px; --sp-5: 24px; --sp-6: 32px; --sp-8: 48px;
  /* Radios (Smooth Corners illusion) */
  --rd-sm: 8px; --rd-md: 12px; --rd-lg: 16px; --rd-xl: 24px; --rd-pill: 999px;
  
  /* Curvas de Animación Naturales (Linear / Apple style) */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.1);
  --tr-fast: 150ms var(--ease-out);
  --tr-norm: 300ms var(--ease-out);
  --tr-slow: 500ms var(--ease-out);

  /* Paleta Light (Editorial SaaS) */
  --bg: #F9F8F6;
  --bg-app: #FFFFFF;
  --surface: #FFFFFF;
  --surface-hover: #F3F1EC;
  --surface-active: #EBE8E1;
  --border: #E8E5DF;
  --border-focus: #C87A30;
  
  --ink: #11100F;
  --ink-mut: #68635D;
  --ink-light: #9B958E;
  
  --brand: #C87A30;
  --brand-hover: #A66223;
  --brand-bg: #FDF3EB;
  
  /* Temas Semánticos (Recibido, Horneando, Listo, Crítico) */
  --th-recv: #E6A23C; --th-recv-bg: #FFF9F0; --th-recv-border: #FBE6C9;
  --th-bake: #E2672B; --th-bake-bg: #FFF2EC; --th-bake-border: #FBD4C3;
  --th-done: #2D8A5F; --th-done-bg: #ECFDF4; --th-done-border: #BCEBD4;
  --th-crit: #D84C5A; --th-crit-bg: #FEF2F3; --th-crit-border: #FAD3D7;
  
  /* Sombras y Profundidad Real */
  --sh-sm: 0 1px 3px rgba(17, 16, 15, 0.05), 0 1px 2px rgba(17, 16, 15, 0.03);
  --sh-md: 0 4px 6px rgba(17, 16, 15, 0.04), 0 2px 4px rgba(17, 16, 15, 0.03);
  --sh-lg: 0 12px 24px rgba(17, 16, 15, 0.06), 0 4px 8px rgba(17, 16, 15, 0.04);
  --sh-modal: 0 0 0 100vmax rgba(17, 16, 15, 0.25);
  
  box-sizing: border-box;
}

/* Paleta Dark (Linear/Vercel Aesthetic) */
:root[data-theme="dark"] {
  --bg: #000000;
  --bg-app: #000000;
  --surface: #0A0A0A;
  --surface-hover: #141414;
  --surface-active: #1F1F1F;
  --border: #222222;
  --border-focus: #CFA362;
  
  --ink: #EDEDED;
  --ink-mut: #888888;
  --ink-light: #555555;
  
  --brand: #CFA362;
  --brand-hover: #B58C50;
  --brand-bg: #1F170C;
  
  --th-recv: #DFA953; --th-recv-bg: #1F170A; --th-recv-border: #3D2D14;
  --th-bake: #D26B35; --th-bake-bg: #211007; --th-bake-border: #42200E;
  --th-done: #34A873; --th-done-bg: #091F14; --th-done-border: #123D29;
  --th-crit: #E86674; --th-crit-bg: #240C0F; --th-crit-border: #47181E;
  
  --sh-sm: 0 1px 3px rgba(0, 0, 0, 0.8);
  --sh-md: 0 4px 6px rgba(0, 0, 0, 0.8);
  --sh-lg: 0 12px 24px rgba(0, 0, 0, 0.9);
  --sh-modal: 0 0 0 100vmax rgba(0, 0, 0, 0.8);
}

@media(prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #000000; --bg-app: #000000; --surface: #0A0A0A; --surface-hover: #141414; --surface-active: #1F1F1F;
    --border: #222222; --border-focus: #CFA362; --ink: #EDEDED; --ink-mut: #888888; --ink-light: #555555;
    --brand: #CFA362; --brand-hover: #B58C50; --brand-bg: #1F170C;
    --th-recv: #DFA953; --th-recv-bg: #1F170A; --th-recv-border: #3D2D14;
    --th-bake: #D26B35; --th-bake-bg: #211007; --th-bake-border: #42200E;
    --th-done: #34A873; --th-done-bg: #091F14; --th-done-border: #123D29;
    --th-crit: #E86674; --th-crit-bg: #240C0F; --th-crit-border: #47181E;
  }
}

*, *:before, *:after { box-sizing: inherit; -webkit-tap-highlight-color: transparent; }
html { scroll-behavior: smooth; }
body { 
  margin: 0; background: var(--bg); color: var(--ink); 
  font: 14px/1.5 'Plus Jakarta Sans', system-ui, sans-serif;
  transition: background var(--tr-slow), color var(--tr-slow);
  -webkit-font-smoothing: antialiased;
}

/* Tipografía Refinada */
h1, h2, h3, h4, b, strong { font-weight: 700; margin: 0; letter-spacing: -0.02em; color: var(--ink); }
h1 { font-size: 32px; letter-spacing: -0.03em; }
h2 { font-size: 20px; font-weight: 600; }
h3 { font-size: 16px; font-weight: 600; }
p { margin: 0; }
small { color: var(--ink-mut); font-size: 12px; font-weight: 500; }

/* Botones y Estados Interactivos */
button { font: inherit; color: inherit; cursor: pointer; border: 0; background: none; padding: 0; transition: all var(--tr-fast); }
button:active { transform: scale(0.97); }
button:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 2px; }

.btn-primary { background: var(--brand); color: #fff; font-weight: 600; padding: 10px 18px; border-radius: var(--rd-md); box-shadow: 0 4px 12px rgba(200, 122, 48, 0.2); display: inline-flex; align-items: center; gap: 8px; justify-content: center; }
.btn-primary:hover { background: var(--brand-hover); box-shadow: 0 6px 16px rgba(200, 122, 48, 0.3); }
.btn-secondary { background: var(--surface); color: var(--ink); border: 1px solid var(--border); font-weight: 500; padding: 10px 18px; border-radius: var(--rd-md); box-shadow: var(--sh-sm); display: inline-flex; align-items: center; gap: 8px; justify-content: center;}
.btn-secondary:hover { background: var(--surface-hover); border-color: var(--ink-light); }
.btn-sm { padding: 8px 14px; font-size: 13px; border-radius: var(--rd-sm); }
.btn-ghost { padding: 10px 18px; color: var(--ink-mut); font-weight: 500; border-radius: var(--rd-md); display: inline-flex; align-items: center; gap: 8px; }
.btn-ghost:hover { background: var(--surface-hover); color: var(--ink); }

/* Etiquetas (Badges) */
.badge { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: var(--rd-pill); background: var(--surface-hover); color: var(--ink-mut); border: 1px solid var(--border); letter-spacing: 0.01em; }
.badge.admin { background: var(--brand-bg); color: var(--brand); border-color: transparent; }
.dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }

/* Clases Temáticas Semánticas (Eliminando estilos inline) */
.theme-recv { color: var(--th-recv); } .bg-recv { background: var(--th-recv-bg); border: 1px solid var(--th-recv-border); }
.theme-bake { color: var(--th-bake); } .bg-bake { background: var(--th-bake-bg); border: 1px solid var(--th-bake-border); }
.theme-done { color: var(--th-done); } .bg-done { background: var(--th-done-bg); border: 1px solid var(--th-done-border); }
.theme-crit { color: var(--th-crit); }

/* Layout Estructural */
#app { display: flex; flex-direction: column; min-height: 100vh; background: var(--bg-app); }
.topbar { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; border-bottom: 1px solid var(--border); background: var(--surface); position: sticky; top: 0; z-index: 10; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: rgba(var(--surface-rgb), 0.8); }

.main-content { flex: 1; padding: 24px; max-width: 1200px; margin: 0 auto; width: 100%; padding-bottom: 120px; display: flex; flex-direction: column; gap: var(--sp-6); }

/* Animaciones Skeleton/Fade Naturales */
.view-enter { animation: skeletonReveal var(--tr-slow) forwards; }
.stagger { opacity: 0; animation: fadeUp 0.5s var(--ease-out) forwards; animation-delay: calc(var(--i) * 40ms); }

/* Nav Mobile Bottom */
.nav-bottom { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); width: calc(100% - 32px); max-width: 380px; display: flex; padding: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--rd-xl); box-shadow: var(--sh-lg); z-index: 20; }
.nav-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 0; color: var(--ink-mut); position: relative; z-index: 1; font-size: 11px; font-weight: 500; }
.nav-btn.on { color: var(--ink); font-weight: 600; }
.nav-btn.lock { opacity: 0.4; }
.nav-btn svg { width: 20px; height: 20px; transition: transform var(--tr-spring), color var(--tr-fast); stroke-width: 2; }
.nav-btn.on svg { transform: translateY(-2px); color: var(--brand); }
.nav-indicator { position: absolute; top: 6px; bottom: 6px; width: calc((100% - 12px) / 4); background: var(--surface-hover); border: 1px solid var(--border); border-radius: var(--rd-lg); transform: translateX(calc(var(--idx, 0) * 100%)); transition: transform var(--tr-spring); pointer-events: none; }

/* Desktop Sidebar Premium */
@media(min-width: 900px) {
  #app { flex-direction: row; }
  .topbar { display: none; }
  .sidebar { width: 240px; height: 100vh; position: sticky; top: 0; border-right: 1px solid var(--border); background: var(--surface); display: flex; flex-direction: column; padding: 24px 16px; z-index: 20; }
  .nav-bottom { position: relative; bottom: auto; left: auto; transform: none; width: 100%; max-width: none; flex-direction: column; background: transparent; border: 0; box-shadow: none; padding: 0; gap: 4px; margin-top: 32px; }
  .nav-btn { flex-direction: row; padding: 10px 16px; font-size: 14px; border-radius: var(--rd-md); text-align: left; gap: 12px; color: var(--ink-mut); }
  .nav-btn.on { color: var(--ink); }
  .nav-btn svg { width: 18px; height: 18px; }
  .nav-btn.on svg { transform: none; }
  .nav-indicator { top: 0; height: 100%; width: 100%; transform: translateY(calc(var(--idx, 0) * 100%)); transition: transform var(--tr-spring); border-radius: var(--rd-md); background: var(--surface-active); border: none; }
  .main-content { padding: 48px; }
}

/* Header Jerárquico */
.header-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }

/* Kanban UI con Profundidad Real */
.kanban { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; scroll-snap-type: x mandatory; margin: 0 -24px; padding: 0 24px 24px; }
@media(min-width: 900px) { .kanban { display: grid; grid-template-columns: repeat(3, 1fr); overflow: visible; margin: 0; padding: 0; } }
.k-col { scroll-snap-align: center; min-width: 85%; flex-shrink: 0; display: flex; flex-direction: column; gap: 12px; }
@media(min-width: 900px) { .k-col { min-width: 0; } }
.k-col-head { display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 2px solid var(--border); }
.k-count { color: var(--ink-mut); font-weight: 600; font-size: 13px; }

/* Tarjetas (Cards) */
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--rd-lg); box-shadow: var(--sh-sm); transition: transform var(--tr-fast), box-shadow var(--tr-fast), border-color var(--tr-fast); }
.order-card { padding: 16px; display: flex; flex-direction: column; gap: 16px; position: relative; overflow: hidden; }
.order-card:hover { transform: translateY(-2px); box-shadow: var(--sh-md); border-color: var(--ink-light); }
.order-card.new { animation: popIn var(--tr-spring); }
.oc-top { display: flex; justify-content: space-between; align-items: flex-start; }
.oc-id { font-size: 11px; color: var(--ink-light); font-weight: 600; font-family: ui-monospace, monospace; letter-spacing: 0.05em; }
.oc-items { display: flex; flex-direction: column; gap: 6px; }
.oc-item { display: flex; justify-content: space-between; font-size: 13px; font-weight: 500; color: var(--ink-mut); }
.oc-item b { color: var(--ink); }
.oc-bot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 12px; margin-top: auto; }
.oc-date { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-mut); font-weight: 600; }
.oc-date svg { width: 14px; height: 14px; }
.oc-action { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: var(--rd-sm); transition: background var(--tr-fast); }
.oc-action:hover { filter: brightness(0.95); }

/* Dashboard UI */
.dash-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.metric-card { padding: 24px; display: flex; flex-direction: column; gap: 8px; }
.metric-card span { color: var(--ink-mut); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.metric-card strong { font-size: 40px; line-height: 1; letter-spacing: -0.04em; }

.prod-list { display: flex; flex-direction: column; gap: 12px; }
.prod-item { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
.prod-info { display: flex; justify-content: space-between; align-items: center; }
.prod-nums { text-align: right; }
.prod-nums b { font-size: 20px; }
.progress-bg { height: 6px; background: var(--surface-active); border-radius: var(--rd-pill); overflow: hidden; }
.progress-bar { height: 100%; background: var(--brand); width: 0%; border-radius: var(--rd-pill); transition: width 1s var(--ease-out), background 0.3s; }
.progress-bar.warning { background: var(--th-recv); }
.progress-bar.critical { background: var(--th-crit); }

/* Controles Segmentados */
.segment { display: inline-flex; background: var(--surface-hover); padding: 4px; border-radius: var(--rd-md); border: 1px solid var(--border); position: relative; }
.seg-btn { position: relative; z-index: 1; padding: 6px 16px; font-weight: 600; font-size: 13px; color: var(--ink-mut); border-radius: var(--rd-sm); }
.seg-btn.on { color: var(--ink); }
.seg-ind { position: absolute; top: 4px; bottom: 4px; width: calc((100% - 8px)/2); background: var(--surface); border-radius: var(--rd-sm); box-shadow: var(--sh-sm); border: 1px solid var(--border); transition: transform var(--tr-spring); transform: translateX(calc(var(--idx, 0) * 100%)); }

/* Listas tipo Checklist */
.chk-list { display: flex; flex-direction: column; gap: 8px; }
.chk-item { display: flex; align-items: center; gap: 16px; padding: 16px; cursor: pointer; }
.chk-item:hover { background: var(--surface-hover); }
.chk-item input { display: none; }
.chk-box { width: 22px; height: 22px; border: 2px solid var(--ink-light); border-radius: 6px; display: grid; place-items: center; transition: all var(--tr-fast); background: var(--surface); }
.chk-box svg { width: 14px; height: 14px; color: var(--surface); transform: scale(0); transition: transform var(--tr-spring); stroke-width: 3; }
.chk-item input:checked ~ .chk-box { background: var(--th-done); border-color: var(--th-done); }
.chk-item input:checked ~ .chk-box svg { transform: scale(1); }
.chk-info { flex: 1; transition: opacity var(--tr-fast); }
.chk-item input:checked ~ .chk-info { opacity: 0.4; text-decoration: line-through; }
.chk-val { font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; }

/* Modal Bottom-Sheet en móvil */
.modal-overlay { position: fixed; inset: 0; background: var(--sh-modal); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 100; opacity: 0; transition: opacity var(--tr-norm); display: flex; align-items: flex-end; justify-content: center; pointer-events: none; }
.modal-content { background: var(--surface); width: 100%; max-width: 520px; border-radius: var(--rd-xl) var(--rd-xl) 0 0; padding: 24px; padding-bottom: calc(24px + env(safe-area-inset-bottom)); transform: translateY(100%); transition: transform var(--tr-spring); max-height: 90vh; overflow-y: auto; box-shadow: var(--sh-lg); }
.modal-handle { width: 40px; height: 4px; background: var(--border); border-radius: var(--rd-pill); margin: 0 auto 24px; }
@media(min-width: 768px) {
  .modal-overlay { align-items: center; }
  .modal-content { border-radius: var(--rd-xl); transform: translateY(20px) scale(0.98); padding-bottom: 24px; }
  .modal-handle { display: none; }
}
.modal-overlay.open { opacity: 1; pointer-events: auto; }
.modal-overlay.open .modal-content { transform: translateY(0) scale(1); }

.form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.form-group label { font-size: 12px; font-weight: 600; color: var(--ink-mut); text-transform: uppercase; letter-spacing: 0.05em; }
select, input { padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--rd-md); background: var(--bg); color: var(--ink); font: inherit; outline: none; transition: border-color var(--tr-fast), box-shadow var(--tr-fast); cursor: pointer; }
select:focus-visible, input:focus-visible { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-bg); }

.qty-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); }
.qty-ctrl { display: flex; align-items: center; gap: 12px; background: var(--surface-hover); border: 1px solid var(--border); padding: 4px; border-radius: var(--rd-pill); }
.qty-ctrl button { width: 32px; height: 32px; border-radius: 50%; background: var(--surface); box-shadow: var(--sh-sm); display: grid; place-items: center; color: var(--ink-mut); }
.qty-ctrl button:hover { color: var(--ink); border: 1px solid var(--border); }
.qty-ctrl span { min-width: 28px; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums; }

/* Toasts Refinados */
.toast-container { position: fixed; top: 24px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
.toast { background: var(--ink); color: var(--bg); padding: 12px 20px; border-radius: var(--rd-lg); box-shadow: var(--sh-lg); display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: 13px; animation: slideDown var(--tr-spring); }
.toast svg { color: var(--th-done); width: 18px; height: 18px; }
.toast.error svg { color: var(--th-crit); }

/* Login */
.login-wrap { min-height: 100vh; display: grid; place-items: center; background: var(--bg); padding: 24px; }
.login-box { background: var(--surface); border: 1px solid var(--border); border-radius: var(--rd-xl); padding: 48px 40px; width: 100%; max-width: 440px; box-shadow: var(--sh-lg); text-align: center; animation: skeletonReveal var(--tr-slow); }
.tenant-btn { padding: 16px; border: 2px solid var(--border); border-radius: var(--rd-lg); display: flex; flex-direction: column; gap: 4px; text-align: left; background: var(--surface); }
.tenant-btn.on { border-color: var(--brand); background: var(--brand-bg); }

/* Utilities & Empty States */
.empty-state { text-align: center; padding: 64px 24px; color: var(--ink-mut); display: flex; flex-direction: column; align-items: center; gap: 12px; }
.empty-state svg { width: 48px; height: 48px; opacity: 0.3; }

/* Animaciones Keyframes */
@keyframes skeletonReveal { 
  0% { opacity: 0; filter: blur(4px); transform: translateY(10px) scale(0.99); } 
  100% { opacity: 1; filter: blur(0); transform: none; } 
}
@keyframes fadeUp { 
  0% { opacity: 0; transform: translateY(12px); } 
  100% { opacity: 1; transform: none; } 
}
@keyframes popIn { 
  0% { transform: scale(0.95); opacity: 0; } 
  50% { transform: scale(1.02); } 
  100% { transform: scale(1); opacity: 1; } 
}
@keyframes slideDown { 
  0% { opacity: 0; transform: translateY(-24px) scale(0.9); } 
  100% { opacity: 1; transform: none; } 
}

@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
</style>
</head>
<body>
<div id="app"></div>

<!-- Iconografía SVG Consistente (24x24 viewBox, stroke 2) -->
<svg style="display:none">
  <defs>
    <symbol id="i-pedidos" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></symbol>
    <symbol id="i-prod" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></symbol>
    <symbol id="i-rep" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></symbol>
    <symbol id="i-cat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></symbol>
    <symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></symbol>
    <symbol id="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></symbol>
    <symbol id="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></symbol>
    <symbol id="i-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></symbol>
    <symbol id="i-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></symbol>
  </defs>
</svg>

<div class="toast-container" id="toaster" aria-live="polite"></div>

<script>
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
</script>
</body>
</html>
