/* ============================================================
   pages/export.js — Pantalla de exportación de datos (Premium)
   ============================================================ */

Router.register('export', () => {
  const isPremium = typeof Activation !== 'undefined' && Activation.isPremiumActive();
  const s         = VM.state;
  const today     = new Date().toLocaleDateString('es-AR', { day:'numeric', month:'long', year:'numeric' });
  const avgSleep  = (s.sleep.weekData.reduce((a,b)=>a+b,0) / s.sleep.weekData.length).toFixed(1);
  const avgWater  = (s.water.weekData.reduce((a,b)=>a+b,0) / s.water.weekData.length).toFixed(1);
  const exDays    = s.exercise.weekDone.filter(Boolean).length;

  return `
    <div class="header">
      <div style="display:flex;align-items:center">
        <button class="header-back" onclick="Router.back()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
        <div>
          <div class="header-title">Exportar datos 📊</div>
          <div class="header-sub">Descargá tu historial completo</div>
        </div>
      </div>
    </div>

    ${!isPremium ? `
    <!-- BLOQUEO PREMIUM -->
    <div style="margin:24px 16px;padding:28px;background:linear-gradient(135deg,var(--lavender-light),var(--sky-light));
                border-radius:var(--radius);border:1px solid #D5CDE8;text-align:center">
      <div style="font-size:48px;margin-bottom:12px">🔒</div>
      <div style="font-family:'Lora',serif;font-size:20px;color:var(--text-dark);margin-bottom:8px">
        Función Premium
      </div>
      <div style="font-size:13px;color:var(--text-mid);line-height:1.6;margin-bottom:20px">
        Exportá tu historial completo de hábitos<br>en formato PDF o CSV por solo $5 USD/mes
      </div>
      <button class="btn-primary" onclick="goTo('premium')" style="width:auto;padding:12px 28px">
        Ver Plan Premium →
      </button>
    </div>` : `

    <!-- RESUMEN A EXPORTAR -->
    <div style="margin:14px 16px 0;padding:16px;background:var(--sage-light);
                border-radius:var(--radius);border:1px solid var(--sage-mid)">
      <div style="font-size:13px;font-weight:700;color:var(--text-dark);margin-bottom:10px">
        📋 Datos incluidos en el reporte
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--white);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:20px;font-weight:700;color:var(--lavender)">${avgSleep}h</div>
          <div style="font-size:10px;color:var(--text-mid)">Sueño prom.</div>
        </div>
        <div style="background:var(--white);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:20px;font-weight:700;color:var(--sky)">${avgWater}</div>
          <div style="font-size:10px;color:var(--text-mid)">Vasos/día prom.</div>
        </div>
        <div style="background:var(--white);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:20px;font-weight:700;color:var(--sage)">${exDays}</div>
          <div style="font-size:10px;color:var(--text-mid)">Días ejercicio</div>
        </div>
        <div style="background:var(--white);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:20px;font-weight:700;color:var(--peach)">${(s.medications||[]).length}</div>
          <div style="font-size:10px;color:var(--text-mid)">Medicamentos</div>
        </div>
      </div>
    </div>

    <div class="section-title">Elegí el formato</div>

    <!-- OPCIÓN PDF -->
    <div style="margin:0 16px 12px;background:var(--white);border-radius:var(--radius);
                border:1.5px solid var(--border);padding:18px">
      <div style="display:flex;align-items:flex-start;gap:14px">
        <div style="width:48px;height:48px;border-radius:12px;background:#FDF0E8;
                    display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">
          📄
        </div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:700;color:var(--text-dark)">Reporte PDF</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:3px;line-height:1.5">
            Reporte visual completo con gráficos de barras, tabla de medicamentos y resumen semanal.
            Ideal para compartir con tu médico.
          </div>
          <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
            <span style="font-size:10px;background:var(--peach-light);color:var(--peach);
                         padding:3px 8px;border-radius:10px;font-weight:600">Gráficos visuales</span>
            <span style="font-size:10px;background:var(--sage-light);color:var(--sage);
                         padding:3px 8px;border-radius:10px;font-weight:600">Medicamentos</span>
            <span style="font-size:10px;background:var(--sky-light);color:var(--sky);
                         padding:3px 8px;border-radius:10px;font-weight:600">Para el médico</span>
          </div>
        </div>
      </div>
      <button class="btn-primary" style="margin-top:14px;background:var(--peach)"
              onclick="exportPDF()">
        <i class="ti ti-file-type-pdf"></i> Descargar PDF
      </button>
    </div>

    <!-- OPCIÓN CSV -->
    <div style="margin:0 16px 12px;background:var(--white);border-radius:var(--radius);
                border:1.5px solid var(--border);padding:18px">
      <div style="display:flex;align-items:flex-start;gap:14px">
        <div style="width:48px;height:48px;border-radius:12px;background:var(--sage-light);
                    display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">
          📊
        </div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:700;color:var(--text-dark)">Planilla CSV</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:3px;line-height:1.5">
            Datos en formato tabla para abrir en Excel o Google Sheets.
            Incluye los últimos 30 días con todos los hábitos.
          </div>
          <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
            <span style="font-size:10px;background:var(--sage-light);color:var(--sage);
                         padding:3px 8px;border-radius:10px;font-weight:600">30 días de datos</span>
            <span style="font-size:10px;background:var(--amber-light);color:var(--amber);
                         padding:3px 8px;border-radius:10px;font-weight:600">Abre en Excel</span>
            <span style="font-size:10px;background:var(--lavender-light);color:var(--lavender);
                         padding:3px 8px;border-radius:10px;font-weight:600">Google Sheets</span>
          </div>
        </div>
      </div>
      <button class="btn-primary" style="margin-top:14px;background:var(--sage)"
              onclick="exportCSV()">
        <i class="ti ti-table-export"></i> Descargar CSV
      </button>
    </div>

    <!-- OPCIÓN COMPARTIR -->
    <div style="margin:0 16px 24px;background:var(--white);border-radius:var(--radius);
                border:1.5px solid var(--border);padding:18px">
      <div style="display:flex;align-items:flex-start;gap:14px">
        <div style="width:48px;height:48px;border-radius:12px;background:#E8F3F8;
                    display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">
          💬
        </div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:700;color:var(--text-dark)">Compartir resumen</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:3px;line-height:1.5">
            Enviá un resumen rápido de tu semana por WhatsApp o email.
          </div>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:14px">
        <button class="btn-primary" style="flex:1;background:#25D366;font-size:13px"
                onclick="shareWhatsApp()">
          💬 WhatsApp
        </button>
        <button class="btn-primary" style="flex:1;background:var(--sky);font-size:13px"
                onclick="shareEmail()">
          📧 Email
        </button>
      </div>
    </div>
    `}
  `;
});

