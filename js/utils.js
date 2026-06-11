/* ============================================================
   utils.js — Funciones de utilidad compartidas
   ============================================================ */

// ---------- Toast ----------
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ---------- Date helpers ----------
function todayLabel() {
  return new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
}

function todayWeekIndex() {
  // Returns 0=Lun … 6=Dom
  const d = new Date().getDay(); // 0=Dom … 6=Sab
  return d === 0 ? 6 : d - 1;
}

// ---------- Build bar chart ----------
// container: HTMLElement, data: number[], max: number, color: string, activeColor: string
function buildBarChart(container, data, max, color, activeColor) {
  const days = VM.weekDayLabels();
  container.innerHTML = '';
  const maxVal = max || Math.max(...data, 1);
  // Obtener índice del día actual (0=Lunes ... 6=Domingo)
  const todayIdx = (new Date().getDay() + 6) % 7;
  data.forEach((v, i) => {
    const pct = Math.round((v / maxVal) * 100);
    const isToday = i === todayIdx;
    const barColor = isToday ? activeColor : color;
    // Mínimo 4px para que se vea la barra aunque el valor sea 0
    const barStyle = v > 0
      ? `height:${pct}%;background:${barColor};width:100%`
      : `height:4px;background:${color};width:100%;opacity:0.4`;
    const col = document.createElement('div');
    col.className = 'bar-col';
    col.innerHTML = `
      <div class="bar" style="${barStyle}"></div>
      <div class="bar-day" style="${isToday ? 'font-weight:800;color:var(--text-dark)' : ''}">${days[i]}</div>
    `;
    container.appendChild(col);
  });
}

// ---------- Build mood week mini chart ----------
function buildMoodWeek(container, moodData) {
  const days    = VM.weekDayLabels();
  const options = ['😔','😐','🙂','😊','😄'];
  container.innerHTML = '';
  moodData.forEach((m, i) => {
    const emoji = (m !== null && m !== undefined && options[m]) ? options[m] : '–';
    const item = document.createElement('div');
    item.className = 'mood-week-item';
    item.innerHTML = `
      <div class="mood-week-emoji">${emoji}</div>
      <div class="mood-week-day">${days[i]}</div>
    `;
    container.appendChild(item);
  });
}
