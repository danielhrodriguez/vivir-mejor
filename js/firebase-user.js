/* ============================================================
   firebase-user.js — Servicio de perfiles de usuario
   Maneja lectura/escritura del perfil en Firestore.

   Estructura en Firestore:
   users/{uid}/
     ├── displayName: string
     ├── email: string
     ├── plan: 'basic' | 'premium'
     ├── premiumSince: timestamp | null
     ├── premiumEnds: timestamp | null
     ├── whatsapp: string | null
     ├── createdAt: timestamp
     └── lastSeen: timestamp

   users/{uid}/habits/{date}/
     ├── sleep: { bedtime, wakeup, hours }
     ├── water: { glasses }
     ├── exercise: { done, activity, duration }
     └── mood: { value, note }
   ============================================================ */

const UserService = {

  // ── Obtener perfil ───────────────────────────────────────────────
  async getProfile(uid) {
    try {
      const ref  = FB.doc(FB.db, 'users', uid);
      const snap = await FB.getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      console.error('getProfile error:', err);
      return null;
    }
  },

  // ── Crear perfil nuevo ───────────────────────────────────────────
  async createProfile(user, extra = {}) {
    try {
      const ref  = FB.doc(FB.db, 'users', user.uid);
      const data = {
        uid:         user.uid,
        displayName: extra.displayName || user.displayName || 'Usuario',
        email:       user.email,
        whatsapp:    extra.whatsapp || null,
        plan:        'basic',
        premiumSince: null,
        premiumEnds:  null,
        createdAt:   FB.serverTimestamp(),
        lastSeen:    FB.serverTimestamp(),
      };
      await FB.setDoc(ref, data);
      return data;
    } catch (err) {
      console.error('createProfile error:', err);
      return null;
    }
  },

  // ── Crear o actualizar si ya existe ─────────────────────────────
  async ensureProfile(user) {
    const existing = await this.getProfile(user.uid);
    if (!existing) {
      return await this.createProfile(user);
    }
    // Actualizar lastSeen
    try {
      await FB.updateDoc(FB.doc(FB.db, 'users', user.uid), {
        lastSeen: FB.serverTimestamp(),
      });
    } catch(e) {}
    return existing;
  },

  // ── Actualizar plan a Premium ────────────────────────────────────
  async activatePremium(uid, durationDays = 30) {
    try {
      const now     = Date.now();
      const endsAt  = now + (durationDays * 24 * 60 * 60 * 1000);
      await FB.updateDoc(FB.doc(FB.db, 'users', uid), {
        plan:         'premium',
        premiumSince: FB.serverTimestamp(),
        premiumEnds:  endsAt,
      });
      VM.state.plan        = 'premium';
      VM.state.premiumEnds = endsAt;
      VM.save();
      return { ok: true, endsAt };
    } catch (err) {
      console.error('activatePremium error:', err);
      return { ok: false };
    }
  },

  // ── Guardar hábitos del día ──────────────────────────────────────
  async saveHabits(uid, dateStr, habitData) {
    try {
      const ref = FB.doc(FB.db, 'users', uid, 'habits', dateStr);
      await FB.setDoc(ref, {
        ...habitData,
        updatedAt: FB.serverTimestamp(),
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('saveHabits error:', err);
      return false;
    }
  },

  // ── Obtener hábitos de un día ────────────────────────────────────
  async getHabits(uid, dateStr) {
    try {
      const ref  = FB.doc(FB.db, 'users', uid, 'habits', dateStr);
      const snap = await FB.getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      console.error('getHabits error:', err);
      return null;
    }
  },

  // ── Obtener últimos N días de hábitos ────────────────────────────
  async getHabitsRange(uid, days = 7) {
    const results = {};
    const today   = new Date();
    for (let i = 0; i < days; i++) {
      const d   = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0]; // YYYY-MM-DD
      const data = await this.getHabits(uid, key);
      if (data) results[key] = data;
    }
    return results;
  },

  // ── Fecha de hoy como string ─────────────────────────────────────
  todayStr() {
    return new Date().toISOString().split('T')[0];
  },
};
