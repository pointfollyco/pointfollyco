const archiveViewer = document.getElementById("archive-viewer");

if (archiveViewer) {
  const searchInput = document.getElementById("archive-search");
  const typeFilter = document.getElementById("archive-type-filter");
  const originFilter = document.getElementById("archive-origin-filter");
  const divisionFilter = document.getElementById("archive-division-filter");
  const unitFilter = document.getElementById("archive-unit-filter");
  const sortSelect = document.getElementById("archive-sort");

  const unitsByDivision = {
    OHSD: [],
    LED: ["TMU", "TAU"],
    SRD: ["CNU", "FCU"]
  };

  let allDocuments = [];

  fetch("/assets/data/documents.json")
    .then(response => response.json())
    .then(documents => {
      allDocuments = documents;
      populateUnitFilter();
      renderArchive();
    });

  function populateUnitFilter() {
    const selectedDivision = divisionFilter.value;

    let units = [];

    if (selectedDivision) {
      units = unitsByDivision[selectedDivision] || [];
    } else {
      units = ["TMU", "TAU", "CNU", "FCU"];
    }

    unitFilter.innerHTML = `<option value="">All Units</option>`;

    units.forEach(unit => {
      unitFilter.innerHTML += `<option value="${unit}">${unit}</option>`;
    });

    unitFilter.disabled = units.length === 0;
  }

  function renderArchive() {
    const archiveType = archiveViewer.dataset.archive;
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter ? typeFilter.value : "";
    const selectedOrigin = originFilter ? originFilter.value : "";
    const selectedDivision = divisionFilter.value;
    const selectedUnit = unitFilter.value;
    const sortValue = sortSelect.value;

    let filteredDocuments = allDocuments.filter(doc => {
      if (archiveType === "forms-procedures") {
        if (!(doc.type === "form" || doc.type === "procedure")) {
          return false;
        }
      }

      if (archiveType === "public-records") {
        if (doc.type !== "record") {
          return false;
        }
      }

      if (selectedType && doc.type !== selectedType) {
        return false;
      }

      if (selectedOrigin && doc.origin !== selectedOrigin) {
        return false;
      }

      if (selectedDivision && doc.division !== selectedDivision) {
        return false;
      }

      if (selectedUnit && doc.unit !== selectedUnit) {
        return false;
      }

      if (searchTerm) {
        const searchableText = `
          ${doc.title}
          ${doc.code}
          ${doc.type}
          ${doc.origin}
          ${doc.division}
          ${doc.unit}
          ${doc.description}
          ${(doc.tags || []).join(" ")}
        `.toLowerCase();

        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });

    filteredDocuments.sort((a, b) => {
      if (sortValue === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortValue === "newest") {
        return new Date(b.date) - new Date(a.date);
      }

      if (sortValue === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }

      return a.code.localeCompare(b.code);
    });

    if (filteredDocuments.length === 0) {
      archiveViewer.innerHTML = `
        <div class="document-card">
          <div class="document-title">No matching documents found.</div>
        </div>
      `;
      return;
    }

    archiveViewer.innerHTML = filteredDocuments
      .map(doc => `
        <article class="document-card">
          <div class="document-code">${doc.code}</div>

          <div class="document-title">${doc.title}</div>

          <div class="document-meta">
            ${doc.division}${doc.unit ? " / " + doc.unit : ""}
            · ${doc.type}
            · ${doc.origin}
          </div>

          <div class="document-description">
            ${doc.description}
          </div>
        </article>
      `)
      .join("");
  }

  searchInput.addEventListener("input", renderArchive);

  if (typeFilter) {
    typeFilter.addEventListener("change", renderArchive);
  }

  if (originFilter) {
    originFilter.addEventListener("change", renderArchive);
  }

  divisionFilter.addEventListener("change", () => {
    populateUnitFilter();
    renderArchive();
  });

  unitFilter.addEventListener("change", renderArchive);
  sortSelect.addEventListener("change", renderArchive);
}