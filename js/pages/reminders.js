/* ============================================================
   pages/reminders.js — Recordatorios con notificaciones push
   ============================================================ */
Router.register('reminders', () => {
  const isPremium = typeof Activation !== 'undefined' && Activation.isPremiumActive();
  const notifGranted = ('Notification' in window) && Notification.permission === 'granted';

  const rows = VM.state.reminders.map((r, i) => `
    <div class="reminder-row">
      <div class="reminder-left">
        <div class="reminder-icon" style="background:${r.color}">${r.icon}</div>
        <div>
          <div class="rem-name">${r.name}</div>
          <div class="rem-time">${r.time}</div>
        </div>
      </div>
      <button class="toggle ${r.on ? 'on' : ''}"
              onclick="toggleReminder(${i})"
              aria-label="${r.on ? 'Desactivar' : 'Activar'} ${r.name}">
      </button>
    </div>
  `).join('');

  return `
    <div class="header">
      <div class="header-title">Recordatorios</div>
    </div>

    <!-- BANNER ESTADO NOTIFICACIONES -->
    <div id="notif-banner" style="margin:12px 16px 0;padding:12px 16px;border-radius:var(--radius-sm);
         background:${notifGranted ? 'var(--sage-light)' : 'var(--amber-light)'};
         border:1px solid ${notifGranted ? 'var(--sage-mid)' : '#EED4A0'};
         display:flex;align-items:center;gap:10px">
      <span style="font-size:22px">${notifGranted ? '🔔' : '🔕'}</span>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:700;color:${notifGranted ? 'var(--sage)' : 'var(--amber)'}">
          ${notifGranted ? 'Notificaciones activadas ✅' : 'Notificaciones desactivadas'}
        </div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:2px">
          ${notifGranted
            ? 'Recibirás alertas aunque la app esté cerrada'
            : 'Activálas para recibir recordatorios en tu teléfono'}
        </div>
      </div>
      ${!notifGranted ? `
        <button onclick="enableNotifications()"
                style="padding:7px 14px;border-radius:20px;background:var(--amber);
                       border:none;color:#fff;font-size:11px;font-weight:700;
                       cursor:pointer;font-family:'Nunito',sans-serif;white-space:nowrap">
          Activar
        </button>` : `
        <button onclick="testNotification()"
                style="padding:7px 14px;border-radius:20px;background:var(--sage);
                       border:none;color:#fff;font-size:11px;font-weight:700;
                       cursor:pointer;font-family:'Nunito',sans-serif;white-space:nowrap">
          Probar
        </button>`}
    </div>

    <div style="padding:12px 16px 4px;font-size:12px;color:var(--text-mid)">
      Configurá tus notificaciones personalizadas
    </div>

    <div id="reminders-list">${rows}</div>

    <!-- AGREGAR RECORDATORIO -->
    <div style="padding:8px 16px 12px">
      <button class="btn-primary" onclick="${isPremium ? 'showAddReminder()' : 'goTo(\'premium\')'}">
        <i class="ti ti-plus"></i>
        ${isPremium ? 'Agregar recordatorio' : '🔒 Agregar recordatorio (Premium)'}
      </button>
    </div>

    <!-- MODAL AGREGAR (solo Premium) -->
    <div id="add-reminder-modal" style="display:none;position:fixed;inset:0;
         background:rgba(0,0,0,0.4);z-index:100;align-items:flex-end">
      <div style="background:var(--white);border-radius:20px 20px 0 0;padding:24px;width:100%">
        <div style="font-size:16px;font-weight:700;color:var(--text-dark);margin-bottom:16px">
          ➕ Nuevo recordatorio
        </div>
        <div class="form-group" style="margin-bottom:12px">
          <label class="form-label">Nombre</label>
          <input type="text" id="new-rem-name" class="form-input" placeholder="Ej: Vitaminas"
                 onfocus="focusField(this)" onblur="blurField(this)">
        </div>
        <div class="form-group" style="margin-bottom:12px">
          <label class="form-label">Hora</label>
          <input type="time" id="new-rem-time" class="form-input" value="08:00">
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn-outline" style="flex:1" onclick="closeAddReminder()">Cancelar</button>
          <button class="btn-primary" style="flex:1" onclick="saveNewReminder()">Guardar</button>
        </div>
      </div>
    </div>

    <!-- BANNER PREMIUM -->
    <div class="lavender-banner" style="${isPremium ? 'display:none' : ''}">
      <div class="lavender-banner-title">✨ Plan Premium</div>
      <div class="lavender-banner-sub">
        Recordatorios ilimitados y personalizados con notificaciones push.
        <br><button onclick="goTo('premium')"
                    style="background:none;border:none;color:var(--lavender);font-weight:700;
                           font-size:11px;cursor:pointer;padding:4px 0 0;font-family:'Nunito',sans-serif">
          Ver planes →
        </button>
      </div>
    </div>
  <div style="height:20px"></div>
  `;
});

