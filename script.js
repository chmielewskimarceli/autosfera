document.getElementById('waitlistForm').onsubmit = async (e) => {
  e.preventDefault();

  const form = e.target;
  const statusMessage = document.getElementById('form-status');
  const data = new FormData(form);

  // Wysyłamy dane do Formspree
  const response = await fetch(form.action, {
    method: 'POST',
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  });

  // Jeśli wysyłka się udała (status 200 OK)
  if (response.ok) {
    form.style.display = 'none'; // Chowamy formularz
    statusMessage.style.display = 'block'; // Pokazujemy Twój zielony tekst z HTML
  } else {
    // Jeśli był błąd (np. brak neta), po prostu pozwalamy spróbować jeszcze raz
    console.error("Błąd wysyłki");
    const submitBtn = form.querySelector('button');
    submitBtn.innerText = "BŁĄD - SPRÓBUJ PONOWNIE";
  }
}
