/* ============================================================
   pages/stats.js
   ============================================================ */
Router.register('stats', () => {
  const s  = VM.state;

  // Datos reales del usuario
  const avgSleep  = (s.sleep.weekData.reduce((a,b)=>a+b,0)/s.sleep.weekData.length).toFixed(1);
  const avgWater  = (s.water.weekData.reduce((a,b)=>a+b,0)/s.water.weekData.length).toFixed(1);
  const exDays    = s.exercise.weekDone.filter(Boolean).length;

  // Calcular cumplimiento real basado en hábitos completados
  let cumplidos = 0, total = 0;
  // Sueño: meta 7h
  s.sleep.weekData.forEach(h => { total++; if (h >= 7) cumplidos++; });
  // Agua: meta 8 vasos
  s.water.weekData.forEach(v => { total++; if (v >= 8) cumplidos++; });
  // Ejercicio
  s.exercise.weekDone.forEach(d => { total++; if (d) cumplidos++; });
  const cumplimientoPct = total > 0 ? Math.round((cumplidos/total)*100) : 0;
  const cumplimientoColor = cumplimientoPct >= 80 ? 'var(--sage)' : cumplimientoPct >= 50 ? 'var(--amber)' : 'var(--peach)';

  return `
    <div class="header">
      <div class="header-title">Estadísticas</div>
    </div>

    <div class="stats-tabs">
      <button class="stats-tab active" onclick="setStatsTab('week', this)">7 días</button>
      <button class="stats-tab" onclick="setStatsTab('month', this)">30 días</button>
      <button class="stats-tab" onclick="setStatsTab('all', this)">Histórico 🔒</button>
    </div>

    <!-- SCORES -->
    <div class="score-row">
      <div class="score-card">
        <div class="score-num" style="color:${cumplimientoColor}">${cumplimientoPct}%</div>
        <div class="score-lbl">Cumplimiento</div>
      </div>
      <div class="score-card">
        <div class="score-num" style="color:var(--lavender)">${avgSleep}h</div>
        <div class="score-lbl">Sueño prom.</div>
      </div>
      <div class="score-card">
        <div class="score-num" style="color:var(--sky)">${avgWater}</div>
        <div class="score-lbl">Vasos/día</div>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="card">
      <div class="card-title">😴 Sueño (horas por día)</div>
      <div class="bar-chart" id="stats-sleep-chart"></div>
    </div>

    <div class="card">
      <div class="card-title">💧 Hidratación (vasos por día)</div>
      <div class="bar-chart" id="stats-water-chart"></div>
    </div>

    <div class="card">
      <div class="card-title">🏃 Ejercicio (días activos)</div>
      <div class="bar-chart" id="stats-ex-chart"></div>
    </div>

    <div class="card">
      <div class="card-title">😊 Estado de ánimo semanal</div>
      <div class="mood-week" id="stats-mood-chart"></div>
    </div>

    <!-- PREMIUM BANNER con botón exportar -->
    <div class="premium-banner">
      <div class="premium-banner-title">🔒 Plan Premium – Estadísticas históricas</div>
      <div class="premium-banner-sub">
        Accedé a todo tu historial y exportá tus datos por solo $5/mes
      </div>
      <button class="premium-banner-btn" onclick="goTo('premium')">Ver planes →</button>
      <a href="#" onclick="goTo('export');return false;"
         style="margin-left:8px;padding:7px 16px;border-radius:20px;background:white;
                border:1.5px solid var(--amber);color:var(--amber);font-size:11px;
                font-weight:700;text-decoration:none;display:inline-block">
        📊 Exportar →
      </a>
    </div>
    <div style="height:16px"></div>
  `;
});

Router.register('stats_after', () => {
  const s = VM.state;
  const sc = document.getElementById('stats-sleep-chart');
  const wc = document.getElementById('stats-water-chart');
  const ec = document.getElementById('stats-ex-chart');
  const mc = document.getElementById('stats-mood-chart');
  if (sc) buildBarChart(sc, s.sleep.weekData, 9, '#D5CDE8', 'var(--lavender)');
  if (wc) buildBarChart(wc, s.water.weekData, 8, '#B5D9EA', 'var(--sky)');
  if (ec) {
    const exData = s.exercise.weekDone.map(v => v ? 1 : 0);
    buildBarChart(ec, exData, 1, '#B8D9C5', 'var(--sage)');
  }
  if (mc) buildMoodWeek(mc, s.mood.weekData);
});

function setStatsTab(tab, el) {
  document.querySelectorAll('.stats-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  if (tab === 'all') showToast('🔒 Disponible en Plan Premium');
}
