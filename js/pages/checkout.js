/* ============================================================
   pages/checkout.js — Formulario de pre-checkout profesional
   Se muestra ANTES de redirigir a MercadoPago.
   Guarda nombre, WhatsApp y email del suscriptor para que
   el admin sepa a quién enviarle el código de activación.
   ============================================================ */

Router.register('checkout', () => `
  <div class="header">
    <div style="display:flex;align-items:center">
      <button class="header-back" onclick="Router.go('premium')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
      <div>
        <div class="header-title">Suscripción Premium</div>
        <div class="header-sub">Paso 1 de 2 – Tus datos de contacto</div>
      </div>
    </div>
  </div>

  <!-- PROGRESS BAR -->
  <div style="height:3px;background:#E4EDE8;margin:0">
    <div style="height:100%;width:50%;background:linear-gradient(90deg,var(--sage),var(--sky));
                border-radius:0 2px 2px 0;transition:width 0.4s"></div>
  </div>

  <!-- RESUMEN DEL PLAN -->
  <div style="margin:16px 16px 0;padding:16px;
              background:linear-gradient(135deg,var(--sage),var(--sky));
              border-radius:var(--radius);color:#fff;
              display:flex;align-items:center;gap:14px">
    <div style="font-size:36px">⭐</div>
    <div>
      <div style="font-family:'Lora',serif;font-size:17px;font-weight:600">Plan Premium</div>
      <div style="font-size:13px;opacity:0.9;margin-top:2px">$5 USD / mes · Cancelá cuando quieras</div>
    </div>
    <div style="margin-left:auto;text-align:right">
      <div style="font-family:'Lora',serif;font-size:22px;font-weight:600">$5</div>
      <div style="font-size:10px;opacity:0.85">USD/mes</div>
    </div>
  </div>

  <!-- FORMULARIO -->
  <div class="card" style="margin-top:12px">
    <div style="font-size:14px;font-weight:700;color:var(--text-dark);margin-bottom:4px">
      Tus datos de contacto
    </div>
    <div style="font-size:12px;color:var(--text-mid);margin-bottom:18px;line-height:1.6">
      Los necesitamos para enviarte el código de activación
      una vez confirmado tu pago. No los compartimos con nadie.
    </div>

    <!-- Campo: Nombre -->
    <div class="form-group" id="fg-name">
      <label class="form-label">
        <i class="ti ti-user" style="font-size:14px;margin-right:4px;color:var(--sage)"></i>
        Nombre completo <span style="color:var(--peach)">*</span>
      </label>
      <input type="text" id="co-name" class="form-input"
             placeholder="Ej: María González"
             autocomplete="name"
             oninput="clearFieldError('fg-name')"
             onfocus="focusField(this)" onblur="blurField(this)">
      <div class="form-error" id="err-name"></div>
    </div>

    <!-- Campo: WhatsApp -->
    <div class="form-group" id="fg-whatsapp">
      <label class="form-label">
        <i class="ti ti-brand-whatsapp" style="font-size:14px;margin-right:4px;color:#25D366"></i>
        WhatsApp <span style="color:var(--peach)">*</span>
      </label>
      <div style="display:flex;gap:8px;align-items:flex-start">
        <!-- Selector de país -->
        <div style="position:relative;flex-shrink:0">
          <button id="country-selector-btn" onclick="toggleCountryDropdown()"
                  style="padding:11px 10px;background:var(--white);border:1.5px solid var(--border);
                         border-radius:var(--radius-sm);font-size:13px;font-weight:600;
                         color:var(--text-dark);white-space:nowrap;cursor:pointer;
                         display:flex;align-items:center;gap:6px;min-width:90px;
                         font-family:'Nunito',sans-serif">
            <span id="selected-flag">🇦🇷</span>
            <span id="selected-code">+54</span>
            <i class="ti ti-chevron-down" style="font-size:12px;color:var(--text-mid)"></i>
          </button>
          <!-- Dropdown de países -->
          <div id="country-dropdown"
               style="display:none;position:absolute;top:100%;left:0;z-index:50;
                      background:var(--white);border:1.5px solid var(--border);
                      border-radius:var(--radius-sm);box-shadow:0 8px 24px rgba(0,0,0,0.12);
                      min-width:220px;max-height:260px;overflow-y:auto;margin-top:4px">
            ${[
              ['🇦🇷','Argentina','+54'],
              ['🇧🇴','Bolivia','+591'],
              ['🇧🇷','Brasil','+55'],
              ['🇨🇱','Chile','+56'],
              ['🇨🇴','Colombia','+57'],
              ['🇨🇷','Costa Rica','+506'],
              ['🇨🇺','Cuba','+53'],
              ['🇪🇨','Ecuador','+593'],
              ['🇸🇻','El Salvador','+503'],
              ['🇪🇸','España','+34'],
              ['🇬🇹','Guatemala','+502'],
              ['🇭🇳','Honduras','+504'],
              ['🇲🇽','México','+52'],
              ['🇳🇮','Nicaragua','+505'],
              ['🇵🇦','Panamá','+507'],
              ['🇵🇾','Paraguay','+595'],
              ['🇵🇪','Perú','+51'],
              ['🇵🇷','Puerto Rico','+1787'],
              ['🇩🇴','Rep. Dominicana','+1809'],
              ['🇺🇾','Uruguay','+598'],
              ['🇻🇪','Venezuela','+58'],
              ['🇺🇸','Estados Unidos','+1'],
              ['🇬🇧','Reino Unido','+44'],
              ['🇮🇹','Italia','+39'],
              ['🇫🇷','Francia','+33'],
              ['🇩🇪','Alemania','+49'],
            ].map(([flag, name, code]) => `
              <button onclick="selectCountry('${flag}','${code}')"
                      style="width:100%;padding:10px 14px;border:none;background:none;
                             text-align:left;cursor:pointer;font-family:'Nunito',sans-serif;
                             font-size:13px;color:var(--text-dark);display:flex;
                             align-items:center;gap:10px;transition:background 0.15s"
                      onmouseover="this.style.background='var(--bg)'"
                      onmouseout="this.style.background='none'">
                <span style="font-size:18px">${flag}</span>
                <span style="flex:1">${name}</span>
                <span style="color:var(--text-mid);font-weight:600">${code}</span>
              </button>`
            ).join('')}
          </div>
        </div>
        <input type="hidden" id="co-country-code" value="+54">
        <input type="tel" id="co-whatsapp" class="form-input" style="flex:1;margin:0"
               placeholder="11 2345-6789"
               autocomplete="tel"
               maxlength="15"
               oninput="formatPhone(this);clearFieldError('fg-whatsapp')"
               onfocus="focusField(this)" onblur="blurField(this)">
      </div>
      <div class="form-error" id="err-whatsapp"></div>
      <div style="font-size:11px;color:var(--text-light);margin-top:4px">
        Te enviamos el código de activación por acá
      </div>
    </div>
      </div>
      <div class="form-error" id="err-whatsapp"></div>
      <div style="font-size:11px;color:var(--text-light);margin-top:4px">
        Te enviamos el código de activación por acá
      </div>
    </div>

    <!-- Campo: Email -->
    <div class="form-group" id="fg-email">
      <label class="form-label">
        <i class="ti ti-mail" style="font-size:14px;margin-right:4px;color:var(--sky)"></i>
        Email <span style="color:var(--peach)">*</span>
      </label>
      <input type="email" id="co-email" class="form-input"
             placeholder="Ej: maria@gmail.com"
             autocomplete="email"
             oninput="clearFieldError('fg-email')"
             onfocus="focusField(this)" onblur="blurField(this)">
      <div class="form-error" id="err-email"></div>
      <div style="font-size:11px;color:var(--text-light);margin-top:4px">
        También enviamos el código por email como respaldo
      </div>
    </div>

    <!-- Checkbox privacidad -->
    <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;
                  padding:12px;background:var(--bg);border-radius:8px;margin-top:4px">
      <input type="checkbox" id="co-privacy" style="margin-top:2px;accent-color:var(--sage);
             width:16px;height:16px;flex-shrink:0;cursor:pointer">
      <span style="font-size:12px;color:var(--text-mid);line-height:1.5">
        Acepto que mis datos sean usados únicamente para gestionar mi suscripción
        a <strong>Vivir Mejor</strong>. No se comparten con terceros.
      </span>
    </label>
    <div class="form-error" id="err-privacy" style="margin-top:4px"></div>
  </div>

  <!-- GARANTÍAS -->
  <div style="display:flex;gap:8px;padding:0 16px;margin-bottom:8px">
    <div style="flex:1;background:var(--white);border:1px solid var(--border);border-radius:10px;
                padding:10px;text-align:center">
      <div style="font-size:18px;margin-bottom:3px">🔒</div>
      <div style="font-size:10px;color:var(--text-mid);font-weight:600;line-height:1.3">
        Datos protegidos
      </div>
    </div>
    <div style="flex:1;background:var(--white);border:1px solid var(--border);border-radius:10px;
                padding:10px;text-align:center">
      <div style="font-size:18px;margin-bottom:3px">✅</div>
      <div style="font-size:10px;color:var(--text-mid);font-weight:600;line-height:1.3">
        Sin permanencia
      </div>
    </div>
    <div style="flex:1;background:var(--white);border:1px solid var(--border);border-radius:10px;
                padding:10px;text-align:center">
      <div style="font-size:18px;margin-bottom:3px">💬</div>
      <div style="font-size:10px;color:var(--text-mid);font-weight:600;line-height:1.3">
        Soporte por WhatsApp
      </div>
    </div>
  </div>

  <!-- BOTÓN CONTINUAR -->
  <div style="padding:4px 16px 32px">
    <button class="btn-primary" id="checkout-submit-btn"
            style="font-size:16px;padding:16px;display:flex;align-items:center;
                   justify-content:center;gap:10px"
            onclick="submitCheckout()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.2)"/>
        <circle cx="12" cy="12" r="5" fill="white"/>
      </svg>
      Continuar al pago →
    </button>
    <div style="text-align:center;font-size:11px;color:var(--text-light);margin-top:10px">
      Serás redirigido/a a Mercado Pago para completar el pago de forma segura
    </div>
  </div>
`);

