document.getElementById('waitlistForm').onsubmit = async (e) => {
  e.preventDefault();

  const form = e.target;
  const container = form.closest('.signup-form');
  const statusMessage = document.getElementById('form-status');
  const data = new FormData(form);
  const button = form.querySelector('button');

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
