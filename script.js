document.getElementById('waitlistForm').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const statusMessage = document.getElementById('form-status');
  const button = form.querySelector('button');

  button.innerText = "WYSYŁANIE...";
  button.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {

      form.style.opacity = '0';
      form.style.pointerEvents = 'none'; 
      
      statusMessage.style.display = 'block';
    } else {
      throw new Error();
    }
  } catch (error) {
    button.innerText = "BŁĄD. SPRÓBUJ PONOWNIE";
    button.disabled = false;
  }
};
