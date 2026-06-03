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
  data.forEach((v, i) => {
    const pct = Math.round((v / maxVal) * 100);
    const isLast = i === data.length - 1;
    const col = document.createElement('div');
    col.className = 'bar-col';
    col.innerHTML = `
      <div class="bar" style="height:${pct}%;background:${isLast ? activeColor : color};width:100%"></div>
      <div class="bar-day">${days[i]}</div>
    `;
    container.appendChild(col);
  });
}

// ---------- Build mood week mini chart ----------
function buildMoodWeek(container, moodData) {
  const days = VM.weekDayLabels();
  container.innerHTML = '';
  moodData.forEach((m, i) => {
    const item = document.createElement('div');
    item.className = 'mood-week-item';
    item.innerHTML = `
      <div class="mood-week-emoji">${m}</div>
      <div class="mood-week-day">${days[i]}</div>
    `;
    container.appendChild(item);
  });
}
