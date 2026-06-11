const headerTarget = document.getElementById("site-header");

if (headerTarget) {
  fetch("/header.html")
    .then(response => response.text())
    .then(data => {
      headerTarget.innerHTML = data;
    });
}

const footerTarget = document.getElementById("site-footer");

if (footerTarget) {
  fetch("/footer.html")
    .then(response => response.text())
    .then(data => {
      footerTarget.innerHTML = data;
    });
}
