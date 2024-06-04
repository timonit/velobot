const form = document.querySelector('#meeting_form');
// const cancelBTN = document.querySelector('#cancel');

function sendForm() {
  const formData = new FormData(form);
  const data = {};
  
  formData.forEach((value, key) => {
    data[key] = value;
  });

  Telegram.sendData(JSON.stringify(data));
}

form.addEventListener('submit', sendForm);
