const relatedMaterialsTarget =
  document.getElementById("related-materials");

if (relatedMaterialsTarget) {
  const division = relatedMaterialsTarget.dataset.division;
  const unit = relatedMaterialsTarget.dataset.unit;

  const baseParams = new URLSearchParams();

  if (division) {
    baseParams.set("division", division);
  }

  if (unit) {
    baseParams.set("unit", unit);
  }

  const formsParams = new URLSearchParams(baseParams);
  formsParams.set("type", "form");

  const proceduresParams = new URLSearchParams(baseParams);
  proceduresParams.set("type", "procedure");

  const recordsParams = new URLSearchParams(baseParams);

  relatedMaterialsTarget.innerHTML = `
    <div class="related-materials">
      <h2>Related Materials</h2>

      <ul>
        <li>
          <a href="/forms-procedures/?${formsParams.toString()}">
            Forms
          </a>
        </li>

        <li>
          <a href="/forms-procedures/?${proceduresParams.toString()}">
            Procedures
          </a>
        </li>

        <li>
          <a href="/public-records/?${recordsParams.toString()}">
            Public Records
          </a>
        </li>
      </ul>
    </div>
  `;
}