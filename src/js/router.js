/* ============================================================
   router.js — Sistema de navegación entre pantallas
   ============================================================ */

// Pantallas que NO deben mostrar el bottom nav (usuario no logueado)
const NO_NAV_SCREENS = ['welcome', 'login', 'register', 'loading'];

const Router = {

  current: null,
  pages: {},

  register(name, renderFn) {
    this.pages[name] = renderFn;
  },

  go(name) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // Mostrar / crear la pantalla destino
    let screen = document.getElementById('screen-' + name);
    if (!screen) {
      screen = document.createElement('div');
      screen.id = 'screen-' + name;
      screen.className = 'screen' + (NO_NAV_SCREENS.includes(name) ? ' no-nav' : '');
      document.getElementById('app').appendChild(screen);
    }

    // Renderizar contenido si hay función registrada
    if (this.pages[name]) {
      screen.innerHTML = this.pages[name]();
    }

    screen.classList.add('active');
    screen.scrollTop = 0;
    this.current = name;

    // Eliminar pantalla de loading si existe
    if (typeof removeLoadingScreen === 'function') removeLoadingScreen();

    // Bottom nav — solo visible para usuarios logueados
    const nav = document.getElementById('bottom-nav');
    const showNav = !NO_NAV_SCREENS.includes(name);
    nav.style.display = showNav ? 'flex' : 'none';

    if (showNav) {
      document.querySelectorAll('.nav-item').forEach(n => {
        n.classList.toggle('active', n.dataset.nav === name);
      });
      // Asegurar padding inferior para que el contenido no quede tapado
      screen.style.paddingBottom = '80px';
    } else {
      screen.style.paddingBottom = '0';
    }

    // Ejecutar scripts post-render si los hay
    if (this.pages[name + '_after']) {
      this.pages[name + '_after']();
    }
  },

  back() {
    this.go('home');
  },
};

// Atajo global
function goTo(name) { Router.go(name); }
