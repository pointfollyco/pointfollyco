document.addEventListener("DOMContentLoaded", () => {

  const headerTarget = document.getElementById("site-header");

  if (headerTarget) {
    fetch("/components/header.html")
      .then(response => response.text())
      .then(data => {
        headerTarget.innerHTML = data;
      });
  }

  const footerTarget = document.getElementById("site-footer");

  if (footerTarget) {
    fetch("/components/footer.html")
      .then(response => response.text())
      .then(data => {
        footerTarget.innerHTML = data;
      });
  }

  const divisionDirectoryTarget =
    document.getElementById("division-directory");

  if (divisionDirectoryTarget) {
    fetch("/components/division-directory.html")
      .then(response => response.text())
      .then(data => {
        divisionDirectoryTarget.innerHTML = data;

        const currentPath = window.location.pathname;

        let parentPath = null;

        if (currentPath.includes("/divisions/")) {

          const parts = currentPath
            .split("/")
            .filter(part => part);

          if (parts.length >= 3) {

            parentPath =
              "/" +
              parts.slice(0, parts.length - 1).join("/") +
              "/";

          }
        }

        divisionDirectoryTarget
          .querySelectorAll("a")
          .forEach(link => {

            const linkPath = 
              new URL(link.href).pathname;

            if (linkPath === currentPath) {
              link.classList.add("current");
            }

            if (
                parentPath &&
                linkPath === parentPath
              ) {
                link.classList.add("parent");
              }
          });
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

  const archiveViewer = 
    document.getElementById("archive-viewer");

  if (archiveViewer) {
    fetch("/assets/data/documents.json")
      .then(response => response.json())
      .then(documents => {
        const archiveType = archiveViewer.dataset.archive;

        let filteredDocuments = [];

        if (archiveType === "forms-procedures") {
          filteredDocuments = documents.filter(doc =>
            doc.type === "form" ||
            doc.type === "procedure"
          );
        }

        if (archiveType === "public-records") {
          filteredDocuments = documents.filter(doc =>
            doc.type === "record"
          );
        }

        archiveViewer.innerHTML =
          filteredDocuments
            .map(doc => `
              <article class="document-card">

                <div class="document-code">${doc.code}</div>
                
                <div class="document-title">${doc.title}</div>

                <div class="document-meta">
                  ${doc.division}${doc.unit ? " / " + doc.unit : ""}
                  .${doc.type}
                  .${doc.origin}
                </div>

                <div class="document-description">
                  ${doc.description}
                </div>
              </article>
            `)
            .join("");
            
    });

  }

});
