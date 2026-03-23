document.getElementById('waitlistForm').onsubmit = (e) => {
  e.preventDefault();

  const form = e.target;
  const statusMessage = document.getElementById('form-status');

  form.style.display = 'none';

  statusMessage.style.display = 'block';
}