// ── Estilos del formulario (se inyectan una sola vez) ──────────────
(function injectFormStyles() {
  if (document.getElementById('checkout-styles')) return;
  const s = document.createElement('style');
  s.id = 'checkout-styles';
  s.textContent = `
    .form-group  { margin-bottom: 16px; }
    .form-label  {
      display: block; font-size: 12px; font-weight: 700;
      color: var(--text-mid); margin-bottom: 6px; text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .form-input  {
      width: 100%; padding: 12px 14px; border-radius: var(--radius-sm);
      border: 1.5px solid var(--border); font-family: 'Nunito', sans-serif;
      font-size: 15px; color: var(--text-dark); background: var(--white);
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    }
    .form-input.focused {
      border-color: var(--sage);
      box-shadow: 0 0 0 3px rgba(123,174,142,0.15);
    }
    .form-input.error  { border-color: var(--peach) !important; }
    .form-input.valid  { border-color: var(--sage); }
    .form-error {
      font-size: 11px; color: var(--peach); margin-top: 5px;
      min-height: 14px; font-weight: 600;
    }
  `;
  document.head.appendChild(s);
})();

// ── Selector de país ──────────────────────────────────────────────
function toggleCountryDropdown() {
  const dd = document.getElementById('country-dropdown');
  if (!dd) return;
  dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
  // Cerrar al hacer click afuera
  setTimeout(() => {
    document.addEventListener('click', function closeDD(e) {
      if (!e.target.closest('#country-selector-btn') && !e.target.closest('#country-dropdown')) {
        dd.style.display = 'none';
        document.removeEventListener('click', closeDD);
      }
    });
  }, 10);
}