// ── Funciones de recordatorios ─────────────────────────────────────

function toggleReminder(i) {
  VM.state.reminders[i].on = !VM.state.reminders[i].on;
  VM.save();
  const toggles = document.querySelectorAll('#reminders-list .toggle');
  if (toggles[i]) toggles[i].classList.toggle('on', VM.state.reminders[i].on);
  showToast(VM.state.reminders[i].on ? '🔔 Recordatorio activado' : '🔕 Recordatorio desactivado');
  // Reprogramar
  if (typeof NotificationService !== 'undefined') NotificationService.scheduleAllReminders();
}

async function enableNotifications() {
  if (!('Notification' in window)) {
    showToast('⚠️ Tu navegador no soporta notificaciones');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    showToast('🔔 ¡Notificaciones activadas!');
    scheduleLocalReminders();
    Router.go('reminders');
  } else {
    showToast('🔕 Permiso denegado. Activálas desde la configuración del navegador');
  }
}

function scheduleLocalReminders() {
  if (Notification.permission !== 'granted') return;
  const reminders = VM.state.reminders;
  const now = new Date();
  reminders.forEach(r => {
    if (!r.on || !r.time || r.time.includes('/') || !r.time.includes(':')) return;
    const [h, m] = r.time.split(':').map(Number);
    const target = new Date(now);
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const delay = target - now;
    setTimeout(() => {
      try {
        new Notification(`⏰ ${r.name}`, {
          body: `Es hora de registrar: ${r.name}`,
          icon: '/vivir-mejor/assets/icon-192.png',
        });
      } catch(e) {
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
    }, delay);
  });
}

async function testNotification() {
  if (!('Notification' in window)) {
    showToast('⚠️ Tu navegador no soporta notificaciones');
    return;
  }

  if (Notification.permission !== 'granted') {
    showToast('⚠️ Primero activá las notificaciones');
    return;
  }

  try {
    // Método 1: Service Worker (Chrome móvil)
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification('🌿 Vivir Mejor', {
          body:    '¡Las notificaciones funcionan correctamente! 🎉',
          icon:    '/vivir-mejor/assets/icon-192.png',
          badge:   '/vivir-mejor/assets/icon-72.png',
          vibrate: [200, 100, 200],
          tag:     'test-notification',
        });
        showToast('✅ ¡Notificación enviada!');
        return;
      }
    }
    // Método 2: Notificación directa (fallback)
    const n = new Notification('🌿 Vivir Mejor', {
      body: '¡Las notificaciones funcionan correctamente! 🎉',
      icon: '/vivir-mejor/assets/icon-192.png',
    });
    n.onclick = () => window.focus();
    showToast('✅ Notificación enviada');
  } catch(err) {
    // Método 3: Toast visual como último recurso
    showToast('🔔 Recordatorio: ¡Es hora de registrar tus hábitos!');
    // Vibración si disponible
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  }
}

function showAddReminder() {
  const modal = document.getElementById('add-reminder-modal');
  if (modal) modal.style.display = 'flex';
}

function closeAddReminder() {
  const modal = document.getElementById('add-reminder-modal');
  if (modal) modal.style.display = 'none';
}

function saveNewReminder() {
  const name = document.getElementById('new-rem-name')?.value.trim();
  const time = document.getElementById('new-rem-time')?.value;
  if (!name) { showToast('⚠️ Ingresá un nombre'); return; }
  VM.state.reminders.push({ icon: '⏰', color: '#EAF4EF', name, time, on: true });
  VM.save();
  closeAddReminder();
  showToast('✅ Recordatorio guardado');
  if (typeof NotificationService !== 'undefined') NotificationService.scheduleAllReminders();
  Router.go('reminders');
}