// ── Funciones de exportación ───────────────────────────────────────

function exportPDF() {
  showToast('📄 Generando PDF...');
  setTimeout(() => {
    const ok = ExportService.downloadPDF();
    if (ok) showToast('✅ PDF listo — guardalo desde el diálogo de impresión');
  }, 400);
}

function exportCSV() {
  showToast('📊 Generando CSV...');
  setTimeout(() => {
    const ok = ExportService.downloadCSV();
    if (ok) showToast('✅ CSV descargado correctamente');
  }, 400);
}

function shareWhatsApp() {
  const s       = VM.state;
  const avgSleep = (s.sleep.weekData.reduce((a,b)=>a+b,0) / s.sleep.weekData.length).toFixed(1);
  const avgWater = (s.water.weekData.reduce((a,b)=>a+b,0) / s.water.weekData.length).toFixed(1);
  const exDays   = s.exercise.weekDone.filter(Boolean).length;
  const today    = new Date().toLocaleDateString('es-AR', { day:'numeric', month:'long' });

  const msg = encodeURIComponent(
    `🌿 *Vivir Mejor — Mi resumen semanal*\n\n` +
    `📅 ${today}\n\n` +
    `😴 Sueño promedio: *${avgSleep} horas*\n` +
    `💧 Hidratación: *${avgWater} vasos/día*\n` +
    `🏃 Ejercicio: *${exDays} días esta semana*\n` +
    `😊 Ánimo hoy: *${s.mood.labels[s.mood.selected]}*\n` +
    `🔥 Racha: *${s.streak || 0} días*\n\n` +
    `_Reportado con la app Vivir Mejor_`
  );
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

function shareEmail() {
  const s        = VM.state;
  const avgSleep = (s.sleep.weekData.reduce((a,b)=>a+b,0) / s.sleep.weekData.length).toFixed(1);
  const avgWater = (s.water.weekData.reduce((a,b)=>a+b,0) / s.water.weekData.length).toFixed(1);
  const exDays   = s.exercise.weekDone.filter(Boolean).length;
  const today    = new Date().toLocaleDateString('es-AR', { day:'numeric', month:'long', year:'numeric' });

  const subject = encodeURIComponent(`Vivir Mejor — Resumen semanal ${today}`);
  const body    = encodeURIComponent(
    `Resumen semanal de hábitos — ${today}\n\n` +
    `Sueño promedio: ${avgSleep} horas\n` +
    `Hidratación: ${avgWater} vasos/día\n` +
    `Ejercicio: ${exDays} días\n` +
    `Ánimo: ${s.mood.labels[s.mood.selected]}\n` +
    `Racha: ${s.streak || 0} días\n\n` +
    `Generado con la app Vivir Mejor`
  );
  window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
}
