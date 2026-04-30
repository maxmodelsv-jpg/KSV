(() => {
  const maskPhone = (input) => {
    const format = (digits) => {
      let d = digits.replace(/\D/g, '');
      if (d.startsWith('8')) d = '7' + d.slice(1);
      if (!d.startsWith('7')) d = '7' + d;
      d = d.slice(0, 11);
      let out = '+7';
      if (d.length > 1) out += ' (' + d.slice(1, 4);
      if (d.length >= 4) out += ') ' + d.slice(4, 7);
      if (d.length >= 7) out += '-' + d.slice(7, 9);
      if (d.length >= 9) out += '-' + d.slice(9, 11);
      return out;
    };
    input.addEventListener('input', () => { input.value = format(input.value); });
    input.addEventListener('focus', () => { if (!input.value) input.value = '+7 ('; });
    input.addEventListener('blur', () => { if (input.value === '+7 (') input.value = ''; });
  };

  document.querySelectorAll('.phone-mask').forEach(maskPhone);

  const validatePhone = (v) => /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(v);

  const getUtm = () => {
    const p = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(k => {
      const v = p.get(k);
      if (v) utm[k] = v;
    });
    return utm;
  };

  const submitForm = async (form) => {
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    if (form.querySelector('input[name="website"]').value) return;

    const fd = new FormData(form);
    const phone = fd.get('phone');
    if (!validatePhone(phone)) {
      alert('Проверьте номер телефона');
      return;
    }

    const payload = {
      source: fd.get('source'),
      name: fd.get('name'),
      phone,
      device: fd.get('device') || '',
      problem: fd.get('problem') || '',
      consent: !!fd.get('consent'),
      utm: getUtm(),
      at: new Date().toISOString(),
    };

    btn.disabled = true;
    btn.textContent = 'Отправляем...';

    payload.website = form.querySelector('input[name="website"]').value || '';

    try {
      const res = await fetch('/submit.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        throw new Error(data.error || `http_${res.status}`);
      }

      if (window.ym && window.YM_COUNTER_ID) {
        const goal = payload.source === 'hero' ? 'form_submit_hero' : 'form_submit_contacts';
        window.ym(window.YM_COUNTER_ID, 'reachGoal', goal);
      }

      form.innerHTML = `
        <div class="text-center py-6" role="status" aria-live="polite">
          <div class="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <svg class="w-7 h-7 text-accent" aria-hidden="true"><use href="#i-check"/></svg>
          </div>
          <div class="font-display font-bold text-xl mb-2">Заявка принята</div>
          <p class="text-muted text-sm">Перезвоним с 09:00 до 21:00</p>
        </div>
      `;
    } catch (err) {
      console.error('[KSV] form submit failed', err);
      btn.disabled = false;
      btn.textContent = originalText;
      alert('Не удалось отправить. Позвоните по телефону +7 (964) 637-55-95');
    }
  };

  document.querySelectorAll('form#hero-form, form#contacts-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (form.dataset.submitting === '1') return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      form.dataset.submitting = '1';
      Promise.resolve(submitForm(form)).finally(() => {
        delete form.dataset.submitting;
      });
    });
  });
})();
