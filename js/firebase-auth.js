/* ============================================================
   firebase-auth.js — Servicio de autenticación
   Maneja: login con Google, login con email, registro,
   cierre de sesión y estado del usuario actual.
   ============================================================ */

const AuthService = {

  currentUser: null,

  // ── Inicializar listener de estado ───────────────────────────────
  init() {
    FB.onAuthStateChanged(FB.auth, async (user) => {
      this.currentUser = user;
      if (user) {
        console.log('👤 Usuario autenticado:', user.email);
        // Crear/actualizar perfil en Firestore
        await UserService.ensureProfile(user);
        // Actualizar UI
        this.onLoginSuccess(user);
      } else {
        console.log('👤 Sin sesión activa');
        this.onLogout();
      }
    });
  },

  // ── Login con Google ─────────────────────────────────────────────
  async loginWithGoogle() {
    try {
      showToast('⏳ Conectando con Google...');
      const result = await FB.signInWithPopup(FB.auth, FB.googleProvider);
      return { ok: true, user: result.user };
    } catch (err) {
      console.error('Login Google error:', err);
      const msg = err.code === 'auth/popup-closed-by-user'
        ? 'Cerraste el popup. Intentá de nuevo.'
        : 'Error al conectar con Google. Intentá de nuevo.';
      showToast('❌ ' + msg);
      return { ok: false, error: msg };
    }
  },

  // ── Login con email/contraseña ───────────────────────────────────
  async loginWithEmail(email, password) {
    try {
      const result = await FB.signInWithEmailAndPassword(FB.auth, email, password);
      return { ok: true, user: result.user };
    } catch (err) {
      console.error('Login email error:', err);
      const msgs = {
        'auth/user-not-found':  'No existe una cuenta con ese email.',
        'auth/wrong-password':  'Contraseña incorrecta.',
        'auth/invalid-email':   'El email no es válido.',
        'auth/too-many-requests': 'Demasiados intentos. Esperá unos minutos.',
      };
      const msg = msgs[err.code] || 'Error al iniciar sesión. Intentá de nuevo.';
      return { ok: false, error: msg };
    }
  },

  // ── Registro con email/contraseña ────────────────────────────────
  async registerWithEmail(name, email, password) {
    try {
      const result = await FB.createUserWithEmailAndPassword(FB.auth, email, password);
      // Guardar nombre en el perfil
      await UserService.createProfile(result.user, { displayName: name });
      return { ok: true, user: result.user };
    } catch (err) {
      console.error('Register error:', err);
      const msgs = {
        'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
        'auth/weak-password':        'La contraseña debe tener al menos 6 caracteres.',
        'auth/invalid-email':        'El email no es válido.',
      };
      const msg = msgs[err.code] || 'Error al crear la cuenta. Intentá de nuevo.';
      return { ok: false, error: msg };
    }
  },

  // ── Cerrar sesión ────────────────────────────────────────────────
  async logout() {
    try {
      await FB.signOut(FB.auth);
      // Resetear estado en memoria (no borrar localStorage, para recordar datos al volver a entrar)
      VM.state = VM.defaultState();
      VM._currentUid = null;
      showToast('👋 Sesión cerrada');
      Router.go('login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  },

  // ── Callbacks de estado (los llama onAuthStateChanged) ───────────
  async onLoginSuccess(user) {
    // Cargar datos del usuario (por uid para aislar entre usuarios)
    VM.load(user.uid);
    const profile = await UserService.getProfile(user.uid);
    if (profile) {
      VM.state.userName     = profile.displayName || user.displayName || 'Usuario';
      VM.state.userInitials = this._initials(VM.state.userName);
      VM.state.plan         = profile.plan || 'basic';
      VM.state.premiumEnds  = profile.premiumEnds || null;
      VM.save(user.uid);
    }
    // Si estaba en login/welcome, ir al home
    const cur = Router.current;
    if (!cur || cur === 'login' || cur === 'welcome' || cur === 'register') {
      Router.go('home');
    } else {
      Router.go(cur);
    }
  },

  onLogout() {
    if (Router.current !== 'welcome') Router.go('login');
  },

  _initials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  },

  isLoggedIn() {
    return !!FB.auth.currentUser;
  },
};
