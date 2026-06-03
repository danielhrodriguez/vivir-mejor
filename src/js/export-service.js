/* ============================================================
   export-service.js — Exportación de datos en CSV y PDF
   Disponible solo para usuarios Premium.

   Genera reportes de:
   - Sueño (horas por día)
   - Hidratación (vasos por día)
   - Ejercicio (días activos)
   - Estado de ánimo (valor diario)
   - Medicamentos (registro de tomas)
   ============================================================ */

const ExportService = {

  // ── Generar y descargar CSV ───────────────────────────────────────
  downloadCSV() {
    const s    = VM.state;
    const rows = [];
    const days = this._getLast30Days();

    // Encabezado
    rows.push([
      'Fecha',
      'Sueño (horas)',
      'Hidratación (vasos)',
      'Ejercicio',
      'Estado de ánimo',
      'Medicamentos tomados',
    ].join(','));

    // Datos por día (simulados con datos reales del state donde existen)
    const moodLabels = ['Mal','Regular','Bien','Genial','Excelente'];
    days.forEach((date, i) => {
      const sleepVal = i === 0
        ? s.sleep.hoursToday
        : s.sleep.weekData[i % s.sleep.weekData.length] || '';
      const waterVal = i === 0
        ? s.water.glasses
        : s.water.weekData[i % s.water.weekData.length] || '';
      const exVal    = s.exercise.weekDone[i % 7] ? 'Sí' : 'No';
      const moodVal  = i === 0
        ? moodLabels[s.mood.selected]
        : (s.mood.weekData[i % 7] ? s.mood.weekData[i % 7] : '');
      const medVal   = (s.medications || [])
        .map(m => `${m.name}:${m.takenCount||0}/${(m.times||[]).length}`)
        .join(' | ') || 'Sin medicamentos';

      rows.push([
        date,
        sleepVal,
        waterVal,
        exVal,
        moodVal,
        `"${medVal}"`,
      ].join(','));
    });

    // Agregar BOM para que Excel lo lea bien con tildes
    const bom     = '\uFEFF';
    const content = bom + rows.join('\n');
    this._downloadFile(content, 'vivir-mejor-reporte.csv', 'text/csv;charset=utf-8');
    return true;
  },

  // ── Generar y descargar PDF ───────────────────────────────────────
  downloadPDF() {
    const s         = VM.state;
    const userName  = s.userName || 'Usuario';
    const today     = new Date().toLocaleDateString('es-AR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    const avgSleep  = (s.sleep.weekData.reduce((a,b)=>a+b,0) / s.sleep.weekData.length).toFixed(1);
    const avgWater  = (s.water.weekData.reduce((a,b)=>a+b,0) / s.water.weekData.length).toFixed(1);
    const exDays    = s.exercise.weekDone.filter(Boolean).length;
    const moodLabel = s.mood.labels[s.mood.selected];
    const meds      = s.medications || [];

    // Generar HTML del reporte para imprimir como PDF
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Vivir Mejor – Reporte de Hábitos</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #3A4A42; background: #fff;
      padding: 40px; max-width: 800px; margin: 0 auto;
    }
    .header {
      display: flex; align-items: center; gap: 16px;
      border-bottom: 3px solid #7BAE8E; padding-bottom: 20px; margin-bottom: 28px;
    }
    .logo {
      width: 56px; height: 56px; border-radius: 14px;
      background: linear-gradient(135deg, #5A9E78, #7BB5C8);
      display: flex; align-items: center; justify-content: center;
      font-size: 28px;
    }
    .header-text h1 { font-size: 22px; color: #3A4A42; }
    .header-text p  { font-size: 13px; color: #6B7C74; margin-top: 3px; }
    .user-info {
      background: #EAF4EF; border-radius: 10px;
      padding: 14px 18px; margin-bottom: 24px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .user-info strong { font-size: 15px; }
    .user-info span   { font-size: 12px; color: #6B7C74; }
    .section-title {
      font-size: 14px; font-weight: 700; color: #7BAE8E;
      text-transform: uppercase; letter-spacing: 0.06em;
      margin: 24px 0 12px; border-left: 3px solid #7BAE8E; padding-left: 10px;
    }
    .stats-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 8px;
    }
    .stat-card {
      background: #F7FAF8; border-radius: 10px;
      padding: 14px; text-align: center; border: 1px solid #E4EDE8;
    }
    .stat-num  { font-size: 28px; font-weight: 700; color: #3A4A42; }
    .stat-lbl  { font-size: 11px; color: #6B7C74; margin-top: 3px; }
    .week-grid {
      display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-bottom: 8px;
    }
    .week-day  { text-align: center; }
    .day-label { font-size: 10px; color: #A0AFA8; margin-bottom: 4px; }
    .day-bar   {
      height: 60px; background: #E4EDE8; border-radius: 4px;
      display: flex; align-items: flex-end; overflow: hidden;
    }
    .day-fill  { width: 100%; border-radius: 4px; transition: height 0.3s; }
    .day-val   { font-size: 10px; color: #6B7C74; margin-top: 3px; }
    .med-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .med-table th {
      background: #EAF4EF; padding: 8px 12px; text-align: left;
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #7BAE8E;
    }
    .med-table td { padding: 10px 12px; border-bottom: 1px solid #F0F4F2; }
    .med-table tr:last-child td { border-bottom: none; }
    .badge {
      display: inline-block; padding: 3px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 600;
    }
    .badge.green  { background: #EAF4EF; color: #5A9E78; }
    .badge.yellow { background: #FBF3E3; color: #D4A55A; }
    .footer {
      margin-top: 36px; padding-top: 16px; border-top: 1px solid #E4EDE8;
      text-align: center; font-size: 11px; color: #A0AFA8;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="logo">🌿</div>
    <div class="header-text">
      <h1>Vivir Mejor — Reporte de Hábitos</h1>
      <p>Generado el ${today} · Plan Premium</p>
    </div>
  </div>

  <!-- INFO USUARIO -->
  <div class="user-info">
    <div>
      <strong>${userName}</strong><br>
      <span>Plan Premium activo</span>
    </div>
    <div style="text-align:right">
      <strong style="color:#7BAE8E">${s.streak || 0} días</strong><br>
      <span>racha actual 🔥</span>
    </div>
  </div>

  <!-- RESUMEN SEMANAL -->
  <div class="section-title">📊 Resumen semanal</div>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-num" style="color:#9B8EC4">${avgSleep}h</div>
      <div class="stat-lbl">Sueño promedio</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:#7BB5C8">${avgWater}</div>
      <div class="stat-lbl">Vasos/día prom.</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:#7BAE8E">${exDays}</div>
      <div class="stat-lbl">Días de ejercicio</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:#E8A87C;font-size:20px">${moodLabel}</div>
      <div class="stat-lbl">Ánimo hoy</div>
    </div>
  </div>

  <!-- GRÁFICO SUEÑO -->
  <div class="section-title">😴 Sueño — últimos 7 días</div>
  <div class="week-grid">
    ${['L','M','X','J','V','S','D'].map((d, i) => {
      const val = s.sleep.weekData[i] || 0;
      const pct = Math.round((val / 9) * 100);
      return `<div class="week-day">
        <div class="day-label">${d}</div>
        <div class="day-bar">
          <div class="day-fill" style="height:${pct}%;background:#D5CDE8"></div>
        </div>
        <div class="day-val">${val}h</div>
      </div>`;
    }).join('')}
  </div>

  <!-- GRÁFICO HIDRATACIÓN -->
  <div class="section-title">💧 Hidratación — últimos 7 días</div>
  <div class="week-grid">
    ${['L','M','X','J','V','S','D'].map((d, i) => {
      const val = s.water.weekData[i] || 0;
      const pct = Math.round((val / 8) * 100);
      return `<div class="week-day">
        <div class="day-label">${d}</div>
        <div class="day-bar">
          <div class="day-fill" style="height:${pct}%;background:#B5D9EA"></div>
        </div>
        <div class="day-val">${val}</div>
      </div>`;
    }).join('')}
  </div>

  <!-- EJERCICIO -->
  <div class="section-title">🏃 Ejercicio — esta semana</div>
  <div class="week-grid">
    ${['L','M','X','J','V','S','D'].map((d, i) => {
      const done = s.exercise.weekDone[i];
      return `<div class="week-day">
        <div class="day-label">${d}</div>
        <div style="width:36px;height:36px;border-radius:50%;margin:0 auto;
                    background:${done?'#7BAE8E':'#E4EDE8'};
                    display:flex;align-items:center;justify-content:center;
                    font-size:16px;color:white">
          ${done ? '✓' : ''}
        </div>
      </div>`;
    }).join('')}
  </div>

  <!-- ESTADO DE ÁNIMO -->
  <div class="section-title">😊 Estado de ánimo — esta semana</div>
  <div class="week-grid">
    ${['L','M','X','J','V','S','D'].map((d, i) => {
      const emoji = s.mood.weekData[i] || '😐';
      return `<div class="week-day">
        <div class="day-label">${d}</div>
        <div style="font-size:24px;text-align:center;margin-top:4px">${emoji}</div>
      </div>`;
    }).join('')}
  </div>

  <!-- MEDICAMENTOS -->
  ${meds.length > 0 ? `
  <div class="section-title">💊 Medicamentos</div>
  <table class="med-table">
    <thead>
      <tr>
        <th>Medicamento</th>
        <th>Dosis</th>
        <th>Frecuencia</th>
        <th>Horarios</th>
        <th>Estado hoy</th>
      </tr>
    </thead>
    <tbody>
      ${meds.map(m => `
        <tr>
          <td><strong>${m.icon || '💊'} ${m.name}</strong></td>
          <td>${m.dose || '—'}</td>
          <td>${m.frequency || '—'}</td>
          <td>${(m.times||[]).join(' / ') || '—'}</td>
          <td>
            <span class="badge ${(m.takenCount||0) >= (m.times||[]).length ? 'green' : 'yellow'}">
              ${(m.takenCount||0) >= (m.times||[]).length ? '✓ Completo' : `${m.takenCount||0}/${(m.times||[]).length} tomados`}
            </span>
          </td>
        </tr>
        ${m.notes ? `<tr><td colspan="5" style="font-size:11px;color:#6B7C74;padding:4px 12px 10px">📝 ${m.notes}</td></tr>` : ''}
      `).join('')}
    </tbody>
  </table>` : ''}

  <!-- FOOTER -->
  <div class="footer">
    <strong>Vivir Mejor</strong> · Hábitos Diarios &amp; Bienestar · Plan Premium<br>
    Reporte generado el ${today} · Datos confidenciales del usuario
  </div>

  <script>window.onload = () => window.print();</script>
</body>
</html>`;

    // Abrir en nueva ventana y disparar impresión → Guardar como PDF
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    return true;
  },

  // ── Helpers ───────────────────────────────────────────────────────
  _getLast30Days() {
    const days = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'numeric' }));
    }
    return days;
  },

  _downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
