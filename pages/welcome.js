/* ============================================================
   pages/welcome.js
   ============================================================ */
Router.register('welcome', () => `
  <div class="welcome-wrap">
    <div class="welcome-logo" onclick="Activation.handleLogoTap()" style="cursor:default">🌿</div>
    <h1 class="welcome-h1">Vivir <span>mejor</span><br>cada día</h1>
    <p class="welcome-sub">
      Tu compañero de hábitos diarios para<br>
      una vida más saludable y equilibrada.
    </p>

    <div class="welcome-features">
      <div class="wf-item">
        <div class="wf-dot" style="background:#F0EDF8">😴</div>
        <div class="wf-text">Sueño – Registrá y analizá tus horas de descanso</div>
      </div>
      <div class="wf-item">
        <div class="wf-dot" style="background:#E8F3F8">💧</div>
        <div class="wf-text">Hidratación – Llevá el control de tu agua diaria</div>
      </div>
      <div class="wf-item">
        <div class="wf-dot" style="background:#EAF4EF">🏃</div>
        <div class="wf-text">Ejercicio – Seguimiento de tu actividad física</div>
      </div>
      <div class="wf-item">
        <div class="wf-dot" style="background:#FDF0E8">😊</div>
        <div class="wf-text">Estado de ánimo – Check-in emocional diario</div>
      </div>
      <div class="wf-item">
        <div class="wf-dot" style="background:#FBF3E3">📊</div>
        <div class="wf-text">Estadísticas – Gráficos semanales y mensuales</div>
      </div>
    </div>

    <button class="btn-start" onclick="goTo('home')">Comenzar ahora →</button>
  </div>
`);
