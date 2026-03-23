document.addEventListener('DOMContentLoaded', () => {

  if (localStorage.getItem('signedUp') === 'true') {
    const form = document.getElementById('waitlistForm');
    const statusMessage = document.getElementById('form-status');
    
    if (form && statusMessage) {
      form.style.display = 'none';
      statusMessage.style.display = 'block';
      statusMessage.innerText = "Jesteś już na liście oczekujących! Powiadomimy Cię o starcie.";
    }
  }
});

document.getElementById('waitlistForm').onsubmit = async (e) => {
  e.preventDefault();

  const form = e.target;
  const container = form.closest('.signup-form');
  const statusMessage = document.getElementById('form-status');
  const data = new FormData(form);
  const button = form.querySelector('button');

  const emailValue = data.get('email').trim();
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailPattern.test(emailValue)) {
    alert("Adres e-mail wygląda na niepoprawny.");
    return; 
  }

  container.style.height = container.offsetHeight + 'px';

  button.innerText = "WYSYŁANIE...";
  button.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {

      localStorage.setItem('signedUp', 'true');

      form.classList.add('fade-out');

      setTimeout(() => {
        form.style.display = 'none';
        statusMessage.style.marginTop = "20px"; 
        statusMessage.classList.add('fade-in');
      }, 400);

    } else {
      throw new Error();
    }
  } catch (error) {
    button.innerText = "BŁĄD. SPRÓBUJ PONOWNIE";
    button.disabled = false;
    container.style.height = 'auto'; 
  }
}

// web$ter
