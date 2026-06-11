/* ============================================================
   pages/medications.js — Seguimiento de medicamentos
   Funciones:
   - Lista de medicamentos con nombre, dosis, horarios
   - Registro de toma con hora real
   - Historial de los últimos 7 días
   - Recordatorios por medicamento
   - Notas del médico
   ============================================================ */

Router.register('medications', () => {
  const meds   = VM.state.medications || [];
  const today  = new Date().toLocaleDateString('es-AR', { weekday:'long', day:'numeric', month:'long' });

  const emptyState = `
    <div style="text-align:center;padding:40px 24px">
      <div style="font-size:56px;margin-bottom:12px">💊</div>
      <div style="font-family:'Lora',serif;font-size:18px;color:var(--text-dark);margin-bottom:6px">
        Sin medicamentos registrados
      </div>
      <div style="font-size:13px;color:var(--text-mid);line-height:1.6;margin-bottom:24px">
        Agregá tus medicamentos para recibir<br>recordatorios y llevar un historial
      </div>
      <button class="btn-primary" style="width:auto;padding:12px 28px" onclick="showMedModal()">
        + Agregar medicamento
      </button>
    </div>`;

  const medCards = meds.length === 0 ? emptyState : meds.map((med, i) => {
    const nextDose  = getNextDose(med);
    const takenToday = isTakenToday(med);
    const pct = med.times ? Math.round((med.takenCount || 0) / med.times.length * 100) : 0;

    return `
      <div style="background:var(--white);border-radius:var(--radius);
                  border:1.5px solid ${takenToday ? 'var(--sage)' : 'var(--border)'};
                  margin:0 16px 10px;padding:16px;transition:border-color 0.2s">
        <!-- Header -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:42px;height:42px;border-radius:12px;
                        background:${med.color || 'var(--lavender-light)'};
                        display:flex;align-items:center;justify-content:center;font-size:22px">
              ${med.icon || '💊'}
            </div>
            <div>
              <div style="font-size:15px;font-weight:700;color:var(--text-dark)">${med.name}</div>
              <div style="font-size:12px;color:var(--text-mid);margin-top:1px">${med.dose || ''} · ${med.frequency || ''}</div>
            </div>
          </div>
          <div style="display:flex;gap:6px">
            <button onclick="editMed(${i})"
                    style="width:30px;height:30px;border-radius:8px;background:var(--bg);
                           border:1px solid var(--border);cursor:pointer;font-size:14px">✏️</button>
            <button onclick="deleteMed(${i})"
                    style="width:30px;height:30px;border-radius:8px;background:var(--bg);
                           border:1px solid var(--border);cursor:pointer;font-size:14px">🗑️</button>
          </div>
        </div>

        <!-- Horarios de hoy -->
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
          ${(med.times || []).map((t, ti) => {
            const taken = med.takenTimes && med.takenTimes.includes(t);
            return `
              <button onclick="toggleDose(${i},${ti},'${t}')"
                      style="padding:5px 12px;border-radius:20px;font-size:12px;font-weight:700;
                             border:1.5px solid ${taken ? 'var(--sage)' : 'var(--border)'};
                             background:${taken ? 'var(--sage-light)' : 'var(--white)'};
                             color:${taken ? 'var(--sage)' : 'var(--text-mid)'};
                             cursor:pointer;font-family:'Nunito',sans-serif;
                             transition:all 0.2s">
                ${taken ? '✓' : '○'} ${t}
              </button>`;
          }).join('')}
        </div>

        <!-- Barra de progreso del día -->
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:4px;background:#E4EDE8;border-radius:2px">
            <div style="height:100%;width:${pct}%;background:var(--sage);border-radius:2px;transition:width 0.4s"></div>
          </div>
          <div style="font-size:11px;color:var(--text-mid);white-space:nowrap">
            ${med.takenCount || 0}/${(med.times||[]).length} hoy
          </div>
        </div>

        ${med.notes ? `
          <div style="margin-top:8px;padding:8px 10px;background:var(--amber-light);
                      border-radius:8px;font-size:11px;color:var(--amber);font-weight:600">
            📝 ${med.notes}
          </div>` : ''}
      </div>`;
  }).join('');

  return `
    <div class="header">
      <div style="display:flex;align-items:center">
        <button class="header-back" onclick="Router.back()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
        <div>
          <div class="header-title">Medicamentos 💊</div>
          <div class="header-sub">${today}</div>
        </div>
      </div>
      ${meds.length > 0 ? `
        <button onclick="showMedModal()"
                style="width:34px;height:34px;border-radius:10px;background:var(--sage-light);
                       border:none;cursor:pointer;font-size:20px;color:var(--sage)">+</button>` : ''}
    </div>

    <!-- RESUMEN DEL DÍA -->
    ${meds.length > 0 ? `
    <div style="margin:14px 16px 0;padding:14px 16px;
                background:linear-gradient(135deg,var(--lavender-light),var(--sky-light));
                border-radius:var(--radius);border:1px solid #D5CDE8">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--text-dark)">Resumen de hoy</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:2px" id="med-summary-text">
            ${getMedSummary(meds)}
          </div>
        </div>
        <div style="font-size:36px">${getAllTakenToday(meds) ? '✅' : '⏳'}</div>
      </div>
    </div>` : ''}

    <!-- LISTA DE MEDICAMENTOS -->
    <div style="padding-top:12px" id="med-list">
      ${medCards}
    </div>

    <!-- HISTORIAL -->
    ${meds.length > 0 ? `
    <div class="section-title">Historial — últimos 7 días</div>
    <div class="card" style="overflow-x:auto">
      <div style="display:flex;gap:8px;min-width:max-content">
        ${buildMedHistory(meds)}
      </div>
    </div>` : ''}

    <!-- MODAL AGREGAR / EDITAR MEDICAMENTO -->
    <div id="med-modal" style="display:none;position:fixed;inset:0;
         background:rgba(0,0,0,0.45);z-index:150;align-items:flex-end;justify-content:center">
      <div style="background:var(--white);border-radius:24px 24px 0 0;
                  padding:24px;width:100%;max-width:430px;max-height:90vh;overflow-y:auto">

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div style="font-size:17px;font-weight:700;color:var(--text-dark)" id="med-modal-title">
            💊 Nuevo medicamento
          </div>
          <button onclick="closeMedModal()"
                  style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text-mid)">×</button>
        </div>

        <input type="hidden" id="med-edit-idx" value="-1">

        <!-- Nombre -->
        <div class="form-group">
          <label class="form-label">
            <i class="ti ti-pill" style="color:var(--lavender);font-size:13px;margin-right:4px"></i>
            Nombre del medicamento <span style="color:var(--peach)">*</span>
          </label>
          <input type="text" id="med-name" class="form-input"
                 placeholder="Ej: Ibuprofeno, Losartán, Metformina"
                 onfocus="focusField(this)" onblur="blurField(this)">
          <div class="form-error" id="err-med-name"></div>
        </div>

        <!-- Dosis -->
        <div class="form-group">
          <label class="form-label">
            <i class="ti ti-scale" style="color:var(--sky);font-size:13px;margin-right:4px"></i>
            Dosis
          </label>
          <input type="text" id="med-dose" class="form-input"
                 placeholder="Ej: 500mg, 1 comprimido, 10ml"
                 onfocus="focusField(this)" onblur="blurField(this)">
        </div>

        <!-- Frecuencia -->
        <div class="form-group">
          <label class="form-label">
            <i class="ti ti-repeat" style="color:var(--sage);font-size:13px;margin-right:4px"></i>
            Frecuencia
          </label>
          <select id="med-frequency"
                  style="width:100%;padding:12px 14px;border-radius:var(--radius-sm);
                         border:1.5px solid var(--border);font-family:'Nunito',sans-serif;
                         font-size:14px;color:var(--text-dark);background:var(--white);outline:none"
                  onchange="updateTimePickers()">
            <option value="1 vez por día">1 vez por día</option>
            <option value="2 veces por día">2 veces por día</option>
            <option value="3 veces por día">3 veces por día</option>
            <option value="Cada 8 horas">Cada 8 horas</option>
            <option value="Cada 12 horas">Cada 12 horas</option>
            <option value="Según necesidad">Según necesidad</option>
          </select>
        </div>

        <!-- Horarios -->
        <div class="form-group" id="time-pickers-group">
          <label class="form-label">
            <i class="ti ti-clock" style="color:var(--peach);font-size:13px;margin-right:4px"></i>
            Horarios de toma
          </label>
          <div id="time-pickers-container" style="display:flex;gap:8px;flex-wrap:wrap"></div>
        </div>

        <!-- Icono / color -->
        <div class="form-group">
          <label class="form-label">Ícono</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${['💊','💉','🩺','🫀','🧴','💧','🌡️','🩻'].map(ic =>
              `<button onclick="selectMedIcon('${ic}',this)"
                       style="width:40px;height:40px;border-radius:10px;border:1.5px solid var(--border);
                              background:var(--white);font-size:20px;cursor:pointer;
                              transition:all 0.15s" class="med-icon-btn">${ic}</button>`
            ).join('')}
          </div>
          <input type="hidden" id="med-icon" value="💊">
        </div>

        <!-- Color de fondo -->
        <div class="form-group">
          <label class="form-label">Color</label>
          <div style="display:flex;gap:8px">
            ${[
              ['var(--lavender-light)','#F0EDF8'],
              ['var(--sky-light)',     '#E8F3F8'],
              ['var(--sage-light)',    '#EAF4EF'],
              ['var(--peach-light)',   '#FDF0E8'],
              ['var(--amber-light)',   '#FBF3E3'],
            ].map(([varName, hex]) =>
              `<button onclick="selectMedColor('${hex}',this)"
                       style="width:32px;height:32px;border-radius:50%;background:${hex};
                              border:2px solid transparent;cursor:pointer;transition:all 0.15s"
                       class="med-color-btn"></button>`
            ).join('')}
          </div>
          <input type="hidden" id="med-color" value="#F0EDF8">
        </div>

        <!-- Notas del médico -->
        <div class="form-group">
          <label class="form-label">
            <i class="ti ti-notes" style="color:var(--amber);font-size:13px;margin-right:4px"></i>
            Notas / indicaciones del médico
          </label>
          <textarea id="med-notes" class="mood-textarea" style="height:70px"
                    placeholder="Ej: Tomar con comida, No combinar con alcohol..."></textarea>
        </div>

        <!-- Recordatorio -->
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;
                      padding:12px;background:var(--bg);border-radius:8px;margin-bottom:16px">
          <input type="checkbox" id="med-reminder" checked
                 style="width:16px;height:16px;accent-color:var(--sage);cursor:pointer">
          <span style="font-size:13px;color:var(--text-dark);font-weight:500">
            🔔 Activar recordatorio para este medicamento
          </span>
        </label>

        <div style="display:flex;gap:8px">
          <button class="btn-outline" onclick="closeMedModal()" style="flex:1">Cancelar</button>
          <button class="btn-primary" onclick="saveMed()" style="flex:1">Guardar</button>
        </div>
      </div>
    </div>

    <style>
      @keyframes slideUp {
        from { transform: translateY(100%); }
        to   { transform: translateY(0); }
      }
      #med-modal > div { animation: slideUp 0.25s ease-out; }
    </style>
  `;
});

Router.register('medications_after', () => {
  updateTimePickers();
});

// ── Helpers ───────────────────────────────────────────────────────

function getNextDose(med) {
  if (!med.times || med.times.length === 0) return null;
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (const t of med.times) {
    const [h, m] = t.split(':').map(Number);
    if (h * 60 + m > nowMins) return t;
  }
  return med.times[0] + ' (mañana)';
}

function isTakenToday(med) {
  if (!med.times || med.times.length === 0) return false;
  return (med.takenCount || 0) >= med.times.length;
}

function getAllTakenToday(meds) {
  return meds.every(m => isTakenToday(m));
}

function getMedSummary(meds) {
  const total  = meds.reduce((s, m) => s + (m.times || []).length, 0);
  const taken  = meds.reduce((s, m) => s + (m.takenCount || 0), 0);
  const pend   = total - taken;
  if (pend === 0) return '✅ Todos los medicamentos tomados';
  return `${taken} de ${total} tomados · ${pend} pendiente${pend > 1 ? 's' : ''}`;
}

function buildMedHistory(meds) {
  const days = ['L','M','X','J','V','S','D'];
  const todayIdx = (new Date().getDay() + 6) % 7;

  return days.map((d, i) => {
    const isFuture  = i > todayIdx;
    const isToday   = i === todayIdx;
    const isPast    = i < todayIdx;

    let done = false;
    if (isToday) {
      done = meds.some(m => (m.takenCount || 0) > 0);
    } else if (isPast) {
      done = meds.some(m => m.weekHistory && m.weekHistory[i]);
    }

    // Estilos según estado
    let bgColor, borderStyle, textColor, checkColor;
    if (done) {
      bgColor     = 'var(--sage)';
      borderStyle = 'none';
      checkColor  = 'white';
    } else if (isToday) {
      bgColor     = 'transparent';
      borderStyle = '2.5px solid var(--sage)';
      checkColor  = 'transparent';
    } else if (isFuture) {
      bgColor     = 'transparent';
      borderStyle = '1.5px dashed #E4EDE8';
      checkColor  = 'transparent';
    } else {
      // Día pasado sin toma
      bgColor     = '#E4EDE8';
      borderStyle = 'none';
      checkColor  = 'transparent';
    }

    return \`
      <div style="text-align:center;min-width:36px">
        <div style="font-size:10px;
                    color:\${isToday ? 'var(--sage)' : 'var(--text-light)'};
                    font-weight:\${isToday ? '800' : 'normal'};
                    margin-bottom:4px">\${d}</div>
        <div style="width:32px;height:32px;border-radius:50%;margin:0 auto;
                    background:\${bgColor};border:\${borderStyle};
                    display:flex;align-items:center;justify-content:center;
                    font-size:16px;color:\${checkColor};font-weight:700">
          \${done ? '✓' : ''}
        </div>
      </div>\`;
  }).join('');
}

// ── Registro de toma ──────────────────────────────────────────────

function toggleDose(medIdx, timeIdx, time) {
  const meds = VM.state.medications || [];
  const med  = meds[medIdx];
  if (!med) return;

  if (!med.takenTimes) med.takenTimes = [];
  const alreadyTaken = med.takenTimes.includes(time);

  if (alreadyTaken) {
    med.takenTimes = med.takenTimes.filter(t => t !== time);
    med.takenCount = Math.max(0, (med.takenCount || 0) - 1);
    showToast('↩️ Dosis desmarcada');
  } else {
    med.takenTimes.push(time);
    med.takenCount = (med.takenCount || 0) + 1;
    showToast(`✅ ${med.name} — ${time} registrado`);
    // Vibrar si está disponible
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }

  // Guardar en historial semanal del día actual
  const todayIdx = (new Date().getDay() + 6) % 7;
  if (!med.weekHistory) med.weekHistory = [false,false,false,false,false,false,false];
  med.weekHistory[todayIdx] = (med.takenCount || 0) > 0;

  VM.save();
  syncMedsToCloud();
  Router.go('medications');
}

async function syncMedsToCloud() {
  const uid = window.FB?.auth?.currentUser?.uid;
  if (!uid) return;
  try {
    await FB.updateDoc(FB.doc(FB.db, 'users', uid), {
      medications: VM.state.medications,
    });
  } catch(e) {}
}

// ── Modal helpers ─────────────────────────────────────────────────

function showMedModal(editIdx = -1) {
  const modal = document.getElementById('med-modal');
  if (!modal) return;

  document.getElementById('med-edit-idx').value = editIdx;

  if (editIdx >= 0) {
    // Modo edición
    const med = VM.state.medications[editIdx];
    document.getElementById('med-modal-title').textContent = '✏️ Editar medicamento';
    document.getElementById('med-name').value      = med.name || '';
    document.getElementById('med-dose').value      = med.dose || '';
    document.getElementById('med-frequency').value = med.frequency || '1 vez por día';
    document.getElementById('med-notes').value     = med.notes || '';
    document.getElementById('med-icon').value      = med.icon || '💊';
    document.getElementById('med-color').value     = med.color || '#F0EDF8';
    document.getElementById('med-reminder').checked = med.reminder !== false;
  } else {
    // Modo nuevo
    document.getElementById('med-modal-title').textContent = '💊 Nuevo medicamento';
    document.getElementById('med-name').value      = '';
    document.getElementById('med-dose').value      = '';
    document.getElementById('med-notes').value     = '';
    document.getElementById('med-icon').value      = '💊';
    document.getElementById('med-color').value     = '#F0EDF8';
    document.getElementById('med-reminder').checked = true;
  }

  updateTimePickers(editIdx >= 0 ? VM.state.medications[editIdx].times : null);
  modal.style.display = 'flex';
}

function closeMedModal() {
  const modal = document.getElementById('med-modal');
  if (modal) modal.style.display = 'none';
}

function editMed(idx) { showMedModal(idx); }

function deleteMed(idx) {
  if (!confirm('¿Eliminar este medicamento?')) return;
  VM.state.medications.splice(idx, 1);
  VM.save();
  syncMedsToCloud();
  Router.go('medications');
  showToast('🗑️ Medicamento eliminado');
}

function selectMedIcon(icon, btn) {
  document.getElementById('med-icon').value = icon;
  document.querySelectorAll('.med-icon-btn').forEach(b => {
    b.style.borderColor = 'var(--border)';
    b.style.background  = 'var(--white)';
  });
  btn.style.borderColor = 'var(--lavender)';
  btn.style.background  = 'var(--lavender-light)';
}

function selectMedColor(color, btn) {
  document.getElementById('med-color').value = color;
  document.querySelectorAll('.med-color-btn').forEach(b => {
    b.style.borderColor = 'transparent';
  });
  btn.style.borderColor = 'var(--text-dark)';
}

function updateTimePickers(existingTimes = null) {
  const sel       = document.getElementById('med-frequency');
  const container = document.getElementById('time-pickers-container');
  if (!sel || !container) return;

  const freq  = sel.value;
  const count = freq.includes('1') ? 1
              : freq.includes('2') || freq.includes('12') ? 2
              : freq.includes('3') || freq.includes('8')  ? 3
              : 1;

  const defaults = ['08:00', '14:00', '20:00'];
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const val = existingTimes ? (existingTimes[i] || defaults[i]) : defaults[i];
    const wrap = document.createElement('div');
    wrap.style.cssText = 'flex:1;min-width:90px;background:var(--white);border:1.5px solid var(--border);border-radius:var(--radius-sm);padding:10px;text-align:center';
    wrap.innerHTML = `
      <div style="font-size:10px;color:var(--text-mid);margin-bottom:4px">Toma ${i+1}</div>
      <input type="time" value="${val}" id="med-time-${i}"
             style="border:none;outline:none;font-size:16px;font-weight:700;
                    color:var(--text-dark);background:transparent;
                    text-align:center;width:100%;font-family:'Nunito',sans-serif">`;
    container.appendChild(wrap);
  }
}

