/* ============================================================
   pages/mood.js
   ============================================================ */
Router.register('mood', () => {
  const m = VM.state.mood;

  const emojiButtons = m.options.map((emoji, i) => `
    <div style="text-align:center">
      <button class="mood-btn ${i === m.selected ? 'selected' : ''}"
              onclick="selectMood(${i})" aria-label="${m.labels[i]}">${emoji}</button>
      <div class="mood-label">${m.labels[i]}</div>
    </div>
  `).join('');

  return `
    <div class="header">
      <div style="display:flex;align-items:center">
        <button class="header-back" onclick="Router.back()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
        <div class="header-title">Estado de ánimo</div>
      </div>
    </div>

    <div class="mood-question">¿Cómo te sentís hoy?</div>

    <div class="mood-emojis">${emojiButtons}</div>

    <div style="padding:0 16px 8px;font-size:13px;color:var(--text-mid)">
      ¿Querés agregar una nota?
    </div>
    <textarea class="mood-textarea" id="mood-note"
              placeholder="Cómo fue tu día, qué sentiste...">${m.note || ''}</textarea>

    <div style="padding:12px 16px 4px">
      <button class="btn-primary" style="background:var(--peach)" onclick="saveMoodCheckin()">
        Guardar check-in
      </button>
    </div>

    <div class="section-title">Esta semana</div>
    <div class="card">
      <div class="mood-week" id="mood-week-row"></div>
    </div>
  <div style="height:20px"></div>
  `;
});

Router.register('mood_after', () => {
  const row = document.getElementById('mood-week-row');
  if (row) buildMoodWeek(row, VM.state.mood.weekData);
});

function selectMood(i) {
  VM.state.mood.selected = i;
  VM.save();
  document.querySelectorAll('.mood-btn').forEach((b, j) => {
    b.classList.toggle('selected', j === i);
  });
}

function saveMoodCheckin() {
  const note = document.getElementById('mood-note');
  VM.state.mood.note = note ? note.value : '';
  VM.save();
  showToast('😊 ¡Check-in guardado!');
  Router.go('home');
}
