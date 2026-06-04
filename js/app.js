/* ============================================================
   app.js — Bootstrap principal con Firebase integrado
   ============================================================ */

(function () {

  function bootstrap() {
    const appEl = document.getElementById('app');

    // ── Bottom Navigation ──────────────────────────────────────────
    const nav = document.createElement('nav');
    nav.id        = 'bottom-nav';
    nav.className = 'bottom-nav';
    nav.style.display = 'none';
    nav.innerHTML = `
      <button class="nav-item active" data-nav="home"       onclick="goTo('home')">
        <i class="ti ti-home-2"></i><span>Inicio</span>
      </button>
      <button class="nav-item" data-nav="medications" onclick="goTo('medications')">
        <i class="ti ti-pill"></i><span>Meds</span>
      </button>
      <button class="nav-item" data-nav="stats"     onclick="goTo('stats')">
        <i class="ti ti-chart-bar"></i><span>Stats</span>
      </button>
      <button class="nav-item" data-nav="reminders" onclick="goTo('reminders')">
        <i class="ti ti-bell"></i><span>Alertas</span>
      </button>
      <button class="nav-item" data-nav="premium"   onclick="goTo('premium')">
        <i class="ti ti-star"></i><span>Premium</span>
      </button>
    `;
    document.body.appendChild(nav);

    // ── Toast ──────────────────────────────────────────────────────
    const toast = document.createElement('div');
    toast.id        = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);

    // ── Loading screen ─────────────────────────────────────────────
    showLoadingScreen();

    // ── Registrar Service Worker (PWA) ───────────────────────────────
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/vivir-mejor/service-worker.js')
      .then(() => console.log('✅ Service Worker registrado'))
      .catch(err => console.warn('SW error:', err));
  }

  // ── Cargar estado local (sin uid por ahora; se recarga en onLoginSuccess) ────
    VM.state = VM.defaultState();

    // ── Inicializar Firebase Auth (escucha cambios de sesión) ──────
    // Esperamos que FB esté disponible (lo inyecta firebase-config.js)
    waitForFirebase(() => {
      AuthService.init();
      // Inicializar notificaciones push
      setTimeout(() => {
        if (typeof NotificationService !== 'undefined') {
          NotificationService.init().then(() => {
            // Programar recordatorios si ya tiene permiso
            if (Notification.permission === 'granted') {
              NotificationService.scheduleAllReminders();
            }
          });
        }
      }, 2000);
      setTimeout(() => {
        if (Router.current === 'loading' || !Router.current) {
          Router.go('welcome');
        }
      }, 3000);
    });
  }

  // ── Espera a que Firebase esté listo ──────────────────────────────
  function waitForFirebase(cb, tries = 0) {
    if (window.FB && window.FB.auth) {
      cb();
    } else if (tries < 30) {
      setTimeout(() => waitForFirebase(cb, tries + 1), 100);
    } else {
      // Sin Firebase: modo offline
      console.warn('Firebase no disponible, modo offline');
      Router.go('welcome');
    }
  }

  // ── Pantalla de carga inicial ─────────────────────────────────────
  function showLoadingScreen() {
    const screen = document.createElement('div');
    screen.id    = 'screen-loading';
    screen.className = 'screen active';
    screen.style.cssText = `
      display:flex;flex-direction:column;align-items:center;
      justify-content:center;min-height:100vh;background:var(--bg);
      position:absolute;top:0;left:0;right:0;bottom:0;z-index:99;
    `;
    screen.innerHTML = `
      <div style="width:72px;height:72px;border-radius:20px;
                  background:linear-gradient(135deg,var(--sage),var(--sky));
                  display:flex;align-items:center;justify-content:center;
                  font-size:36px;margin-bottom:20px;
                  box-shadow:0 8px 28px rgba(91,158,120,0.30);
                  animation:pulse 1.5s ease-in-out infinite">🌿</div>
      <div style="font-family:'Lora',serif;font-size:20px;color:var(--text-dark)">Vivir mejor</div>
      <div style="font-size:12px;color:var(--text-light);margin-top:6px">Cargando...</div>
      <style>
        @keyframes pulse {
          0%,100%{transform:scale(1);opacity:1}
          50%{transform:scale(1.06);opacity:0.85}
        }
      </style>
    `;
    document.getElementById('app').appendChild(screen);
    Router.current = 'loading';
  }

  // Eliminar pantalla de loading
  window.removeLoadingScreen = function() {
    const loading = document.getElementById('screen-loading');
    if (loading) {
      loading.style.opacity = '0';
      loading.style.transition = 'opacity 0.3s';
      setTimeout(() => loading.remove(), 300);
    }
  };

  // ── Agregar botón de logout en el header home ─────────────────────
  // (se llama desde home.js después del render)
  window.renderUserMenu = function() {
    const avatar = document.querySelector('.header-avatar');
    if (!avatar) return;
    avatar.style.cursor = 'pointer';
    avatar.title = 'Cerrar sesión';
    avatar.onclick = () => {
      if (confirm('¿Querés cerrar sesión?')) AuthService.logout();
    };
  };

  // ── Guardar hábitos del día en Firebase ──────────────────────────
  window.syncHabitsToCloud = async function() {
    const uid = FB?.auth?.currentUser?.uid;
    if (!uid) return;
    const s = VM.state;
    await UserService.saveHabits(uid, UserService.todayStr(), {
      sleep:    { bedtime: s.sleep.bedtime, wakeup: s.sleep.wakeup, hours: s.sleep.hoursToday },
      water:    { glasses: s.water.glasses },
      exercise: { done: s.exercise.weekDone, activity: s.exercise.selectedActivity },
      mood:     { value: s.mood.selected, note: s.mood.note },
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

})();
