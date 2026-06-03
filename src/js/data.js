/* ============================================================
   data.js — Estado global y persistencia en localStorage
   ============================================================ */

const VM = {

  // ---------- Estado de la app ----------
  state: {
    userName: 'Ana Martínez',
    userInitials: 'AM',
    streak: 7,
    plan: 'basic', // 'basic' | 'premium'

    sleep: {
      bedtime: '23:00',
      wakeup: '06:30',
      hoursToday: 7.5,
      weekData: [6.5, 7.0, 8.0, 7.5, 6.0, 7.5, 7.2],
    },

    water: {
      glasses: 5,
      goal: 8,
      weekData: [5, 7, 6, 8, 4, 6, 5],
    },

    exercise: {
      weekDone: [true, false, true, true, false, true, false],
      selectedActivity: 'Caminata',
      activities: ['Caminata', 'Yoga', 'Gym', 'Bici', 'Natación', 'Correr'],
      history: [
        { day: 'Ayer',   activity: 'Gym',    duration: '45 min' },
        { day: 'Lunes',  activity: 'Correr', duration: '30 min' },
        { day: 'Domingo', activity: 'Yoga',  duration: '60 min' },
      ],
    },

    mood: {
      selected: 3,
      options:  ['😔','😐','🙂','😊','😄'],
      labels:   ['Mal','Regular','Bien','Genial','Excelente'],
      weekData: ['😊','😔','😄','🙂','😊','😄','😊'],
      note: '',
    },

    reminders: [
      { icon: '😴', color: '#F0EDF8', name: 'Hora de dormir',      time: '22:30',        on: true  },
      { icon: '💧', color: '#E8F3F8', name: 'Recordatorio de agua', time: 'Cada 2 horas', on: true  },
      { icon: '🏃', color: '#EAF4EF', name: 'Ejercicio',            time: '07:00',        on: false },
      { icon: '💊', color: '#FBF3E3', name: 'Medicamentos',         time: '08:00 / 20:00',on: true  },
      { icon: '😊', color: '#FDF0E8', name: 'Check-in emocional',   time: '19:00',        on: true  },
    ],

    meds: {
      taken: true,
      time: '08:00',
    },

    medications: [
      {
        name: 'Ejemplo: Losartán',
        dose: '50mg',
        frequency: '1 vez por día',
        times: ['08:00'],
        icon: '💊',
        color: '#F0EDF8',
        notes: 'Tomar con el desayuno',
        reminder: true,
        takenCount: 0,
        takenTimes: [],
        createdAt: new Date().toISOString(),
      }
    ],
  },

  // ---------- Persistencia ----------
  save() {
    try { localStorage.setItem('vm_state', JSON.stringify(this.state)); } catch(e) {}
  },

  load() {
    try {
      const saved = localStorage.getItem('vm_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge profundo para no perder keys nuevas
        this.state = Object.assign({}, this.state, parsed);
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
