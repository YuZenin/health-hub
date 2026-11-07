/*
 * Shared navigation bar for all portals.
 *
 * Every portal adds ONE line just before </body>:
 *   <script src="https://YOUR-HUB.onrender.com/site-nav.js" data-site="wellbeing" defer></script>
 *
 * To rename a portal, change a link or add a fifth one, edit only the SITES list below and push this repo.
 * Every portal picks up the change on its next page load; the portals themselves need no change.
 *
 * The bar is drawn inside a Shadow DOM, so its styles never clash with a portal's own CSS (whatever it is
 * built with), and the portal's CSS never changes the bar.
 */
(function () {
  // ======== EDIT HERE ========
  var HUB = { name: 'Health Hub', url: 'https://YOUR-HUB.onrender.com/' };
  var SITES = [
    { id: 'wellbeing', name: 'Health & Wellbeing', url: 'https://health-wellbeing-portal.onrender.com/', color: '#2d8b8b', blurb: 'Sleep, stress, healthy eating and staying active.' },
    { id: 'health', name: 'Health Portal', url: 'https://health-portal-app.onrender.com/', color: '#1f5fd1', blurb: 'Diseases and health conditions, explained in plain language.' },
    { id: 'sports', name: 'Sports & Fitness', url: 'https://sports-portal-app.onrender.com/', color: '#c7811a', blurb: 'Sports, exercise and fitness, and how to stay safe doing them.' },
    { id: 'parenting', name: 'Parenting', url: 'https://chamodi-parenting-portal.onrender.com/', color: '#b4466b', blurb: 'Baby sleep, feeding, development, behaviour and safety.' },
  ];
  // ===========================

  // Let the hub page reuse the same list for its cards.
  window.SuiteNav = { hub: HUB, sites: SITES };

  if (document.getElementById('suite-nav-root')) return; // loaded twice: draw once

  var me = document.currentScript;
  var hostOf = function (u) {
    try {
      return new URL(u).host;
    } catch (e) {
      return '';
    }
  };
  // Which portal is this? The data-site attribute wins; otherwise match the address.
  var current = (me && me.getAttribute('data-site')) || '';
  if (!current) {
    for (var i = 0; i < SITES.length; i++) if (hostOf(SITES[i].url) === location.host) current = SITES[i].id;
    if (!current && hostOf(HUB.url) === location.host) current = 'hub';
  }

  var css =
    ':host{all:initial;display:block;position:relative;z-index:30}' +
    '*{box-sizing:border-box}' +
    'nav{display:flex;align-items:center;gap:6px;height:44px;padding:0 16px;background:#14161f;color:#e8eaf0;' +
    'font:500 14px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;overflow-x:auto;scrollbar-width:none;white-space:nowrap}' +
    'nav::-webkit-scrollbar{display:none}' +
    'a{color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 12px;border-radius:8px;flex:none}' +
    'a:hover{background:rgba(255,255,255,.08)}' +
    'a:focus-visible{outline:2px solid #fff;outline-offset:1px}' +
    '.hub{font-weight:700;margin-right:6px;padding-left:4px}' +
    '.mark{width:22px;height:22px;border-radius:6px;display:grid;place-items:center;background:linear-gradient(135deg,#2d8b8b,#b4466b);color:#fff;font-size:15px;line-height:1}' +
    '.sep{width:1px;height:20px;background:rgba(255,255,255,.16);flex:none;margin-right:4px}' +
    '.dot{width:8px;height:8px;border-radius:50%;flex:none}' +
    'a[aria-current="page"]{background:rgba(255,255,255,.14);color:#fff;font-weight:600}' +
    '@media (max-width:600px){nav{padding:0 8px}.hub .label{display:none}}';

  var host = document.createElement('div');
  host.id = 'suite-nav-root';
  var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

  var style = document.createElement('style');
  style.textContent = css;
  var nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'All portals');

  var hub = document.createElement('a');
  hub.className = 'hub';
  hub.href = HUB.url;
  if (current === 'hub') hub.setAttribute('aria-current', 'page');
  var mark = document.createElement('span');
  mark.className = 'mark';
  mark.setAttribute('aria-hidden', 'true');
  mark.textContent = '+';
  var label = document.createElement('span');
  label.className = 'label';
  label.textContent = HUB.name;
  hub.append(mark, label);
  var sep = document.createElement('span');
  sep.className = 'sep';
  nav.append(hub, sep);

  SITES.forEach(function (s) {
    var a = document.createElement('a');
    a.href = s.url;
    if (s.id === current) a.setAttribute('aria-current', 'page');
    var dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = s.color;
    a.append(dot, document.createTextNode(s.name));
    nav.append(a);
  });

  root.append(style, nav);
  var mount = function () {
    document.body.insertBefore(host, document.body.firstChild);
    // On a narrow phone screen, slide the bar so the current portal is visible (without scrolling the page).
    var active = root.querySelector('[aria-current="page"]');
    if (active && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
  };
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