function selectCountry(flag, code) {
  document.getElementById('selected-flag').textContent  = flag;
  document.getElementById('selected-code').textContent  = code;
  document.getElementById('co-country-code').value      = code;
  document.getElementById('country-dropdown').style.display = 'none';
  // Actualizar placeholder según país
  const ph = code === '+54' ? '11 2345-6789'
           : code === '+55' ? '11 9 1234-5678'
           : code === '+52' ? '55 1234-5678'
           : code === '+1'  ? '555 123-4567'
           : '123 456-7890';
  const inp = document.getElementById('co-whatsapp');
  if (inp) inp.placeholder = ph;
}
function focusField(el) { el.classList.add('focused'); }
function blurField(el)  { el.classList.remove('focused'); }

function clearFieldError(groupId) {
  const fg  = document.getElementById(groupId);
  const inp = fg && fg.querySelector('.form-input');
  const err = fg && fg.querySelector('.form-error');
  if (inp) { inp.classList.remove('error'); }
  if (err) { err.textContent = ''; }
}

function setFieldError(groupId, msg) {
  const fg  = document.getElementById(groupId);
  const inp = fg && fg.querySelector('.form-input');
  const err = fg && fg.querySelector('.form-error');
  if (inp) { inp.classList.add('error'); inp.classList.remove('valid'); }
  if (err) { err.textContent = msg; }
}

