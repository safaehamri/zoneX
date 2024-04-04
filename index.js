// Function to initialize the grid with fetched data
async function initializeGrid() {
  try {
    const rowData = await fetchData();

    const gridOptions = {
      rowData: rowData,
      columnDefs: [
        {
          field: "numero",
          checkboxSelection: true,
          editable: true, //pour permettre l edition
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: [1, 2],
          },
        },
        { field: "article" },
        { field: "client" },
        { field: "quantite" },
        { field: "montant", filter: "agNumberColumnFilter" },
      ],
      defaultColDef: {
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      rowSelection: "multiple",
      suppressRowClickSelection: true,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 25, 50],
    };

    const gridDiv = document.querySelector("#myGrid");
    gridApi = agGrid.createGrid(gridDiv, gridOptions);
  } catch (error) {
    console.error("Error initializing grid:", error);
  }
}

// Function to handle form submission
document
  .getElementById("inputForm")
  .addEventListener("submit", handleFormSubmission);

// Function to handle form submission
function handleFormSubmission(event) {
  event.preventDefault(); // Prevent form submission

  const formData = new FormData(event.target);
  const numero = parseInt(formData.get("numero"));
  const quantite = parseInt(formData.get("quantite"));
  const montant = parseInt(formData.get("montant"));

  if (isNaN(numero) || isNaN(quantite) || isNaN(montant)) {
    alert("Invalid input. Please enter valid numbers.");
    return;
  }

  const newRowData = {
    numero: numero,
    article: formData.get("article"),
    client: formData.get("client"),
    quantite: quantite,
    montant: montant,
  };

  const res = gridApi.applyTransaction({ add: [newRowData] });
  printResult(res);

  event.target.reset();
}

function onRemoveSelected() {
  const selectedData = gridApi.getSelectedRows();
  const res = gridApi.applyTransaction({ remove: selectedData });
  printResult(res);
}
function printResult(res) {
  if (res.remove) {
    res.remove.forEach((rowNode) => {
      console.log("Removed Row Node", rowNode);
    });
  }
}

//  function to fetch data from JSON file
async function fetchData() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Helper function to print transaction result
function printResult(res) {
  console.log("---------------------------------------");
  if (res.add) {
    res.add.forEach((rowNode) => {
      console.log("Added Row Node", rowNode);
    });
  }
  if (res.remove) {
    res.remove.forEach((rowNode) => {
      console.log("Removed Row Node", rowNode);
    });
  }
}

// Call initializeGrid function to create the grid with fetched data
initializeGrid();
