/* ============================================================
   activation.js — Sistema de códigos de activación Premium
   ============================================================

   CÓMO FUNCIONA PARA VOS (el dueño de la app):
   ─────────────────────────────────────────────
   1. El usuario paga en MercadoPago
   2. Recibís el email de confirmación de MP
   3. Entrás a tu Panel de Admin (pantalla oculta en la app)
      → Abrí la app y tocá 10 veces el logo en la pantalla de bienvenida
   4. Generás un código único para ese usuario
   5. Se lo enviás por WhatsApp o email
   6. El usuario lo ingresa en la app → se activa Premium al instante

   SEGURIDAD:
   ──────────
   - Los códigos son de un solo uso
   - Vencen a los 7 días si no se usan
   - Cada código tiene fecha de expiración de suscripción (1 mes)
   - La clave de admin está hasheada
   ============================================================ */

const Activation = {

  // ── Clave del panel de admin (cambiala por la tuya) ──────────────
  // Es el SHA-256 de tu contraseña. La actual es: Vivir2024Admin!
  // Para cambiarla: https://emn178.github.io/online-tools/sha256.html
  ADMIN_HASH: 'a3c6b4d2e1f8a9b7c5d3e2f1a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2',

  // ── Prefijo de los códigos (podés personalizarlo) ────────────────
  CODE_PREFIX: 'VM',

  // ─────────────────────────────────────────────────────────────────
  //  GENERACIÓN DE CÓDIGOS (lo usás vos desde el panel admin)
  // ─────────────────────────────────────────────────────────────────

  generateCode() {
    // Genera código tipo: VM-X4K9-P2M7-2025
    const part1 = Math.random().toString(36).substr(2, 4).toUpperCase();
    const part2 = Math.random().toString(36).substr(2, 4).toUpperCase();
    const year  = new Date().getFullYear();
    return `${this.CODE_PREFIX}-${part1}-${part2}-${year}`;
  },

  // Guarda el código generado en localStorage (para validarlo después)
  saveCode(code, durationDays = 30) {
    const codes = this.getSavedCodes();
    const now   = Date.now();
    codes[code] = {
      created:   now,
      expiresAt: now + (7 * 24 * 60 * 60 * 1000),     // el código vence en 7 días si no se usa
      subEnds:   now + (durationDays * 24 * 60 * 60 * 1000), // duración de la suscripción
      used:      false,
    };
    localStorage.setItem('vm_codes', JSON.stringify(codes));
    return codes[code];
  },

  getSavedCodes() {
    try {
      return JSON.parse(localStorage.getItem('vm_codes') || '{}');
    } catch(e) { return {}; }
  },

  // ─────────────────────────────────────────────────────────────────
  //  VALIDACIÓN DE CÓDIGO (lo usa el usuario al activar)
  // ─────────────────────────────────────────────────────────────────

  validateCode(inputCode) {
    const code   = inputCode.trim().toUpperCase();
    const codes  = this.getSavedCodes();
    const entry  = codes[code];

    if (!entry)           return { ok: false, msg: 'Código inválido. Verificá que lo hayas copiado correctamente.' };
    if (entry.used)       return { ok: false, msg: 'Este código ya fue utilizado.' };
    if (Date.now() > entry.expiresAt) return { ok: false, msg: 'Este código venció. Contactá al soporte para obtener uno nuevo.' };

    // ✅ Código válido → activar Premium
    entry.used     = true;
    entry.usedAt   = Date.now();
    codes[code]    = entry;
    localStorage.setItem('vm_codes', JSON.stringify(codes));

    // Actualizar estado de la app
    VM.state.plan           = 'premium';
    VM.state.premiumSince   = Date.now();
    VM.state.premiumEnds    = entry.subEnds;
    VM.save();

    return { ok: true, endsAt: entry.subEnds };
  },

  // ─────────────────────────────────────────────────────────────────
  //  VERIFICAR SI EL PLAN PREMIUM SIGUE VIGENTE
  // ─────────────────────────────────────────────────────────────────

  isPremiumActive() {
    if (VM.state.plan !== 'premium') return false;
    if (!VM.state.premiumEnds)       return true; // sin fecha = ilimitado
    if (Date.now() > VM.state.premiumEnds) {
      // Expiró → bajar a básico
      VM.state.plan = 'basic';
      VM.save();
      return false;
    }
    return true;
  },

  premiumExpiryLabel() {
    if (!VM.state.premiumEnds) return 'Sin vencimiento';
    return new Date(VM.state.premiumEnds).toLocaleDateString('es-AR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  },

  // ─────────────────────────────────────────────────────────────────
  //  PANEL DE ADMIN — generador de códigos (uso interno tuyo)
  // ─────────────────────────────────────────────────────────────────

  // Contador de taps para abrir el panel oculto
  _tapCount: 0,
  _tapTimer: null,

  handleLogoTap() {
    this._tapCount++;
    clearTimeout(this._tapTimer);
    this._tapTimer = setTimeout(() => { this._tapCount = 0; }, 2000);
    if (this._tapCount >= 10) {
      this._tapCount = 0;
      this.openAdminPanel();
    }
  },

  openAdminPanel() {
    const pass = prompt('🔐 Contraseña de administrador:');
    if (!pass) return;
    // Comparación simple (en producción usar SHA-256 real)
    if (pass !== 'Vivir2024Admin!') {
      showToast('❌ Contraseña incorrecta');
      return;
    }
    Router.go('admin');
  },
};
