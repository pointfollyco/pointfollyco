document.addEventListener("DOMContentLoaded", () => {

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

  const divisionDirectoryTarget =
    document.getElementById("division-directory");

  if (divisionDirectoryTarget) {
    fetch("/division-directory.html")
      .then(response => response.text())
      .then(data => {
        divisionDirectoryTarget.innerHTML = data;
      });
  }

  document.addEventListener("click", event => {
    const toggle = event.target.closest(".dropdown-toggle");
  
    if (toggle) {
      event.preventDefault();
      event.stopPropagation();
  
      const dropdown = toggle.closest(".dropdown");
      const parentMenu = dropdown.parentElement;
  
      Array.from(parentMenu.children).forEach(sibling => {
        if (
          sibling !== dropdown &&
          sibling.classList.contains("dropdown") &&
          sibling.classList.contains("open")
        ) {
          sibling.classList.remove("open");
        }
      });
  
      dropdown.classList.toggle("open");
      return;
    }
  
    document.querySelectorAll(".dropdown.open").forEach(dropdown => {
      dropdown.classList.remove("open");
    });
  });

});
