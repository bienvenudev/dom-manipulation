const employees = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Developer",
    score: 88,
  },
  { id: 2, name: "James Smith", role: "Designer", score: 73 },
  { id: 3, name: "Fatou Kamara", role: "Project Manager", score: 91 },
  { id: 4, name: "David Mwangi", role: "QA Engineer", score: 64 },
];

const root = document.getElementById("root");

const table = document.createElement("table");
const headerRow = document.createElement("tr");
const headers = ["ID", "Name", "Role", "Score"];
headers.forEach((header) => {
  const th = document.createElement("th");
  th.textContent = header;
  th.onclick = () => sortTable(headers.indexOf(header));
  headerRow.appendChild(th);
});
table.appendChild(headerRow);

const tbody = document.createElement("tbody");
employees.forEach((employee) => {
  const row = document.createElement("tr");
  Object.values(employee).forEach((value) => {
    const td = document.createElement("td");
    td.textContent = value;
    row.appendChild(td);
  });
  const editButton = document.createElement("td");
  tbody.appendChild(row);
});

table.appendChild(tbody);
root.appendChild(table);

let sortOrder = {};

function sortTable(columnIndex) {
  const rows = Array.from(tbody.querySelectorAll("tr"));
  const currentOrder = sortOrder[columnIndex] || "asc";
  
  rows.sort((a, b) => {
    const aValue = a.cells[columnIndex].textContent;
    const bValue = b.cells[columnIndex].textContent;
    
    if (currentOrder === "asc") {
      return aValue.localeCompare(bValue, undefined, { numeric: true });
    } else {
      return bValue.localeCompare(aValue, undefined, { numeric: true });
    }
  }
  );
  rows.forEach((row) => tbody.appendChild(row));
  
  // Toggle the sort order for the next click
  sortOrder[columnIndex] = currentOrder === "asc" ? "desc" : "asc";
}

const searchInput = document.createElement("input");
searchInput.placeholder = "Search by name...";
searchInput.oninput = () => filterTable();
root.insertBefore(searchInput, table);

const roleFilter = document.createElement("select");
const roles = ["All", ...new Set(employees.map((e) => e.role))];
roles.forEach((role) => {
  const option = document.createElement("option");
  option.value = role;
  option.textContent = role;
  roleFilter.appendChild(option);
});
roleFilter.onchange = () => filterTable();
root.insertBefore(roleFilter, table);

function filterTable() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedRole = roleFilter.value;

  Array.from(tbody.querySelectorAll("tr")).forEach((row) => {
    const nameCell = row.cells[1].textContent.toLowerCase();
    const roleCell = row.cells[2].textContent;

    const matchesSearch = nameCell.includes(searchTerm);
    const matchesRole = selectedRole === "All" || roleCell === selectedRole;

    row.style.display = matchesSearch && matchesRole ? "" : "none";
  });
}
