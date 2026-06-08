/* ============================================================
   pages/login.js — Pantalla de login / registro con Firebase
   ============================================================ */

Router.register('login', () => `
  <div style="min-height:100vh;display:flex;flex-direction:column;
              background:var(--bg);padding:0 0 32px">

    <!-- HEADER VISUAL -->
    <div style="background:linear-gradient(135deg,var(--sage),var(--sky));
                padding:48px 24px 32px;text-align:center;color:#fff">
      <div style="font-size:48px;margin-bottom:10px">🌿</div>
      <div style="font-family:'Lora',serif;font-size:26px;font-weight:600">Vivir mejor</div>
      <div style="font-size:13px;opacity:0.9;margin-top:4px">Hábitos diarios · Bienestar</div>
    </div>

    <!-- TABS LOGIN / REGISTRO -->
    <div style="padding:24px 16px 0">
      <div style="display:flex;background:#EEF4F0;border-radius:11px;padding:3px;margin-bottom:20px">
        <button id="tab-login" class="stats-tab active"
                onclick="switchAuthTab('login')">Iniciar sesión</button>
        <button id="tab-register" class="stats-tab"
                onclick="switchAuthTab('register')">Crear cuenta</button>
      </div>

      <!-- ── PANEL LOGIN ── -->
      <div id="panel-login">

        <!-- Google -->
        <button onclick="loginGoogle()"
                style="width:100%;padding:13px;border-radius:var(--radius-sm);
                       border:1.5px solid var(--border);background:var(--white);
                       display:flex;align-items:center;justify-content:center;gap:10px;
                       font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;
                       color:var(--text-dark);cursor:pointer;margin-bottom:14px;
                       transition:box-shadow 0.2s"
                onmouseover="this.style.boxShadow='var(--shadow)'"
                onmouseout="this.style.boxShadow='none'">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </button>

        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <div style="flex:1;height:1px;background:var(--border)"></div>
          <span style="font-size:12px;color:var(--text-light)">o con email</span>
          <div style="flex:1;height:1px;background:var(--border)"></div>
        </div>

        <div class="form-group" id="fg-login-email">
          <label class="form-label">
            <i class="ti ti-mail" style="color:var(--sky);font-size:13px;margin-right:4px"></i>Email
          </label>
          <input type="email" id="login-email" class="form-input"
                 placeholder="tu@email.com" autocomplete="email"
                 onfocus="focusField(this)" onblur="blurField(this)"
                 onkeydown="if(event.key==='Enter')doLogin()">
          <div class="form-error" id="err-login-email"></div>
        </div>

        <div class="form-group" id="fg-login-pass">
          <label class="form-label">
            <i class="ti ti-lock" style="color:var(--sage);font-size:13px;margin-right:4px"></i>Contraseña
          </label>
          <div style="position:relative">
            <input type="password" id="login-pass" class="form-input" style="padding-right:44px"
                   placeholder="••••••••" autocomplete="current-password"
                   onfocus="focusField(this)" onblur="blurField(this)"
                   onkeydown="if(event.key==='Enter')doLogin()">
            <button onclick="togglePass('login-pass',this)"
                    style="position:absolute;right:12px;top:50%;transform:translateY(-50%);
                           background:none;border:none;cursor:pointer;color:var(--text-light);font-size:18px">
              <i class="ti ti-eye"></i>
            </button>
          </div>
          <div class="form-error" id="err-login-pass"></div>
        </div>

        <div id="login-general-error"
             style="display:none;padding:10px 14px;background:var(--peach-light);
                    border:1px solid #F5C9A8;border-radius:8px;font-size:12px;
                    color:var(--peach);font-weight:600;margin-bottom:10px"></div>

        <button class="btn-primary" id="login-btn" onclick="doLogin()" style="margin-bottom:10px">
          Iniciar sesión
        </button>
        <div style="text-align:center;font-size:12px;color:var(--text-mid)">
          ¿Olvidaste tu contraseña?
          <button onclick="resetPassword()" style="background:none;border:none;color:var(--sage);
                  font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif;font-size:12px">
            Recuperar
          </button>
        </div>
      </div>

      <!-- ── PANEL REGISTRO ── -->
      <div id="panel-register" style="display:none">

        <button onclick="loginGoogle()"
                style="width:100%;padding:13px;border-radius:var(--radius-sm);
                       border:1.5px solid var(--border);background:var(--white);
                       display:flex;align-items:center;justify-content:center;gap:10px;
                       font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;
                       color:var(--text-dark);cursor:pointer;margin-bottom:14px">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Registrarme con Google
        </button>

        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <div style="flex:1;height:1px;background:var(--border)"></div>
          <span style="font-size:12px;color:var(--text-light)">o con email</span>
          <div style="flex:1;height:1px;background:var(--border)"></div>
        </div>

        <div class="form-group" id="fg-reg-name">
          <label class="form-label">
            <i class="ti ti-user" style="color:var(--sage);font-size:13px;margin-right:4px"></i>Nombre completo
          </label>
          <input type="text" id="reg-name" class="form-input"
                 placeholder="Ej: María González" autocomplete="name"
                 onfocus="focusField(this)" onblur="blurField(this)">
          <div class="form-error" id="err-reg-name"></div>
        </div>

        <div class="form-group" id="fg-reg-email">
          <label class="form-label">
            <i class="ti ti-mail" style="color:var(--sky);font-size:13px;margin-right:4px"></i>Email
          </label>
          <input type="email" id="reg-email" class="form-input"
                 placeholder="tu@email.com" autocomplete="email"
                 onfocus="focusField(this)" onblur="blurField(this)">
          <div class="form-error" id="err-reg-email"></div>
        </div>

        <div class="form-group" id="fg-reg-pass">
          <label class="form-label">
            <i class="ti ti-lock" style="color:var(--lavender);font-size:13px;margin-right:4px"></i>Contraseña
          </label>
          <div style="position:relative">
            <input type="password" id="reg-pass" class="form-input" style="padding-right:44px"
                   placeholder="Mínimo 6 caracteres" autocomplete="new-password"
                   onfocus="focusField(this)" onblur="blurField(this)">
            <button onclick="togglePass('reg-pass',this)"
                    style="position:absolute;right:12px;top:50%;transform:translateY(-50%);
                           background:none;border:none;cursor:pointer;color:var(--text-light);font-size:18px">
              <i class="ti ti-eye"></i>
            </button>
          </div>
          <div class="form-error" id="err-reg-pass"></div>
        </div>

        <div id="reg-general-error"
             style="display:none;padding:10px 14px;background:var(--peach-light);
                    border:1px solid #F5C9A8;border-radius:8px;font-size:12px;
                    color:var(--peach);font-weight:600;margin-bottom:10px"></div>

        <button class="btn-primary" id="register-btn" onclick="doRegister()">
          Crear mi cuenta gratis
        </button>
      </div>
    </div>
  </div>
`);

