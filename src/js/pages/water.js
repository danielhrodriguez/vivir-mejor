/* ============================================================
   pages/water.js
   ============================================================ */
Router.register('water', () => {
  const w = VM.state.water;
  const pct = VM.waterPercent();
  const ml  = w.glasses * 200;
  return `
    <div class="header">
      <div style="display:flex;align-items:center">
        <button class="header-back" onclick="Router.back()">←</button>
        <div class="header-title">Hidratación</div>
      </div>
    </div>

    <div class="water-hero">
      <div class="big-number" id="water-count" style="color:var(--sky)">${w.glasses}</div>
      <div class="big-label">de ${w.goal} vasos (200 ml c/u)</div>
      <div class="glasses-grid" id="glasses-grid"></div>
      <div style="font-size:12px;color:var(--sky);font-weight:600" id="water-status">
        ${w.glasses >= w.goal ? '🎉 ¡Meta cumplida hoy!' : '¡Vas bien! Faltan ' + (w.goal - w.glasses) + ' vasos'}
      </div>
    </div>

    <div style="text-align:center">
      <button class="glass-add-btn" onclick="addWater()" aria-label="Registrar vaso de agua">
        <i class="ti ti-plus"></i>
      </button>
      <div style="font-size:11px;color:var(--text-mid);margin-top:6px">Registrar vaso</div>
    </div>

    <div class="section-title">Esta semana</div>
    <div class="card">
      <div class="bar-chart" id="water-chart"></div>
    </div>

    <div class="info-row">
      <span class="info-row-label">💧 Consumido hoy</span>
      <span class="info-row-value" id="water-ml">${ml} ml</span>
    </div>
    <div class="info-row">
      <span class="info-row-label">📊 Porcentaje</span>
      <span class="info-row-value">${pct}%</span>
    </div>
    <div class="info-row">
      <span class="info-row-label">⏰ Próximo recordatorio</span>
      <span class="info-row-value">Cada 2 horas</span>
    </div>
  <div style="height:20px"></div>
  `;
});

Router.register('water_after', () => {
  renderGlasses();
  const chart = document.getElementById('water-chart');
  if (chart) buildBarChart(chart, VM.state.water.weekData, 8, '#B5D9EA', 'var(--sky)');
});

function renderGlasses() {
  const grid = document.getElementById('glasses-grid');
  if (!grid) return;
  const w = VM.state.water;
  grid.innerHTML = '';
  for (let i = 0; i < w.goal; i++) {
    const g = document.createElement('div');
    g.className = 'glass' + (i < w.glasses ? ' filled' : '');
    if (i < w.glasses) g.innerHTML = '<i class="ti ti-droplet" style="font-size:15px;pointer-events:none"></i>';
    g.onclick = () => {
      VM.state.water.glasses = i + 1;
      VM.save();
      updateWaterUI();
    };
    grid.appendChild(g);
  }
}

function addWater() {
  const w = VM.state.water;
  if (w.glasses < w.goal) {
    w.glasses++;
    VM.save();
    updateWaterUI();
    showToast('💧 ¡Vaso registrado!');
  } else {
    showToast('🎉 ¡Meta de agua cumplida!');
  }
}

function updateWaterUI() {
  const w = VM.state.water;
  const countEl  = document.getElementById('water-count');
  const statusEl = document.getElementById('water-status');
  const mlEl     = document.getElementById('water-ml');
  if (countEl)  countEl.textContent  = w.glasses;
  if (statusEl) statusEl.textContent = w.glasses >= w.goal
    ? '🎉 ¡Meta cumplida hoy!'
    : '¡Vas bien! Faltan ' + (w.goal - w.glasses) + ' vasos';
  if (mlEl) mlEl.textContent = (w.glasses * 200) + ' ml';
  renderGlasses();
}
