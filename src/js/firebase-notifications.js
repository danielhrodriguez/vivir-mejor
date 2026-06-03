/* ============================================================
   firebase-notifications.js — Sistema de notificaciones push
   Usa Firebase Cloud Messaging (FCM)

   Flujo:
   1. Usuario abre la app → pedimos permiso
   2. Si acepta → obtenemos su FCM token
   3. Guardamos el token en Firestore (users/{uid}/fcmToken)
   4. Desde el admin podés enviar notificaciones a todos
      o a un usuario específico usando ese token
   ============================================================ */

const NotificationService = {

  vapidKey: null, // Se carga desde Firebase Console
  messaging: null,

  // ── Inicializar FCM ──────────────────────────────────────────────
  async init() {
    try {
      // Importar messaging de Firebase
      const { getMessaging, getToken, onMessage } = await import(
        'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js'
      );
      this.messaging = getMessaging(window.firebaseApp || firebase.app());

      // Escuchar notificaciones con app abierta
      onMessage(this.messaging, payload => {
        console.log('📬 Notificación recibida (foreground):', payload);
        this.showInAppNotification(payload.notification);
      });

      return true;
    } catch (err) {
      console.warn('FCM no disponible:', err.message);
      return false;
    }
  },

  // ── Solicitar permiso y obtener token ────────────────────────────
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        showToast('🔕 Notificaciones desactivadas');
        return null;
      }

      const { getMessaging, getToken } = await import(
        'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js'
      );
      const messaging = getMessaging();

      // VAPID key desde Firebase Console → Configuración del proyecto
      // → Cloud Messaging → Web Push certificates → Key pair
      // Por ahora usamos una key de ejemplo, reemplazala con la tuya
      const token = await getToken(messaging, {
        vapidKey: 'BlzWgzjHBMzepCcpgqa-oKfvMDblaLTSG4naYZJb2t21WZRbiGQuT9HohmpQVg-cObRhRUdBAvUOqp-wgg3-_HY',
        serviceWorkerRegistration: await navigator.serviceWorker.ready,
      });

      if (token) {
        console.log('✅ FCM Token:', token);
        await this.saveToken(token);
        return token;
      }
      return null;
    } catch (err) {
      console.error('Error al obtener token FCM:', err);
      return null;
    }
  },

  // ── Guardar token en Firestore ───────────────────────────────────
  async saveToken(token) {
    const uid = FB?.auth?.currentUser?.uid;
    if (!uid) return;
    try {
      await FB.updateDoc(FB.doc(FB.db, 'users', uid), {
        fcmToken:      token,
        fcmUpdatedAt:  FB.serverTimestamp(),
        notificationsEnabled: true,
      });
    } catch(e) {
      console.warn('No se pudo guardar token FCM:', e);
    }
  },

  // ── Notificación visual dentro de la app (foreground) ───────────
  showInAppNotification(notification) {
    if (!notification) return;
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
      background: white; border-radius: 14px; padding: 14px 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15); z-index: 300;
      max-width: 340px; width: calc(100% - 32px);
      display: flex; align-items: center; gap: 12px;
      border-left: 4px solid var(--sage);
      animation: slideDown 0.3s ease-out;
    `;
    el.innerHTML = `
      <div style="font-size:28px">${this._habitEmoji(notification.title)}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:700;color:#3A4A42">${notification.title}</div>
        <div style="font-size:12px;color:#6B7C74;margin-top:2px">${notification.body}</div>
      </div>
      <button onclick="this.parentElement.remove()"
              style="background:none;border:none;font-size:18px;color:#A0AFA8;cursor:pointer">×</button>
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  },

  _habitEmoji(title = '') {
    if (title.includes('sueño') || title.includes('Sueño')) return '😴';
    if (title.includes('agua')  || title.includes('Agua'))  return '💧';
    if (title.includes('ejercicio') || title.includes('Ejercicio')) return '🏃';
    if (title.includes('medicamento') || title.includes('Medicamento')) return '💊';
    if (title.includes('ánimo') || title.includes('emocional')) return '😊';
    return '🌿';
  },

  // ── Programar notificaciones locales (sin servidor) ──────────────
  // Para recordatorios simples que no necesitan server
  scheduleLocalNotification(title, body, delayMs) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    setTimeout(() => {
      new Notification(title, {
        body,
        icon:  '/assets/icon-192.png',
        badge: '/assets/icon-72.png',
        tag:   'vivir-mejor-reminder',
      });
    }, delayMs);
  },

  // ── Programar todos los recordatorios del día ────────────────────
  scheduleAllReminders() {
    if (Notification.permission !== 'granted') return;
    const reminders = VM.state.reminders;
    const now       = new Date();

    reminders.forEach(r => {
      if (!r.on) return;

      // Solo recordatorios con hora fija (no "cada X horas")
      if (!r.time.includes(':') || r.time.includes('/')) {
        // Para medicamentos con dos horarios
        if (r.time.includes('/')) {
          r.time.split('/').forEach(t => this._scheduleAtTime(r, t.trim(), now));
        }
        return;
      }
      this._scheduleAtTime(r, r.time, now);
    });
  },

  _scheduleAtTime(reminder, timeStr, now) {
    const [h, m] = timeStr.split(':').map(Number);
    const target = new Date(now);
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1); // Mañana si ya pasó
    const delay = target - now;
    this.scheduleLocalNotification(
      `⏰ ${reminder.name}`,
      `Es hora de registrar tu ${reminder.name.toLowerCase()}`,
      delay
    );
    console.log(`🔔 Recordatorio "${reminder.name}" programado en ${Math.round(delay/60000)} min`);
  },
};
