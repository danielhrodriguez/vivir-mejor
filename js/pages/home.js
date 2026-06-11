/* ============================================================
   pages/home.js
   ============================================================ */

function getMedStatusText(s) {
  const meds = s.medications || [];
  if (meds.length === 0) return 'Sin medicamentos';
  const total = meds.reduce((a, m) => a + (m.times||[]).length, 0);
  const taken = meds.reduce((a, m) => a + (m.takenCount||0), 0);
  if (taken >= total) return '✓ Todos tomados';
  return `${taken}/${total} tomados`;
}

function getMedStatusColor(s) {
  const meds  = s.medications || [];
  if (meds.length === 0) return 'var(--text-mid)';
  const total = meds.reduce((a, m) => a + (m.times||[]).length, 0);
  const taken = meds.reduce((a, m) => a + (m.takenCount||0), 0);
  return taken >= total ? 'var(--sage)' : 'var(--amber)';
}

Router.register('home', () => {
  const s  = VM.state;
  const wd = s.water.goal > 0 ? Math.round((s.water.glasses / s.water.goal) * 100) : 0;
  const moodEmoji = s.mood.selected !== null ? s.mood.options[s.mood.selected] : '😊';
  const moodLabel = s.mood.selected !== null ? s.mood.labels[s.mood.selected] : 'Sin registrar';
  const exDays    = VM.exerciseDaysCount();

  return `
    <!-- HEADER -->
    <div class="header">
      <div>
        <div class="header-title">Vivir mejor 🌿</div>
        <div class="header-sub">${todayLabel()}</div>
      </div>
      <div class="header-avatar" onclick="toggleUserMenu()" id="user-avatar"
           style="cursor:pointer;position:relative">${s.userInitials}</div>
    </div>

    <!-- MENÚ DE USUARIO -->
    <div id="user-menu" style="display:none;position:fixed;top:60px;right:16px;z-index:50;
         background:var(--white);border-radius:var(--radius);box-shadow:0 8px 24px rgba(0,0,0,0.12);
         border:1px solid var(--border);min-width:200px;overflow:hidden">
      <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:var(--sage-light)">
        <div style="font-size:13px;font-weight:700;color:var(--text-dark)">${s.userName}</div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:2px">
          ${s.plan === 'premium' ? '⭐ Plan Premium' : '🆓 Plan Básico'}
        </div>
      </div>
      <button onclick="goTo('premium')"
              style="width:100%;padding:12px 16px;border:none;background:none;
                     text-align:left;cursor:pointer;font-family:'Nunito',sans-serif;
                     font-size:13px;color:var(--text-dark);display:flex;align-items:center;gap:8px;
                     border-bottom:1px solid var(--border)"
              onmouseover="this.style.background='var(--bg)'"
              onmouseout="this.style.background='none'">
        ⭐ Mi plan
      </button>
      <button onclick="goTo('reminders')"
              style="width:100%;padding:12px 16px;border:none;background:none;
                     text-align:left;cursor:pointer;font-family:'Nunito',sans-serif;
                     font-size:13px;color:var(--text-dark);display:flex;align-items:center;gap:8px;
                     border-bottom:1px solid var(--border)"
              onmouseover="this.style.background='var(--bg)'"
              onmouseout="this.style.background='none'">
        🔔 Recordatorios
      </button>
      ${FB.auth.currentUser && FB.auth.currentUser.uid === 'j2H13GvaCNUuIHCpFesET8W7q0y1' ? `
      <button onclick="Activation.openAdminPanel()"
              style="width:100%;padding:12px 16px;border:none;background:none;
                     text-align:left;cursor:pointer;font-family:'Nunito',sans-serif;
                     font-size:13px;color:var(--text-dark);display:flex;align-items:center;gap:8px;
                     border-bottom:1px solid var(--border)"
              onmouseover="this.style.background='var(--bg)'"
              onmouseout="this.style.background='none'">
        🔐 Panel admin
      </button>` : ''}
      <button onclick="confirmLogout()"
              style="width:100%;padding:12px 16px;border:none;background:none;
                     text-align:left;cursor:pointer;font-family:'Nunito',sans-serif;
                     font-size:13px;color:var(--peach);display:flex;align-items:center;gap:8px"
              onmouseover="this.style.background='var(--peach-light)'"
              onmouseout="this.style.background='none'">
        🚪 Cerrar sesión
      </button>
    </div>

    <!-- HERO -->
    <div class="hero-card">
      <div class="hero-greeting">Buenos días,</div>
      <div class="hero-name">${s.userName}</div>
      <div class="hero-streak">🔥 <span>${s.streak} días seguidos</span></div>
    </div>

    <div class="section-title">Hábitos de hoy</div>

    <!-- GRID DE HÁBITOS -->
    <div class="habits-grid">
      <button class="habit-card sleep" onclick="goTo('sleep')">
        <div class="habit-icon">😴</div>
        <div class="habit-name">Sueño</div>
        <div class="habit-value">${s.sleep.hoursToday}</div>
        <div class="habit-unit">horas anoche</div>
        <div class="habit-progress">
          <div class="habit-progress-fill" style="width:${Math.round((s.sleep.hoursToday/9)*100)}%"></div>
        </div>
      </button>

      <button class="habit-card water" onclick="goTo('water')">
        <div class="habit-icon">💧</div>
        <div class="habit-name">Hidratación</div>
        <div class="habit-value">${s.water.glasses}</div>
        <div class="habit-unit">de ${s.water.goal} vasos</div>
        <div class="habit-progress">
          <div class="habit-progress-fill" style="width:${wd}%"></div>
        </div>
      </button>

      <button class="habit-card exercise" onclick="goTo('exercise')">
        <div class="habit-icon">🏃</div>
        <div class="habit-name">Ejercicio</div>
        <div class="habit-value">${exDays}</div>
        <div class="habit-unit">días esta semana</div>
        <div class="habit-progress">
          <div class="habit-progress-fill" style="width:${Math.round((exDays/7)*100)}%"></div>
        </div>
      </button>

      <button class="habit-card mood" onclick="goTo('mood')">
        <div class="habit-icon">${moodEmoji}</div>
        <div class="habit-name">Estado de ánimo</div>
        <div class="habit-value" style="font-size:16px">${moodLabel}</div>
        <div class="habit-unit">check-in de hoy</div>
        <div class="habit-progress">
          <div class="habit-progress-fill" style="width:${s.mood.selected !== null ? Math.round(((s.mood.selected+1)/5)*100) : 0}%"></div>
        </div>
      </button>
    </div>

    <div class="section-title">Resumen del día</div>

    <button onclick="goTo('medications')"
            style="display:flex;align-items:center;justify-content:space-between;
                   padding:12px 16px;background:var(--white);border-radius:var(--radius-sm);
                   margin:0 16px 8px;border:1px solid var(--border);width:calc(100% - 32px);
                   cursor:pointer;font-family:'Nunito',sans-serif">
      <span style="font-size:13px;color:var(--text-mid)">💊 Medicamentos</span>
      <span style="font-size:13px;font-weight:700;color:${getMedStatusColor(s)}">
        ${getMedStatusText(s)} →
      </span>
    </button>
    <div class="info-row">
      <span class="info-row-label">🎯 Meta diaria</span>
      <span class="info-row-value">3 de 4 hábitos</span>
    </div>
    <div class="info-row">
      <span class="info-row-label">⚡ Racha actual</span>
      <span class="info-row-value">${s.streak} días 🔥</span>
    </div>
    <div style="height:20px"></div>
  `;
});

// ── Funciones del menú de usuario ─────────────────────────────────
function toggleUserMenu() {
  const menu = document.getElementById('user-menu');
  if (!menu) return;
  const isOpen = menu.style.display === 'block';
  menu.style.display = isOpen ? 'none' : 'block';
  // Cerrar al tocar fuera
  if (!isOpen) {
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!e.target.closest('#user-menu') && !e.target.closest('#user-avatar')) {
          menu.style.display = 'none';
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 10);
  }
}

function confirmLogout() {
  const menu = document.getElementById('user-menu');
  if (menu) menu.style.display = 'none';
  if (confirm('¿Querés cerrar sesión?')) {
    if (typeof AuthService !== 'undefined') {
      AuthService.logout();
    } else {
      Router.go('login');
    }
  }
}
