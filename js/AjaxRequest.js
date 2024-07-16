class AjaxRequest {
  constructor(url) {
    this.url = url;
  }

  send(data) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.url,
        type: "POST",
        data: data,
        success: function (response) {
          resolve(response);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }
}
