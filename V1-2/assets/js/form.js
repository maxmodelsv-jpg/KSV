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
      utm: getUtm(),
      at: new Date().toISOString(),
    };

    btn.disabled = true;
    btn.textContent = 'Отправляем...';

    try {
      console.log('[KSV] Заявка (заглушка, эндпоинт подключим на Этапе 4):', payload);
      await new Promise(r => setTimeout(r, 700));

      form.innerHTML = `
        <div class="text-center py-6">
          <div class="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <svg class="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="font-display font-bold text-xl mb-2">Заявка принята</div>
          <p class="text-muted text-sm">Перезвоним с 09:00 до 21:00</p>
        </div>
      `;
    } catch (err) {
      btn.disabled = false;
      btn.textContent = originalText;
      alert('Не удалось отправить. Позвоните по телефону +7 (964) 637-55-95');
    }
  };

  document.querySelectorAll('form#hero-form, form#contacts-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      submitForm(form);
    });
  });
})();
