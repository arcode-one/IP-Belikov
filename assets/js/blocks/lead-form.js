function phoneDigits(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (digits && !digits.startsWith('7')) digits = '7' + digits;
  return digits.slice(0, 11);
}

// +7 (999) 123-45-67
function formatPhone(digits) {
  if (!digits) return '';
  const d = digits.slice(1);
  let out = '+7';
  if (d.length) out += ' (' + d.slice(0, 3);
  if (d.length >= 3) out += ')';
  if (d.length > 3) out += ' ' + d.slice(3, 6);
  if (d.length > 6) out += '-' + d.slice(6, 8);
  if (d.length > 8) out += '-' + d.slice(8, 10);
  return out;
}

// Адрес отправки, текст успеха и телефон для сообщения об ошибке приходят из разметки (template-parts/blocks/contact.php)
export function initLeadForm() {
  const form = document.querySelector('.lead-form');
  const status = form.querySelector('.lead-form__status');
  const submit = form.querySelector('.lead-form__submit');
  const { name, email, phone, consent, message, website } = form.elements;

  phone.addEventListener('input', () => {
    const deleting = phone.value.length < (phone.dataset.prev || '').length;
    if (!deleting) phone.value = formatPhone(phoneDigits(phone.value));
    phone.dataset.prev = phone.value;
  });

  const setStatus = (text, type = '') => {
    status.textContent = text;
    status.className = `lead-form__status${type ? ` lead-form__status--${type}` : ''}`;
  };

  const validate = () => {
    const emailValue = email.value.trim();
    const digits = phoneDigits(phone.value);
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    const phoneOk = digits.length === 11;
    const errors = [];
    const mark = (field, ok) => field.setAttribute('aria-invalid', String(!ok));

    const nameOk = name.value.trim().length >= 2;
    mark(name, nameOk);
    if (!nameOk) errors.push({ field: name, message: 'укажите имя' });

    if (!emailOk && !phoneOk) {
      mark(email, false);
      mark(phone, false);
      errors.push({ field: digits ? phone : email, message: emailValue && !emailOk ? 'проверьте email' : 'укажите телефон или email' });
    } else {
      mark(email, !emailValue || emailOk);
      mark(phone, !digits || phoneOk);
      if (emailValue && !emailOk) errors.push({ field: email, message: 'проверьте email' });
      if (digits && !phoneOk) errors.push({ field: phone, message: 'укажите телефон полностью' });
    }

    mark(consent, consent.checked);
    if (!consent.checked) errors.push({ field: consent, message: 'отметьте согласие на обработку данных' });
    return errors;
  };

  // После первой ошибки перепроверяем на лету
  for (const field of [name, email, phone, consent]) {
    field.addEventListener('change', () => { if (form.querySelector('[aria-invalid="true"]')) validate(); });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const errors = validate();
    if (errors.length) {
      setStatus(`Проверьте форму: ${errors.map((e) => e.message).join(', ')}.`, 'error');
      errors[0].field.focus();
      return;
    }
    submit.disabled = true;
    setStatus('Отправляем…');
    try {
      const digits = phoneDigits(phone.value);
      const response = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          phone: digits ? formatPhone(digits) : '',
          message: message.value.trim(),
          consent: consent.checked,
          website: website.value,
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      phone.dataset.prev = '';
      setStatus(form.dataset.success, 'ok');
    } catch {
      setStatus(`Не удалось отправить. Позвоните нам: ${form.dataset.phone}.`, 'error');
    } finally {
      submit.disabled = false;
    }
  });
}
