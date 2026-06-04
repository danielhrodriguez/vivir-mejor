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
  save() {
    try { localStorage.setItem('vm_state', JSON.stringify(this.state)); } catch(e) {}
  },

  load() {
    // Siempre inicializar con estado limpio por defecto
    this.state = this.defaultState();
    try {
      const saved = localStorage.getItem('vm_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge para no perder keys nuevas pero respetando datos guardados
        this.state = Object.assign({}, this.state, parsed);
        // Merge de objetos anidados
        ['sleep','water','exercise','mood','meds'].forEach(key => {
          if (parsed[key]) this.state[key] = Object.assign({}, this.defaultState()[key], parsed[key]);
        });
        if (parsed.medications) this.state.medications = parsed.medications;
        if (parsed.reminders)   this.state.reminders   = parsed.reminders;
      }
    } catch(e) {}
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
