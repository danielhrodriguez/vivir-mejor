/* ============================================================
   pages/premium.js
   ============================================================ */
Router.register('premium', () => {
  const isPremium = Activation.isPremiumActive();

  if (isPremium) {
    // ── Vista para usuarios que YA son Premium ──────────────────
    return `
      <div class="header">
        <div style="display:flex;align-items:center">
          <button class="header-back" onclick="Router.back()">←</button>
          <div class="header-title">Mi Plan</div>
        </div>
      </div>

      <div style="margin:24px 16px;background:linear-gradient(135deg,var(--sage),var(--sky));
                  border-radius:var(--radius);padding:28px;color:#fff;text-align:center">
        <div style="font-size:48px;margin-bottom:8px">⭐</div>
        <div style="font-family:'Lora',serif;font-size:22px;font-weight:600;margin-bottom:4px">
          ¡Sos Premium!
        </div>
        <div style="font-size:13px;opacity:0.9">Tenés acceso completo a todas las funciones</div>
      </div>

      <div class="card">
        <div class="card-title">Tu suscripción</div>
        <div class="info-row" style="margin:0 0 8px">
          <span class="info-row-label">Estado</span>
          <span class="info-row-value" style="color:var(--sage)">✅ Activa</span>
        </div>
        <div class="info-row" style="margin:0 0 8px">
          <span class="info-row-label">Vence el</span>
          <span class="info-row-value">${Activation.premiumExpiryLabel()}</span>
        </div>
        <div class="info-row" style="margin:0">
          <span class="info-row-label">Plan</span>
          <span class="info-row-value">Premium $5 USD/mes</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Beneficios activos</div>
        <div class="plan-feature has"><i class="ti ti-check"></i> Hábitos ilimitados</div>
        <div class="plan-feature has"><i class="ti ti-check"></i> Estadísticas históricas</div>
        <div class="plan-feature has"><i class="ti ti-check"></i> Exportación de datos</div>
        <div class="plan-feature has"><i class="ti ti-check"></i> Recordatorios personalizados</div>
        <div class="plan-feature has"><i class="ti ti-check"></i> Sin publicidad</div>
        <div class="plan-feature has"><i class="ti ti-check"></i> Seguimiento de medicamentos</div>
      </div>

      <div style="padding:0 16px 24px;text-align:center;font-size:11px;color:var(--text-light)">
        Para renovar o cancelar, gestionalo desde tu cuenta de Mercado Pago.
      </div>
    `;
  }

  // ── Vista para usuarios en Plan Básico ──────────────────────────
  return `
    <div class="header">
      <div style="display:flex;align-items:center">
        <button class="header-back" onclick="Router.back()">←</button>
        <div class="header-title">Planes</div>
      </div>
    </div>

    <!-- HERO -->
    <div class="premium-hero">
      <div class="premium-hero-icon">✨</div>
      <h2>Vivir mejor</h2>
      <p>Elegí el plan que se adapta a vos</p>
    </div>

    <!-- PLAN BÁSICO -->
    <div class="plan-card">
      <div class="plan-name">Plan Básico</div>
      <div class="plan-price">Gratis <span>/ siempre</span></div>
      <div class="plan-divider"></div>
      <div class="plan-feature has"><i class="ti ti-check"></i> 3 hábitos simultáneos</div>
      <div class="plan-feature has"><i class="ti ti-check"></i> Estadísticas 7 días</div>
      <div class="plan-feature has"><i class="ti ti-check"></i> Recordatorios básicos</div>
      <div class="plan-feature no"><i class="ti ti-x"></i> Sin exportación de datos</div>
      <div class="plan-feature no"><i class="ti ti-x"></i> Incluye publicidad</div>
      <div class="plan-feature no"><i class="ti ti-x"></i> Sin historial completo</div>
      <button class="btn-outline" style="margin-top:14px"
              onclick="showToast('Ya estás en el Plan Básico ✓')">
        Plan actual
      </button>
    </div>

    <!-- PLAN PREMIUM -->
    <div class="plan-card featured">
      <div class="plan-badge">⭐ Recomendado</div>
      <div class="plan-name">Plan Premium</div>
      <div class="plan-price">$5 <span>USD / mes</span></div>
      <div class="plan-divider"></div>
      <div class="plan-feature has"><i class="ti ti-check"></i> Hábitos ilimitados</div>
      <div class="plan-feature has"><i class="ti ti-check"></i> Estadísticas históricas completas</div>
      <div class="plan-feature has"><i class="ti ti-check"></i> Exportación de datos (CSV / PDF)</div>
      <div class="plan-feature has"><i class="ti ti-check"></i> Recordatorios personalizados</div>
      <div class="plan-feature has"><i class="ti ti-check"></i> Sin publicidad</div>
      <div class="plan-feature has"><i class="ti ti-check"></i> Seguimiento de medicamentos</div>
      <div class="plan-feature has"><i class="ti ti-check"></i> Análisis de tendencias con IA</div>

      <!-- Botón → abre formulario de pre-checkout -->
      <button class="btn-primary"
              style="display:flex;align-items:center;justify-content:center;gap:10px;
                     width:100%;margin-top:14px"
              onclick="goTo('checkout')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.2)"/>
          <circle cx="12" cy="12" r="5"  fill="white"/>
        </svg>
        Suscribirme con Mercado Pago →
      </button>
    </div>

    <!-- SELLO SEGURIDAD -->
    <div style="margin:0 16px 8px;padding:12px 16px;background:#F7FAF8;
                border-radius:10px;border:1px solid var(--border);
                display:flex;align-items:center;gap:10px">
      <span style="font-size:22px">🔒</span>
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--text-dark)">Pago 100% seguro</div>
        <div style="font-size:11px;color:var(--text-mid)">
          Procesado por Mercado Pago · Podés cancelar cuando quieras
        </div>
      </div>
    </div>

    <!-- ── SECCIÓN CÓDIGO DE ACTIVACIÓN ────────────────────────── -->
    <div class="card" style="margin-top:4px">
      <div class="card-title">🎟️ ¿Ya tenés un código de activación?</div>
      <div style="font-size:12px;color:var(--text-mid);margin-bottom:10px;line-height:1.6">
        Si ya realizaste el pago, te enviamos un código por WhatsApp o email.
        Ingresalo acá para activar tu Plan Premium al instante.
      </div>

      <input type="text" id="activation-input"
             placeholder="Ej: VM-X4K9-P2M7-2025"
             maxlength="20"
             style="width:100%;padding:12px 14px;border-radius:var(--radius-sm);
                    border:1.5px solid var(--border);font-family:'Nunito',sans-serif;
                    font-size:15px;font-weight:700;letter-spacing:0.06em;
                    color:var(--text-dark);text-transform:uppercase;outline:none;
                    background:var(--white);transition:border-color 0.2s;margin-bottom:8px"
             oninput="this.value=this.value.toUpperCase()"
             onfocus="this.style.borderColor='var(--sage)'"
             onblur="this.style.borderColor='var(--border)'"
             onkeydown="if(event.key==='Enter')activateCode()">

      <div id="activation-error"
           style="display:none;font-size:12px;color:var(--peach);
                  margin-bottom:8px;padding:8px 12px;background:var(--peach-light);
                  border-radius:8px;border:1px solid #F5C9A8"></div>

      <button class="btn-primary" style="background:var(--sage)" onclick="activateCode()">
        Activar Plan Premium
      </button>
    </div>

    <div style="padding:0 16px 24px;text-align:center;font-size:11px;color:var(--text-light)">
      Al suscribirte aceptás los términos del servicio.<br>Sin permanencia. Sin compromisos.
    </div>
    <div style="height:20px"></div>
  `;
});

