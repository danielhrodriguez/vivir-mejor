/* ============================================================
   pages/sleep.js
   ============================================================ */
Router.register('sleep', () => {
  const sl = VM.state.sleep;
  const q  = VM.sleepQualityLabel(sl.hoursToday);
  return `
    <div class="header">
      <div style="display:flex;align-items:center">
        <button class="header-back" onclick="Router.back()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
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

    <div style="padding:0 16px 8px">

      <!-- Selector Me dormí -->
      <div style="background:var(--white);border-radius:16px;padding:16px 20px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <div style="font-size:13px;color:var(--text-mid);font-weight:600;margin-bottom:12px">😴 Me dormí</div>
        <div style="display:flex;align-items:center;justify-content:center;gap:16px">
          <button onclick="adjustTime('sleep-h',  -1, 'start')" style="width:48px;height:48px;border-radius:50%;border:none;background:var(--sage-light);color:var(--sage);font-size:24px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center">−</button>
          <div style="text-align:center;min-width:80px">
            <div id="sleep-start-display" style="font-size:36px;font-weight:800;color:var(--text-dark);font-family:'Nunito',sans-serif;line-height:1">${sl.bedtime}</div>
            <div style="font-size:11px;color:var(--text-light);margin-top:2px">horas</div>
          </div>
          <button onclick="adjustTime('sleep-h',  +1, 'start')" style="width:48px;height:48px;border-radius:50%;border:none;background:var(--sage-light);color:var(--sage);font-size:24px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center">+</button>
          <div style="font-size:28px;color:var(--text-light);font-weight:300">:</div>
          <button onclick="adjustTime('sleep-m', -15, 'start')" style="width:48px;height:48px;border-radius:50%;border:none;background:var(--sage-light);color:var(--sage);font-size:24px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center">−</button>
          <div style="text-align:center;min-width:80px">
            <div id="sleep-start-min-display" style="font-size:36px;font-weight:800;color:var(--text-dark);font-family:'Nunito',sans-serif;line-height:1">${sl.bedtime.split(':')[1]}</div>
            <div style="font-size:11px;color:var(--text-light);margin-top:2px">minutos</div>
          </div>
          <button onclick="adjustTime('sleep-m', +15, 'start')" style="width:48px;height:48px;border-radius:50%;border:none;background:var(--sage-light);color:var(--sage);font-size:24px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center">+</button>
        </div>
      </div>

      <!-- Selector Me desperté -->
      <div style="background:var(--white);border-radius:16px;padding:16px 20px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <div style="font-size:13px;color:var(--text-mid);font-weight:600;margin-bottom:12px">☀️ Me desperté</div>
        <div style="display:flex;align-items:center;justify-content:center;gap:16px">
          <button onclick="adjustTime('wake-h',  -1, 'end')" style="width:48px;height:48px;border-radius:50%;border:none;background:var(--lavender-light);color:var(--lavender);font-size:24px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center">−</button>
          <div style="text-align:center;min-width:80px">
            <div id="sleep-end-display" style="font-size:36px;font-weight:800;color:var(--text-dark);font-family:'Nunito',sans-serif;line-height:1">${sl.wakeup}</div>
            <div style="font-size:11px;color:var(--text-light);margin-top:2px">horas</div>
          </div>
          <button onclick="adjustTime('wake-h',  +1, 'end')" style="width:48px;height:48px;border-radius:50%;border:none;background:var(--lavender-light);color:var(--lavender);font-size:24px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center">+</button>
          <div style="font-size:28px;color:var(--text-light);font-weight:300">:</div>
          <button onclick="adjustTime('wake-m', -15, 'end')" style="width:48px;height:48px;border-radius:50%;border:none;background:var(--lavender-light);color:var(--lavender);font-size:24px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center">−</button>
          <div style="text-align:center;min-width:80px">
            <div id="sleep-end-min-display" style="font-size:36px;font-weight:800;color:var(--text-dark);font-family:'Nunito',sans-serif;line-height:1">${sl.wakeup.split(':')[1]}</div>
            <div style="font-size:11px;color:var(--text-light);margin-top:2px">minutos</div>
          </div>
          <button onclick="adjustTime('wake-m', +15, 'end')" style="width:48px;height:48px;border-radius:50%;border:none;background:var(--lavender-light);color:var(--lavender);font-size:24px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center">+</button>
        </div>
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

function adjustTime(field, delta, target) {
  const sl = VM.state.sleep;
  let [h, m] = (target === 'start' ? sl.bedtime : sl.wakeup).split(':').map(Number);

  if (field.includes('-h')) {
    h = (h + delta + 24) % 24;
  } else {
    m = (m + delta + 60) % 60;
  }

  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const newTime = `${hh}:${mm}`;

  if (target === 'start') {
    sl.bedtime = newTime;
    const d = document.getElementById('sleep-start-display');
    const dm = document.getElementById('sleep-start-min-display');
    if (d) d.textContent = newTime;
    if (dm) dm.textContent = mm;
  } else {
    sl.wakeup = newTime;
    const d = document.getElementById('sleep-end-display');
    const dm = document.getElementById('sleep-end-min-display');
    if (d) d.textContent = newTime;
    if (dm) dm.textContent = mm;
  }

  const hours = VM.calcSleepHours(sl.bedtime, sl.wakeup);
  sl.hoursToday = hours;
  // Guardar en weekData en el índice del día actual
  const todayIdx = (new Date().getDay() + 6) % 7;
  sl.weekData[todayIdx] = hours;
  VM.save();
  const disp = document.getElementById('sleep-display');
  if (disp) disp.textContent = hours;
  showToast('😴 Sueño actualizado: ' + hours + ' h');
}

function onSleepChange() {
  const start = document.getElementById('sleep-start').value;
  const end   = document.getElementById('sleep-end').value;
  const hours = VM.calcSleepHours(start, end);
  VM.state.sleep.bedtime    = start;
  VM.state.sleep.wakeup     = end;
  VM.state.sleep.hoursToday = hours;
  const todayIdx = (new Date().getDay() + 6) % 7;
  VM.state.sleep.weekData[todayIdx] = hours;
  VM.save();
  const disp = document.getElementById('sleep-display');
  if (disp) disp.textContent = hours;
  showToast('😴 Sueño actualizado: ' + hours + ' h');
}