// ── Funciones de la pantalla de login ─────────────────────────────

function switchAuthTab(tab) {
  document.getElementById('tab-login').classList.toggle('active',    tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  document.getElementById('panel-login').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('panel-register').style.display = tab === 'register' ? 'block' : 'none';
}

function togglePass(inputId, btn) {
  const inp  = document.getElementById(inputId);
  const icon = btn.querySelector('i');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.className = 'ti ti-eye-off';
  } else {
    inp.type = 'password';
    icon.className = 'ti ti-eye';
  }
}

async function loginGoogle() {
  const result = await AuthService.loginWithGoogle();
  if (result.ok) showToast('✅ ¡Bienvenido/a!');
}

async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const errEl = document.getElementById('login-general-error');
  errEl.style.display = 'none';

  if (!email) { setFieldError('fg-login-email', 'Ingresá tu email'); return; }
  if (!pass)  { setFieldError('fg-login-pass',  'Ingresá tu contraseña'); return; }

  const btn = document.getElementById('login-btn');
  btn.textContent = '⏳ Ingresando...';
  btn.disabled    = true;

  const result = await AuthService.loginWithEmail(email, pass);

  if (result.ok) {
    showToast('✅ ¡Bienvenido/a!');
  } else {
    errEl.textContent   = result.error;
    errEl.style.display = 'block';
    btn.textContent     = 'Iniciar sesión';
    btn.disabled        = false;
  }
}

async function doRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;
  const errEl = document.getElementById('reg-general-error');
  errEl.style.display = 'none';
  let valid = true;

  if (!name || name.length < 3) { setFieldError('fg-reg-name', 'Ingresá tu nombre completo'); valid = false; }
  else setFieldValid('fg-reg-name');

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRx.test(email)) { setFieldError('fg-reg-email', 'Ingresá un email válido'); valid = false; }
  else setFieldValid('fg-reg-email');

  if (!pass || pass.length < 6) { setFieldError('fg-reg-pass', 'La contraseña debe tener al menos 6 caracteres'); valid = false; }
  else setFieldValid('fg-reg-pass');

  if (!valid) return;

  const btn = document.getElementById('register-btn');
  btn.textContent = '⏳ Creando cuenta...';
  btn.disabled    = true;

  const result = await AuthService.registerWithEmail(name, email, pass);

  if (result.ok) {
    showToast('🎉 ¡Cuenta creada! Bienvenido/a');
  } else {
    errEl.textContent   = result.error;
    errEl.style.display = 'block';
    btn.textContent     = 'Crear mi cuenta gratis';
    btn.disabled        = false;
  }
}

async function resetPassword() {
  const email = document.getElementById('login-email').value.trim();
  if (!email) {
    setFieldError('fg-login-email', 'Ingresá tu email primero para recuperar la contraseña');
    return;
  }
  try {
    const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    await sendPasswordResetEmail(FB.auth, email);
    showToast('📧 Te enviamos un email para recuperar tu contraseña');
  } catch(e) {
    showToast('❌ No encontramos esa cuenta');
  }
}
