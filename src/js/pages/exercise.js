/* ============================================================
   pages/exercise.js
   ============================================================ */
Router.register('exercise', () => {
  const ex      = VM.state.exercise;
  const dayLabels = ['L','M','X','J','V','S','D'];
  const todayIdx  = todayWeekIndex();

  const weekDots = dayLabels.map((d, i) => {
    const done    = ex.weekDone[i];
    const isToday = i === todayIdx;
    return `
      <div class="week-dot">
        <div class="day-circle ${done ? 'done' : ''} ${isToday && !done ? 'today' : ''}"
             onclick="toggleExerciseDay(${i})" role="button" aria-label="Día ${d}">
          ${done ? '<i class="ti ti-check" style="font-size:13px;pointer-events:none"></i>' : ''}
        </div>
        <div class="week-dot-label">${d}</div>
      </div>`;
  }).join('');

  const chips = ex.activities.map(a =>
    `<button class="chip ${a === ex.selectedActivity ? 'selected' : ''}"
             onclick="selectExActivity('${a}')">${a}</button>`
  ).join('');

  const historyRows = ex.history.map(e =>
    `<div class="info-row" style="margin:0 0 8px">
      <span class="info-row-label">${e.day} · ${e.activity}</span>
      <span class="info-row-value">${e.duration}</span>
    </div>`
  ).join('');

  return `
    <div class="header">
      <div style="display:flex;align-items:center">
        <button class="header-back" onclick="Router.back()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
        <div class="header-title">Ejercicio</div>
      </div>
    </div>

    <div style="margin:16px;background:var(--sage-light);border-radius:var(--radius);padding:24px;text-align:center">
      <div class="big-number" style="color:var(--sage)" id="ex-days-count">${VM.exerciseDaysCount()}</div>
      <div class="big-label">días entrenados esta semana</div>
    </div>

    <div class="section-title">Esta semana</div>
    <div class="week-dots" id="week-dots-row">${weekDots}</div>

    <div class="section-title">Tipo de actividad</div>
    <div class="chips-row" id="chips-row">${chips}</div>

    <div style="padding:0 16px 16px">
      <button class="btn-primary" id="log-ex-btn" onclick="logExerciseToday()">
        <i class="ti ti-plus"></i> Registrar entrenamiento hoy
      </button>
    </div>

    <div class="section-title">Historial reciente</div>
    <div id="exercise-history">${historyRows}</div>
  <div style="height:20px"></div>
  `;
});

function toggleExerciseDay(i) {
  VM.state.exercise.weekDone[i] = !VM.state.exercise.weekDone[i];
  VM.save();
  refreshExercisePage();
}

function selectExActivity(a) {
  VM.state.exercise.selectedActivity = a;
  VM.save();
  // Refrescar chips
  document.querySelectorAll('#chips-row .chip').forEach(c => {
    c.classList.toggle('selected', c.textContent === a);
  });
}

function logExerciseToday() {
  const idx = todayWeekIndex();
  VM.state.exercise.weekDone[idx] = true;
  VM.state.exercise.history.unshift({
    day:      'Hoy',
    activity: VM.state.exercise.selectedActivity,
    duration: '30 min',
  });
  VM.save();
  refreshExercisePage();
  showToast('🏃 ¡Entrenamiento registrado!');
}

function refreshExercisePage() {
  // Re-render sólo la semana y el contador
  Router.go('exercise');
}