// ── Función de activación con Firebase ────────────────────────────
async function activateCode() {
  const input = document.getElementById('activation-input');
  const errEl = document.getElementById('activation-error');
  if (!input) return;

  const code = input.value.trim().toUpperCase();
  if (!code) { showError(errEl, 'Por favor ingresá el código de activación.'); return; }

  // Verificar login
  if (!AuthService.isLoggedIn()) {
    showError(errEl, 'Necesitás iniciar sesión antes de activar el código.');
    setTimeout(() => Router.go('login'), 1500);
    return;
  }

  const btn = document.querySelector('#screen-premium .btn-primary[onclick="activateCode()"]');
  if (btn) { btn.textContent = '⏳ Verificando...'; btn.disabled = true; }

  const result = await SubscriptionService.validateAndActivate(code);

  if (!result.ok) {
    showError(errEl, result.msg);
    input.style.borderColor = 'var(--peach)';
    if (btn) { btn.textContent = 'Activar Plan Premium'; btn.disabled = false; }
    return;
  }

  errEl.style.display     = 'none';
  input.style.borderColor = 'var(--sage)';
  showToast('🎉 ¡Plan Premium activado!');

  const ends = new Date(result.endsAt).toLocaleDateString('es-AR', {
    day:'numeric', month:'long', year:'numeric'
  });
  setTimeout(() => showSuccessScreen(ends), 600);
}

function showError(el, msg) {
  el.textContent    = '⚠️ ' + msg;
  el.style.display  = 'block';
}

function showSuccessScreen(endsDate) {
  const screen = document.getElementById('screen-premium');
  if (!screen) return;
  screen.innerHTML = `
    <div style="min-height:100vh;display:flex;flex-direction:column;
                align-items:center;justify-content:center;padding:32px 24px;text-align:center">
      <div style="font-size:72px;margin-bottom:16px;
                  animation:pop 0.4s cubic-bezier(0.34,1.56,0.64,1)">🎉</div>
      <div style="font-family:'Lora',serif;font-size:26px;color:var(--text-dark);margin-bottom:8px">
        ¡Bienvenido/a al Plan Premium!
      </div>
      <div style="font-size:14px;color:var(--text-mid);line-height:1.6;margin-bottom:32px">
        Tu suscripción está activa.<br>
        Vence el <strong>${endsDate}</strong>.
      </div>
      <div style="background:var(--sage-light);border-radius:var(--radius);
                  padding:20px;width:100%;margin-bottom:28px;text-align:left">
        <div style="font-size:13px;font-weight:700;color:var(--sage);margin-bottom:10px">
          Ya podés usar:
        </div>
        <div style="font-size:13px;color:var(--text-dark);line-height:2">
          ✅ Hábitos ilimitados<br>
          ✅ Estadísticas históricas<br>
          ✅ Exportación de datos<br>
          ✅ Recordatorios personalizados<br>
          ✅ Sin publicidad
        </div>
      </div>
      <button class="btn-primary" onclick="goTo('home')" style="width:100%">
        Ir al inicio →
      </button>
    </div>
    <style>
      @keyframes pop {
        from { transform: scale(0); opacity: 0; }
        to   { transform: scale(1); opacity: 1; }
      }
    </style>
  `;
}
