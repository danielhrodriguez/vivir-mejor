/* ============================================================
   pages/admin.js — Panel de administración (solo para vos)
   Acceso: tocá el logo 10 veces en la pantalla de bienvenida
   ============================================================ */
Router.register('admin', () => {
  const codes   = Activation.getSavedCodes();
  const entries = Object.entries(codes);
  const used    = entries.filter(([,v]) => v.used).length;
  const active  = entries.filter(([,v]) => !v.used && Date.now() < v.expiresAt).length;

  const codeRows = entries.length === 0
    ? `<div style="text-align:center;padding:24px;color:var(--text-light);font-size:13px">
         No hay códigos generados aún
       </div>`
    : entries.reverse().map(([code, data]) => {
        const status = data.used
          ? '<span style="color:var(--text-light)">✓ Usado</span>'
          : Date.now() > data.expiresAt
            ? '<span style="color:var(--peach)">⏰ Vencido</span>'
            : '<span style="color:var(--sage)">✅ Activo</span>';
        const date = new Date(data.created).toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit' });
        return `
          <div style="display:flex;align-items:center;justify-content:space-between;
                      padding:10px 0;border-bottom:1px solid var(--border);font-size:12px">
            <div>
              <div style="font-weight:700;color:var(--text-dark);letter-spacing:0.05em">${code}</div>
              <div style="color:var(--text-mid);margin-top:2px">Creado: ${date}</div>
            </div>
            <div style="text-align:right">
              ${status}
              <button onclick="copyCode('${code}')"
                      style="display:block;margin-top:4px;padding:3px 10px;border-radius:6px;
                             background:var(--sage-light);border:none;color:var(--sage);
                             font-size:10px;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif">
                Copiar
              </button>
            </div>
          </div>`;
      }).join('');

  return `
    <div class="header">
      <div style="display:flex;align-items:center">
        <button class="header-back" onclick="Router.go('welcome')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
        <div>
          <div class="header-title">Panel Admin 🔐</div>
          <div class="header-sub">Solo visible para vos</div>
        </div>
      </div>
    </div>

    <!-- STATS RÁPIDAS -->
    <div class="score-row" style="margin-top:12px">
      <div class="score-card">
        <div class="score-num" style="color:var(--sage)">${entries.length}</div>
        <div class="score-lbl">Códigos totales</div>
      </div>
      <div class="score-card">
        <div class="score-num" style="color:var(--sky)">${active}</div>
        <div class="score-lbl">Activos</div>
      </div>
      <div class="score-card">
        <div class="score-num" style="color:var(--text-light)">${used}</div>
        <div class="score-lbl">Usados</div>
      </div>
    </div>

    <!-- GENERAR NUEVO CÓDIGO -->
    <div class="card" style="margin-top:4px">
      <div class="card-title">Generar código para nuevo suscriptor</div>

      <div style="margin-bottom:10px">
        <label style="font-size:12px;color:var(--text-mid);display:block;margin-bottom:4px">
          Duración de la suscripción
        </label>
        <select id="admin-duration"
                style="width:100%;padding:10px;border-radius:8px;border:1.5px solid var(--border);
                       font-family:'Nunito',sans-serif;font-size:13px;color:var(--text-dark);
                       background:var(--white);outline:none">
          <option value="30">1 mes (30 días)</option>
          <option value="90">3 meses (90 días)</option>
          <option value="180">6 meses (180 días)</option>
          <option value="365">1 año (365 días)</option>
        </select>
      </div>

      <div id="generated-code-box" style="display:none;margin-bottom:10px;
           padding:14px;background:var(--sage-light);border-radius:10px;text-align:center">
        <div style="font-size:11px;color:var(--text-mid);margin-bottom:4px">Código generado:</div>
        <div id="generated-code-text"
             style="font-size:20px;font-weight:700;color:var(--sage);letter-spacing:0.08em"></div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:4px" id="generated-code-expiry"></div>
      </div>

      <button class="btn-primary" onclick="adminGenerateCode()" style="margin-bottom:8px">
        ✨ Generar código nuevo
      </button>
      <button id="admin-copy-btn" class="btn-outline" style="display:none" onclick="adminCopyCode()">
        📋 Copiar código para enviar
      </button>
      <button id="admin-whatsapp-btn" class="btn-outline"
              style="display:none;margin-top:8px;border-color:#25D366;color:#25D366"
              onclick="adminShareWhatsApp()">
        💬 Enviar por WhatsApp
      </button>
    </div>

    <!-- SUSCRIPTORES PENDIENTES -->
    <div class="card">
      <div class="card-title">📋 Suscriptores que pagaron — pendientes de código</div>
      <div id="pending-list"></div>
    </div>

    <!-- LISTA DE CÓDIGOS -->
    <div class="card">
      <div class="card-title">Historial de códigos</div>
      <div id="codes-list">${codeRows}</div>
    </div>

    <!-- INSTRUCCIONES -->
    <div style="margin:0 16px 24px;padding:14px 16px;background:var(--amber-light);
                border-radius:10px;border:1px solid #EED4A0">
      <div style="font-size:12px;font-weight:700;color:var(--amber);margin-bottom:6px">
        📋 Flujo de activación
      </div>
      <div style="font-size:11px;color:var(--text-mid);line-height:1.8">
        1. Usuario paga en MercadoPago<br>
        2. Recibís el email de confirmación de MP<br>
        3. Entrás acá y generás un código<br>
        4. Lo enviás por WhatsApp o email al usuario<br>
        5. El usuario lo ingresa en la app → ✅ Premium activado
      </div>
    </div>
  `;
});