function setFieldValid(groupId) {
  const fg  = document.getElementById(groupId);
  const inp = fg && fg.querySelector('.form-input');
  if (inp) { inp.classList.remove('error'); inp.classList.add('valid'); }
}

function formatPhone(el) {
  // Deja solo números y espacios/guiones
  let v = el.value.replace(/[^\d\s\-]/g, '');
  el.value = v;
}

// ── Validación y envío ─────────────────────────────────────────────
async function submitCheckout() {
  const name     = document.getElementById('co-name').value.trim();
  const whatsapp = document.getElementById('co-whatsapp').value.trim();
  const email    = document.getElementById('co-email').value.trim();
  const privacy  = document.getElementById('co-privacy').checked;
  let   valid    = true;

  // Validar nombre
  if (!name || name.length < 3) {
    setFieldError('fg-name', 'Ingresá tu nombre completo (mínimo 3 caracteres)');
    valid = false;
  } else { setFieldValid('fg-name'); }

  // Validar WhatsApp
  const phoneDigits = whatsapp.replace(/\D/g, '');
  if (!whatsapp || phoneDigits.length < 8) {
    setFieldError('fg-whatsapp', 'Ingresá un número de WhatsApp válido');
    valid = false;
  } else { setFieldValid('fg-whatsapp'); }

  // Validar email
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRx.test(email)) {
    setFieldError('fg-email', 'Ingresá un email válido (Ej: nombre@gmail.com)');
    valid = false;
  } else { setFieldValid('fg-email'); }

  // Validar privacidad
  if (!privacy) {
    const errPriv = document.getElementById('err-privacy');
    if (errPriv) errPriv.textContent = '⚠️ Necesitamos que aceptes para continuar';
    valid = false;
  } else {
    const errPriv = document.getElementById('err-privacy');
    if (errPriv) errPriv.textContent = '';
  }

  if (!valid) {
    // Scroll al primer error
    const firstErr = document.querySelector('.form-input.error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // ✅ Guardar en Firebase (y localStorage como backup)
  const countryCode = document.getElementById('co-country-code')?.value || '+54';
  await SubscriptionService.saveSubscriber({ name, whatsapp: countryCode + ' ' + whatsapp, email });

  // Animación en el botón
  const btn = document.getElementById('checkout-submit-btn');
  if (btn) {
    btn.textContent = '⏳ Redirigiendo a Mercado Pago...';
    btn.disabled    = true;
    btn.style.opacity = '0.8';
  }

  // Pequeña pausa antes de abrir MP (mejor UX)
  setTimeout(() => {
    window.open(
      'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=4892b65faf884ebcb44774d9c963ba9d',
      '_blank'
    );
    // Mostrar pantalla de espera de código
    Router.go('waiting');
  }, 900);
}
