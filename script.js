const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('nav');
const modal = document.querySelector('.modal');
const form = document.querySelector('#consult-form');
const success = document.querySelector('.form-success');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 30);
}

function openConsult() {
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modal.querySelector('input').focus();
}

function closeConsult() {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
});

document.querySelectorAll('[data-open-consult]').forEach((button) => {
  button.addEventListener('click', openConsult);
});

document.querySelectorAll('[data-close-consult]').forEach((button) => {
  button.addEventListener('click', closeConsult);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeConsult();
});

document.querySelectorAll('.subject-list button').forEach((button) => {
  button.addEventListener('click', () => {
    openConsult();
    const subject = button.querySelector('span').textContent;
    const option = [...form.elements.subject.options].find((item) => item.text === subject);
    if (option) form.elements.subject.value = option.value;
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = form.querySelector('button[type="submit"]');
  const errorMessage = form.querySelector('.form-error');

  submitButton.disabled = true;
  submitButton.textContent = '전송 중...';
  errorMessage.hidden = true;

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) throw new Error('Consultation request failed');

    form.hidden = true;
    success.hidden = false;
    form.reset();
  } catch (error) {
    errorMessage.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = '상담 신청 완료';
  }
});