Router.register('admin_after', async () => {
  // Cargar suscriptores desde Firebase (con fallback a localStorage)
  const pending = await SubscriptionService.getPendingSubscribers();
  const listEl  = document.getElementById('pending-list');
  if (!listEl) return;

  if (pending.length === 0) {
    listEl.innerHTML = `<div style="text-align:center;padding:20px;
                         color:var(--text-light);font-size:13px">
                         No hay suscriptores pendientes 🎉</div>`;
    return;
  }

  listEl.innerHTML = pending.map((s, i) => {
    const date = s.registeredAt?.toDate
      ? s.registeredAt.toDate().toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })
      : new Date(s.date || Date.now()).toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit' });
    return `
      <div style="padding:12px 0;border-bottom:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
          <div style="font-size:13px;font-weight:700;color:var(--text-dark)">${s.name}</div>
          <div style="font-size:11px;font-weight:700;color:var(--amber)">⏳ Pendiente</div>
        </div>
        <div style="font-size:12px;color:var(--text-mid);margin-bottom:2px">
          <i class="ti ti-brand-whatsapp" style="color:#25D366"></i> ${s.whatsapp}
        </div>
        <div style="font-size:12px;color:var(--text-mid);margin-bottom:8px">
          <i class="ti ti-mail" style="color:var(--sky)"></i> ${s.email}
        </div>
        <div style="font-size:10px;color:var(--text-light);margin-bottom:8px">Registrado: ${date}</div>
        <div style="display:flex;gap:8px">
          <button onclick="adminContactWhatsApp('${s.whatsapp}','${s.name}','${s.id||i}')"
                  style="flex:1;padding:7px;border-radius:8px;background:#25D366;border:none;
                         color:#fff;font-size:11px;font-weight:700;cursor:pointer;
                         font-family:'Nunito',sans-serif">💬 WhatsApp</button>
          <button onclick="adminContactEmail('${s.email}','${s.name}','${s.id||i}')"
                  style="flex:1;padding:7px;border-radius:8px;background:var(--sky-light);
                         border:1px solid var(--sky);color:var(--sky);font-size:11px;
                         font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif">📧 Email</button>
        </div>
      </div>`;
  }).join('');
});

async function adminGenerateCode() {
  const duration = parseInt(document.getElementById('admin-duration').value);
  const result   = await SubscriptionService.createCode(duration);
  _lastGeneratedCode = result.code;

  const now    = Date.now();
  const expiry = new Date(now + 7*24*60*60*1000).toLocaleDateString('es-AR', { day:'numeric', month:'long' });
  const subEnd = new Date(now + duration*24*60*60*1000).toLocaleDateString('es-AR', { day:'numeric', month:'long', year:'numeric' });

  document.getElementById('generated-code-text').textContent = result.code;
  document.getElementById('generated-code-expiry').textContent =
    `Válido hasta ${expiry} · Suscripción hasta ${subEnd}`;
  document.getElementById('generated-code-box').style.display = 'block';
  document.getElementById('admin-copy-btn').style.display     = 'block';
  document.getElementById('admin-whatsapp-btn').style.display = 'block';
  showToast('✅ Código generado y guardado en Firebase');
}

async function adminContactWhatsApp(whatsapp, name, id) {
  const result = await SubscriptionService.createCode(30);
  const phone  = whatsapp.replace(/\D/g, '');
  const msg    = encodeURIComponent(buildActivationMessage(result.code, name));
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  showToast('💬 Abriendo WhatsApp...');
}

async function adminContactEmail(email, name, id) {
  const result  = await SubscriptionService.createCode(30);
  const subject = encodeURIComponent('🌿 Vivir Mejor – Tu código de activación Premium');
  const body    = encodeURIComponent(buildActivationMessage(result.code, name).replace(/\*/g, ''));
  window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
  showToast('📧 Abriendo email...');
}

function adminCopyCode() {
  if (!_lastGeneratedCode) return;
  const text = buildActivationMessage(_lastGeneratedCode, '');
  navigator.clipboard.writeText(text).then(() => showToast('📋 ¡Copiado!'));
}

function adminShareWhatsApp() {
  if (!_lastGeneratedCode) return;
  const msg = encodeURIComponent(buildActivationMessage(_lastGeneratedCode, ''));
  window.open('https://wa.me/?text=' + msg, '_blank');
}

function buildActivationMessage(code, name) {
  const saludo = name ? `Hola ${name.split(' ')[0]}!` : 'Hola!';
  return `🌿 *Vivir Mejor – Activación Premium*\n\n${saludo} Tu suscripción fue confirmada ✅\n\nTu código de activación es:\n\n*${code}*\n\nPasos para activar:\n1. Abrí la app Vivir Mejor\n2. Andá a la sección *Premium* (estrella ⭐ en el menú)\n3. Tocá *"¿Ya tenés un código?"*\n4. Ingresá el código y listo 🎉\n\nCualquier consulta respondé este mensaje. ¡Que disfrutes el Plan Premium!`;
}

function copyCode(code) {
  navigator.clipboard.writeText(code).then(() => showToast('📋 Código copiado'));
}
