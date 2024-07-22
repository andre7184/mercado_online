class AjaxRequest {
  constructor(url) {
    this.url = url;
  }
  send(data) {
    // Cria um objeto FormData
    let formData = new FormData();
    // Adiciona os dados ao objeto FormData
    for (let key in data) {
      formData.append(key, data[key]);
    }
    // Faz a solicitação POST
    return fetch(this.url, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // ou response.text() se a resposta não for JSON
    })
    .catch(error => {
      console.error('Erro:', error);
    });
  }
}
