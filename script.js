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

      form.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      form.style.opacity = '0';
      form.style.transform = 'translateY(-10px)';
      form.style.pointerEvents = 'none'; 

      setTimeout(() => {

        statusMessage.style.position = "absolute";
        statusMessage.style.top = "40px";
        statusMessage.style.left = "20px";
        statusMessage.style.right = "20px";
        
        statusMessage.classList.add('fade-in');
      }, 400);

    } else {
      throw new Error();
    }
  } catch (error) {
    button.innerText = "BŁĄD. SPRÓBUJ PONOWNIE";
    button.disabled = false;
  }
};
