/* ============================================================
   data.js — Estado global y persistencia en localStorage
   ============================================================ */

const VM = {

  // ---------- Estado por defecto (usuario nuevo) ----------
  defaultState() {
    return {
      userName: '',
      userInitials: '',
      streak: 0,
      plan: 'basic',

      sleep: {
        bedtime: '23:00',
        wakeup: '07:00',
        hoursToday: 0,
        weekData: [0, 0, 0, 0, 0, 0, 0],
      },

      water: {
        glasses: 0,
        goal: 8,
        weekData: [0, 0, 0, 0, 0, 0, 0],
      },

      exercise: {
        weekDone: [false, false, false, false, false, false, false],
        selectedActivity: 'Caminata',
        activities: ['Caminata', 'Yoga', 'Gym', 'Bici', 'Natación', 'Correr'],
        history: [],
      },

      mood: {
        selected: null,
        options:  ['😔','😐','🙂','😊','😄'],
        labels:   ['Mal','Regular','Bien','Genial','Excelente'],
        weekData: [null, null, null, null, null, null, null],
        note: '',
      },

      reminders: [
        { icon: '😴', color: '#F0EDF8', name: 'Hora de dormir',      time: '22:30',        on: false },
        { icon: '💧', color: '#E8F3F8', name: 'Recordatorio de agua', time: 'Cada 2 horas', on: false },
        { icon: '🏃', color: '#EAF4EF', name: 'Ejercicio',            time: '07:00',        on: false },
        { icon: '💊', color: '#FBF3E3', name: 'Medicamentos',         time: '08:00',        on: false },
        { icon: '😊', color: '#FDF0E8', name: 'Check-in emocional',   time: '19:00',        on: false },
      ],

      meds: {
        taken: false,
        time: '08:00',
      },

      medications: [],
    };
  },

  // ---------- Estado de la app ----------
  state: null,

  // ---------- Persistencia ----------
  _storageKey(uid) {
    return uid ? 'vm_state_' + uid : null;
  },

  save(uid) {
    try {
      const key = this._storageKey(uid || this._currentUid);
      if (key) localStorage.setItem(key, JSON.stringify(this.state));
    } catch(e) {}
  },

  load(uid) {
    // Siempre inicializar con estado limpio por defecto
    this.state = this.defaultState();
    this._currentUid = uid || null;
    try {
      const key = this._storageKey(uid);
      const saved = key ? localStorage.getItem(key) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = Object.assign({}, this.state, parsed);
        ['sleep','water','exercise','mood','meds'].forEach(k => {
          if (parsed[k]) this.state[k] = Object.assign({}, this.defaultState()[k], parsed[k]);
        });
        if (parsed.medications) this.state.medications = parsed.medications;
        if (parsed.reminders)   this.state.reminders   = parsed.reminders;
      }
    } catch(e) {}
  },

  clearUserData(uid) {
    try {
      const key = this._storageKey(uid);
      if (key) localStorage.removeItem(key);
    } catch(e) {}
  },

  // ---------- Reseteo semanal automático ----------
  // Guarda la semana anterior en el historial y resetea los datos semanales
  checkWeeklyReset(uid) {
    try {
      const today      = new Date();
      const dayOfWeek  = today.getDay(); // 0=Dom … 6=Sab
      const isMonday   = dayOfWeek === 1;

      // Clave para recordar el último lunes procesado
      const resetKey = 'vm_last_reset_' + (uid || 'anon');
      const lastReset = localStorage.getItem(resetKey);

      // Obtener el lunes de esta semana (YYYY-MM-DD)
      const monday = new Date(today);
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      const mondayStr = monday.toISOString().split('T')[0];

      // Si ya se reseteó esta semana, no hacer nada
      if (lastReset === mondayStr) return;

      // Guardar semana anterior en el historial antes de resetear
      const weekLabel = mondayStr;
      if (!this.state.history) this.state.history = [];

      const avgSleep = this.state.sleep.weekData.filter(v => v > 0);
      const avgSleepVal = avgSleep.length
        ? parseFloat((avgSleep.reduce((a,b) => a+b, 0) / avgSleep.length).toFixed(1))
        : 0;

      this.state.history.unshift({
        week:        weekLabel,
        sleep:       avgSleepVal,
        water:       [...this.state.water.weekData],
        exercise:    [...this.state.exercise.weekDone],
        mood:        [...this.state.mood.weekData],
      });

      // Mantener máximo 12 semanas de historial
      if (this.state.history.length > 12) this.state.history = this.state.history.slice(0, 12);

      // Resetear datos semanales a cero
      this.state.sleep.weekData      = [0, 0, 0, 0, 0, 0, 0];
      this.state.sleep.hoursToday    = 0;
      this.state.water.weekData      = [0, 0, 0, 0, 0, 0, 0];
      this.state.water.glasses       = 0;
      this.state.exercise.weekDone   = [false, false, false, false, false, false, false];
      this.state.mood.weekData       = [null, null, null, null, null, null, null];
      this.state.mood.selected       = null;
      this.state.mood.note           = '';

      // Guardar estado reseteado y marcar el lunes procesado
      this.save(uid);
      localStorage.setItem(resetKey, mondayStr);

      console.log('✅ Reseteo semanal realizado para la semana:', mondayStr);
    } catch(e) {
      console.error('Error en checkWeeklyReset:', e);
    }
  },

  // ---------- Helpers ----------
  calcSleepHours(bedtime, wakeup) {
    const [bh, bm] = bedtime.split(':').map(Number);
    const [wh, wm] = wakeup.split(':').map(Number);
    let mins = (wh * 60 + wm) - (bh * 60 + bm);
    if (mins < 0) mins += 1440;
    return parseFloat((mins / 60).toFixed(1));
  },

  sleepQualityLabel(hours) {
    if (hours >= 8)  return { emoji: '😴', text: 'Descanso excelente', color: 'var(--lavender)' };
    if (hours >= 7)  return { emoji: '😊', text: 'Muy buen descanso',  color: 'var(--sage)' };
    if (hours >= 6)  return { emoji: '🙂', text: 'Descanso aceptable', color: 'var(--amber)' };
    return             { emoji: '😔', text: 'Poco descanso',       color: 'var(--peach)' };
  },

  waterPercent() {
    return Math.round((this.state.water.glasses / this.state.water.goal) * 100);
  },

  weekDayLabels() {
    return ['L','M','X','J','V','S','D'];
  },

  exerciseDaysCount() {
    return this.state.exercise.weekDone.filter(Boolean).length;
  },
};
