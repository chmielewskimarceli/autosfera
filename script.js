document.getElementById('waitlistForm').onsubmit = async (e) => {
  e.preventDefault();

  const form = e.target;
  const statusMessage = document.getElementById('form-status');
  const data = new FormData(form);
  const button = form.querySelector('button');

  // Wizualny feedback - zmieniamy tekst na przycisku podczas wysyłki
  button.innerText = "WYSYŁANIE...";
  button.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      // 1. Dodajemy klasę zanikania do formularza
      form.classList.add('fade-out');

      // 2. Czekamy 400ms (czas trwania transition) i pokazujemy sukces
      setTimeout(() => {
        form.style.display = 'none';
        statusMessage.classList.add('fade-in');
      }, 400);

    } else {
      throw new Error();
    }
  } catch (error) {
    button.innerText = "BŁĄD. SPRÓBUJ PONOWNIE";
    button.disabled = false;
  }
}
