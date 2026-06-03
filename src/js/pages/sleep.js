/* ============================================================
   pages/sleep.js
   ============================================================ */
Router.register('sleep', () => {
  const sl = VM.state.sleep;
  const q  = VM.sleepQualityLabel(sl.hoursToday);
  return `
    <div class="header">
      <div style="display:flex;align-items:center">
        <button class="header-back" onclick="Router.back()">←</button>
        <div class="header-title">Registro de sueño</div>
      </div>
    </div>

    <div class="sleep-hero">
      <div class="big-number" id="sleep-display" style="color:var(--lavender)">${sl.hoursToday}</div>
      <div class="big-label">horas de sueño</div>
      <div class="big-badge" style="background:rgba(155,142,196,0.15);color:var(--lavender);margin-top:12px">
        ${q.emoji} ${q.text}
      </div>
    </div>

    <div class="time-pickers">
      <div class="time-field">
        <label>Me dormí</label>
        <input type="time" id="sleep-start" value="${sl.bedtime}" onchange="onSleepChange()">
      </div>
      <div class="time-field">
        <label>Me desperté</label>
        <input type="time" id="sleep-end" value="${sl.wakeup}" onchange="onSleepChange()">
      </div>
    </div>

    <div class="section-title">Esta semana</div>
    <div class="card">
      <div class="bar-chart" id="sleep-chart"></div>
    </div>

    <div class="info-row">
      <span class="info-row-label">Promedio semanal</span>
      <span class="info-row-value">${(sl.weekData.reduce((a,b)=>a+b,0)/sl.weekData.length).toFixed(1)} h</span>
    </div>
    <div class="info-row">
      <span class="info-row-label">Meta recomendada</span>
      <span class="info-row-value">7 – 9 horas</span>
    </div>
    <div class="info-row">
      <span class="info-row-label">Mejor noche</span>
      <span class="info-row-value">${Math.max(...sl.weekData)} h</span>
    </div>
  <div style="height:20px"></div>
  `;
});

Router.register('sleep_after', () => {
  const chart = document.getElementById('sleep-chart');
  if (chart) {
    buildBarChart(chart, VM.state.sleep.weekData, 9, '#D5CDE8', 'var(--lavender)');
  }
});

function onSleepChange() {
  const start = document.getElementById('sleep-start').value;
  const end   = document.getElementById('sleep-end').value;
  const hours = VM.calcSleepHours(start, end);
  VM.state.sleep.bedtime    = start;
  VM.state.sleep.wakeup     = end;
  VM.state.sleep.hoursToday = hours;
  VM.save();
  const disp = document.getElementById('sleep-display');
  if (disp) disp.textContent = hours;
  showToast('😴 Sueño actualizado: ' + hours + ' h');
}
