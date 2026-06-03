/* ============================================================
   pages/waiting.js — Pantalla de espera post-pago
   Se muestra después de que el usuario va a pagar a MP,
   mientras espera recibir el código de activación.
   ============================================================ */
Router.register('waiting', () => `
  <div style="min-height:100vh;display:flex;flex-direction:column;
              align-items:center;justify-content:center;
              padding:32px 24px;text-align:center;background:var(--bg)">

    <!-- Animación de espera -->
    <div style="width:80px;height:80px;border-radius:50%;
                background:linear-gradient(135deg,var(--sage-light),var(--sky-light));
                display:flex;align-items:center;justify-content:center;
                font-size:40px;margin-bottom:24px;
                animation:pulse 2s ease-in-out infinite">
      💬
    </div>

    <div style="font-family:'Lora',serif;font-size:24px;color:var(--text-dark);
                margin-bottom:10px;line-height:1.3">
      ¡Gracias por suscribirte!
    </div>
    <div style="font-size:14px;color:var(--text-mid);line-height:1.7;margin-bottom:32px">
      Una vez confirmado tu pago en Mercado Pago,<br>
      te enviamos el <strong>código de activación</strong><br>
      por <strong>WhatsApp y email</strong> en menos de 24 hs.
    </div>

    <!-- Pasos visuales -->
    <div style="width:100%;background:var(--white);border-radius:var(--radius);
                border:1px solid var(--border);padding:20px;margin-bottom:24px;
                text-align:left">
      <div style="font-size:13px;font-weight:700;color:var(--text-dark);margin-bottom:14px">
        ¿Qué pasa ahora?
      </div>

      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:14px">
        <div style="width:28px;height:28px;border-radius:50%;background:var(--sage);
                    color:#fff;display:flex;align-items:center;justify-content:center;
                    font-size:12px;font-weight:700;flex-shrink:0">1</div>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--text-dark)">Confirmás el pago</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:2px">
            Completás el proceso en Mercado Pago
          </div>
        </div>
      </div>

      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:14px">
        <div style="width:28px;height:28px;border-radius:50%;background:var(--sky);
                    color:#fff;display:flex;align-items:center;justify-content:center;
                    font-size:12px;font-weight:700;flex-shrink:0">2</div>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--text-dark)">Te enviamos el código</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:2px">
            Recibís un código por WhatsApp y email (máx. 24 hs)
          </div>
        </div>
      </div>

      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="width:28px;height:28px;border-radius:50%;background:var(--lavender);
                    color:#fff;display:flex;align-items:center;justify-content:center;
                    font-size:12px;font-weight:700;flex-shrink:0">3</div>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--text-dark)">Activás el Premium</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:2px">
            Ingresás el código en la app y ¡listo! ✅
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <button class="btn-primary" onclick="goTo('premium')" style="width:100%;margin-bottom:10px">
      🎟️ Ya tengo mi código → Activar
    </button>
    <button class="btn-outline" onclick="goTo('home')" style="width:100%">
      Volver al inicio
    </button>

    <div style="margin-top:20px;font-size:11px;color:var(--text-light);line-height:1.6">
      ¿Tardó más de 24 hs y no recibiste nada?<br>
      Escribinos por WhatsApp y te ayudamos enseguida.
    </div>
  </div>

  <style>
    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(123,174,142,0.3); }
      50%       { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(123,174,142,0); }
    }
  </style>
`);