function saveMed() {
  const name = document.getElementById('med-name').value.trim();
  if (!name) {
    setFieldError('form-group', 'Ingresá el nombre del medicamento');
    const nameInput = document.getElementById('med-name');
    nameInput.style.borderColor = 'var(--peach)';
    nameInput.focus();
    return;
  }

  const editIdx  = parseInt(document.getElementById('med-edit-idx').value);
  const freq     = document.getElementById('med-frequency').value;
  const count    = freq.includes('1') ? 1 : freq.includes('2') || freq.includes('12') ? 2 : 3;
  const times    = [];
  for (let i = 0; i < count; i++) {
    const t = document.getElementById(`med-time-${i}`)?.value;
    if (t) times.push(t);
  }

  const med = {
    name,
    dose:      document.getElementById('med-dose').value.trim(),
    frequency: freq,
    times,
    icon:      document.getElementById('med-icon').value,
    color:     document.getElementById('med-color').value,
    notes:     document.getElementById('med-notes').value.trim(),
    reminder:  document.getElementById('med-reminder').checked,
    takenCount: 0,
    takenTimes: [],
    createdAt:  new Date().toISOString(),
  };

  if (!VM.state.medications) VM.state.medications = [];

  if (editIdx >= 0) {
    // Preservar historial de tomas
    med.takenCount = VM.state.medications[editIdx].takenCount || 0;
    med.takenTimes = VM.state.medications[editIdx].takenTimes || [];
    VM.state.medications[editIdx] = med;
    showToast('✅ Medicamento actualizado');
  } else {
    VM.state.medications.push(med);
    showToast('✅ Medicamento agregado');
  }

  VM.save();
  syncMedsToCloud();

  // Agregar a recordatorios si tiene reminder
  if (med.reminder && typeof NotificationService !== 'undefined') {
    med.times.forEach(t => {
      NotificationService.scheduleLocalNotification(
        `💊 ${med.name}`,
        `Es hora de tomar tu ${med.name} (${med.dose})`,
        getDelayToTime(t)
      );
    });
  }

  closeMedModal();
  Router.go('medications');
}

function getDelayToTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const now    = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target - now;
}
