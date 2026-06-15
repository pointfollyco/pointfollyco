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
    SRD: ["CNU", "MEU"]
  };

  let allDocuments = [];

  const urlParams = new URLSearchParams(window.location.search);

  fetch("/assets/data/documents.json")
    .then(response => response.json())
    .then(documents => {
      allDocuments = documents;

      applyUrlParams();
      populateUnitFilter();

      if (unitFilter && urlParams.get("unit")) {
          unitFilter.value = urlParams.get("unit").toUpperCase();
      }
      
      renderArchive();
    });

  function populateUnitFilter() {
    const selectedDivision = divisionFilter.value;

    let units = [];

    if (selectedDivision) {
      units = unitsByDivision[selectedDivision] || [];
    } else {
      units = ["TMU", "TAU", "CNU", "MEU"];
    }

    unitFilter.innerHTML = `<option value="">All Units</option>`;

    units.forEach(unit => {
      unitFilter.innerHTML += `<option value="${unit}">${unit}</option>`;
    });

    unitFilter.disabled = units.length === 0;
  }

  function applyUrlParams() {
    const searchParam = urlParams.get("search");
    const typeParam = urlParams.get("type");
    const originParam = urlParams.get("origin");
    const divisionParam = urlParams.get("division");
    const sortParam = urlParams.get("sort");

    if (searchInput && searchParam) {
        searchInput.value = searchParam;
    }

    if (typeFilter && typeParam) {
        typeFilter.value = typeParam.toLowerCase();
    }

    if (originFilter && originParam) {
        originFilter.value = originParam.toLowerCase();
    }

    if (divisionFilter && divisionParam) {
        divisionFilter.value = divisionParam.toUpperCase();
    }

    if (sortSelect && sortParam) {
        sortSelect.value = sortParam.toLowerCase();
    }
  }

  function renderArchive() {
    const archiveType = archiveViewer.dataset.archive;
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter ? typeFilter.value : "";
    const selectedOrigin = originFilter ? originFilter.value : "";
    const selectedDivision = divisionFilter.value;
    const selectedUnit = unitFilter.value;
    const sortValue = sortSelect.value;
    updateUrlParams();

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
      if (sortValue === "title-az") {
        return a.title.localeCompare(b.title);
      }

      if (sortValue === "title-za") {
          return b.title.localeCompare(a.title);
      }

      if (sortValue === "code-za") {
          return b.code.localeCompare(a.code);
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

    const resultWord =
        filteredDocuments.length === 1 ? "document" : "documents";

    const resultsCountHtml = `
    <div class="archive-results-count">
        Showing ${filteredDocuments.length} ${resultWord}
        </div>
    `;

    archiveViewer.innerHTML = 
        resultsCountHtml +
        filteredDocuments
      .map(doc => `
        <article class="document-card">
          <div class="document-code">${doc.code}</div>

          <div class="document-title">
            ${doc.url
              ? `<a href="${doc.url}" target="_blank">${doc.title}</a>`
              :doc.title
            }
          </div>

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

  function updateUrlParams() {
    const params = new URLSearchParams();
  
    if (searchInput && searchInput.value) {
      params.set("search", searchInput.value);
    }
  
    if (typeFilter && typeFilter.value) {
      params.set("type", typeFilter.value);
    }
  
    if (originFilter && originFilter.value) {
      params.set("origin", originFilter.value);
    }
  
    if (divisionFilter && divisionFilter.value) {
      params.set("division", divisionFilter.value);
    }
  
    if (unitFilter && unitFilter.value) {
      params.set("unit", unitFilter.value);
    }
  
    if (sortSelect && sortSelect.value && sortSelect.value !== "code-az") {
      params.set("sort", sortSelect.value);
    }
  
    const newUrl =
      params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
  
    window.history.replaceState({}, "", newUrl);
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