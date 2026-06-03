/* ============================================================
   firebase-subscriptions.js — Gestión de suscripciones y códigos
   en Firestore (reemplaza el sistema localStorage de activation.js)

   Colecciones en Firestore:
   activation_codes/{code}/
     ├── createdAt: timestamp
     ├── expiresAt: number (ms)
     ├── subEnds:   number (ms)
     ├── durationDays: number
     ├── used:      boolean
     ├── usedAt:    timestamp | null
     ├── usedBy:    uid | null

   subscribers/{uid}/  (registro de quién pagó)
     ├── name, email, whatsapp
     ├── status: 'pending' | 'activated'
     ├── code:   string | null
     ├── registeredAt: timestamp
   ============================================================ */

const SubscriptionService = {

  CODE_PREFIX: 'VM',

  // ─────────────────────────────────────────────────────────────────
  //  GENERACIÓN DE CÓDIGOS (panel admin)
  // ─────────────────────────────────────────────────────────────────

  generateCodeString() {
    const p1   = Math.random().toString(36).substr(2, 4).toUpperCase();
    const p2   = Math.random().toString(36).substr(2, 4).toUpperCase();
    const year = new Date().getFullYear();
    return `${this.CODE_PREFIX}-${p1}-${p2}-${year}`;
  },

  async createCode(durationDays = 30) {
    const code    = this.generateCodeString();
    const now     = Date.now();
    const data    = {
      code,
      createdAt:    FB.serverTimestamp(),
      expiresAt:    now + (7  * 24 * 60 * 60 * 1000),  // 7 días para usar el código
      subEnds:      now + (durationDays * 24 * 60 * 60 * 1000),
      durationDays,
      used:         false,
      usedAt:       null,
      usedBy:       null,
    };
    try {
      await FB.setDoc(FB.doc(FB.db, 'activation_codes', code), data);
      return { ok: true, code, data };
    } catch (err) {
      console.error('createCode error:', err);
      // Fallback a localStorage si no hay conexión
      Activation.saveCode(code, durationDays);
      return { ok: true, code, data, offline: true };
    }
  },

  // ─────────────────────────────────────────────────────────────────
  //  VALIDACIÓN (el usuario activa su Premium)
  // ─────────────────────────────────────────────────────────────────

  async validateAndActivate(inputCode) {
    const code = inputCode.trim().toUpperCase();
    const uid  = FB.auth.currentUser?.uid;

    if (!uid) return { ok: false, msg: 'Necesitás iniciar sesión para activar el código.' };

    try {
      const ref  = FB.doc(FB.db, 'activation_codes', code);
      const snap = await FB.getDoc(ref);

      // Verificar en Firestore
      if (snap.exists()) {
        const data = snap.data();
        if (data.used)                    return { ok: false, msg: 'Este código ya fue utilizado.' };
        if (Date.now() > data.expiresAt)  return { ok: false, msg: 'Este código venció. Contactá al soporte.' };

        // Marcar como usado
        await FB.updateDoc(ref, {
          used:   true,
          usedAt: FB.serverTimestamp(),
          usedBy: uid,
        });

        // Activar Premium en el perfil
        const result = await UserService.activatePremium(uid, data.durationDays || 30);

        // Actualizar suscriptor a "activado"
        await this._markSubscriberActivated(uid, code);

        return { ok: true, endsAt: data.subEnds };
      }

      // Fallback: verificar en localStorage (modo offline)
      const localResult = Activation.validateCode(code);
      if (localResult.ok) {
        await UserService.activatePremium(uid, 30);
        return localResult;
      }

      return { ok: false, msg: 'Código inválido. Verificá que lo hayas copiado correctamente.' };

    } catch (err) {
      console.error('validateAndActivate error:', err);
      // Si falla Firestore, intentar localmente
      const localResult = Activation.validateCode(code);
      if (localResult.ok) await UserService.activatePremium(uid, 30);
      return localResult.ok
        ? localResult
        : { ok: false, msg: 'Error de conexión. Revisá tu internet e intentá de nuevo.' };
    }
  },

  // ─────────────────────────────────────────────────────────────────
  //  SUSCRIPTORES (formulario pre-checkout)
  // ─────────────────────────────────────────────────────────────────

  async saveSubscriber(data) {
    try {
      await FB.addDoc(FB.collection(FB.db, 'subscribers'), {
        ...data,
        status:       'pending',
        code:         null,
        registeredAt: FB.serverTimestamp(),
      });
      // También guardar en localStorage como backup
      const pending = JSON.parse(localStorage.getItem('vm_pending') || '[]');
      pending.unshift({ ...data, status: 'pending', date: new Date().toISOString() });
      localStorage.setItem('vm_pending', JSON.stringify(pending));
      return { ok: true };
    } catch (err) {
      console.error('saveSubscriber error:', err);
      // Fallback localStorage
      const pending = JSON.parse(localStorage.getItem('vm_pending') || '[]');
      pending.unshift({ ...data, status: 'pending', date: new Date().toISOString() });
      localStorage.setItem('vm_pending', JSON.stringify(pending));
      return { ok: true, offline: true };
    }
  },

  async getPendingSubscribers() {
    try {
      const q    = FB.query(
        FB.collection(FB.db, 'subscribers'),
        FB.where('status', '==', 'pending')
      );
      const snap = await FB.getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('getPendingSubscribers error:', err);
      // Fallback localStorage
      return JSON.parse(localStorage.getItem('vm_pending') || '[]')
        .filter(s => s.status === 'pending');
    }
  },

  async getAllSubscribers() {
    try {
      const snap = await FB.getDocs(FB.collection(FB.db, 'subscribers'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      return JSON.parse(localStorage.getItem('vm_pending') || '[]');
    }
  },

  async _markSubscriberActivated(uid, code) {
    try {
      // Buscar suscriptor por uid o actualizar todos los pending
      const q    = FB.query(FB.collection(FB.db, 'subscribers'), FB.where('status', '==', 'pending'));
      const snap = await FB.getDocs(q);
      snap.docs.forEach(async d => {
        await FB.updateDoc(d.ref, { status: 'activated', code, activatedAt: FB.serverTimestamp() });
      });
    } catch(e) {}
  },

  // ─────────────────────────────────────────────────────────────────
  //  OBTENER TODOS LOS CÓDIGOS (panel admin)
  // ─────────────────────────────────────────────────────────────────

  async getAllCodes() {
    try {
      const snap = await FB.getDocs(FB.collection(FB.db, 'activation_codes'));
      return snap.docs.map(d => ({ code: d.id, ...d.data() }));
    } catch (err) {
      // Fallback localStorage
      const local = Activation.getSavedCodes();
      return Object.entries(local).map(([code, data]) => ({ code, ...data }));
    }
  },
};
