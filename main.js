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

// Add Employee button
const addEmployeeBtn = document.createElement("button");
addEmployeeBtn.textContent = "+ Add Employee";
addEmployeeBtn.className = "add-employee-btn";
addEmployeeBtn.onclick = () => openAddModal();
root.appendChild(addEmployeeBtn);

const table = document.createElement("table");
const headerRow = document.createElement("tr");
const headers = ["ID", "Name", "Role", "Score", "Actions"];
headers.forEach((header) => {
  const th = document.createElement("th");
  th.textContent = header;
  if (header !== "Actions") {
    th.onclick = () => sortTable(headers.indexOf(header));
  }
  headerRow.appendChild(th);
});
table.appendChild(headerRow);

const tbody = document.createElement("tbody");

function createTableRows() {
  tbody.innerHTML = ""; // Clear existing rows
  employees.forEach((employee, index) => {
    const row = document.createElement("tr");

    // Add performance-based styling
    const performanceClass = getPerformanceClass(employee.score);
    row.className = performanceClass;

    Object.values(employee).forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      row.appendChild(td);
    });

    // Add Action buttons container
    const actionTd = document.createElement("td");
    actionTd.className = "actions-cell";

    // Add Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    editButton.onclick = () => openEditModal(employee, index);
    actionTd.appendChild(editButton);

    // Add Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.onclick = () => deleteEmployee(index, employee.name);
    actionTd.appendChild(deleteButton);

    row.appendChild(actionTd);

    tbody.appendChild(row);
  });

  // Update summary whenever table is recreated
  updateSummary();
}

// Function to calculate and update summary statistics
function updateSummary() {
  const totalEmployees = employees.length;

  // Calculate average score
  let averageScore = 0;
  if (totalEmployees > 0) {
    const totalScore = employees.reduce(
      (sum, employee) => sum + employee.score,
      0,
    );
    averageScore = (totalScore / totalEmployees).toFixed(1);
  }

  // Find top performer
  let topPerformer = "-";
  if (totalEmployees > 0) {
    const highestScoreEmployee = employees.reduce((prev, current) =>
      prev.score > current.score ? prev : current,
    );
    topPerformer = `${highestScoreEmployee.name} (${highestScoreEmployee.score})`;
  }

  // Update DOM elements
  document.getElementById("totalEmployees").textContent = totalEmployees;
  document.getElementById("averageScore").textContent = averageScore;
  document.getElementById("topPerformer").textContent = topPerformer;
}

// Function to determine performance class based on score
function getPerformanceClass(score) {
  if (score >= 85) {
    return "performance-high";
  } else if (score >= 70) {
    return "performance-medium";
  } else {
    return "performance-low";
  }
}

table.appendChild(tbody);

// Create search and filter elements
const searchInput = document.createElement("input");
searchInput.placeholder = "Search by name...";
searchInput.className = "search-input";
searchInput.oninput = () => filterTable();

const roleFilter = document.createElement("select");
const roles = ["All", ...new Set(employees.map((e) => e.role))];
roles.forEach((role) => {
  const option = document.createElement("option");
  option.value = role;
  option.textContent = role;
  roleFilter.appendChild(option);
});
roleFilter.onchange = () => filterTable();

// Create Summary Section
const summaryCard = document.createElement("div");
summaryCard.className = "summary-card";
summaryCard.innerHTML = `
  <h3>Team Summary</h3>
  <div class="summary-content">
    <div class="summary-item">
      <span class="summary-label">Total Employees:</span>
      <span class="summary-value" id="totalEmployees">0</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Average Score:</span>
      <span class="summary-value" id="averageScore">0</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Top Performer:</span>
      <span class="summary-value" id="topPerformer">-</span>
    </div>
  </div>
`;

// Add all elements in correct order
root.appendChild(searchInput);
root.appendChild(roleFilter);
root.appendChild(summaryCard);
root.appendChild(table);

// Initialize table rows AFTER all DOM elements are added
createTableRows();

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
  });
  rows.forEach((row) => tbody.appendChild(row));

  // Toggle the sort order for the next click
  sortOrder[columnIndex] = currentOrder === "asc" ? "desc" : "asc";
}

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

// Modal functionality
function openEditModal(employee, index) {
  // Create modal overlay
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  // Create modal container
  const modal = document.createElement("div");
  modal.className = "modal";

  // Create modal content
  modal.innerHTML = `
    <div class="modal-header">
      <h2>Edit Employee</h2>
      <button class="close-btn" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <form id="editForm">
        <div class="form-group">
          <label for="employeeName">Name:</label>
          <input type="text" id="employeeName" value="${employee.name}" readonly>
        </div>
        <div class="form-group">
          <label for="employeeRole">Role:</label>
          <select id="employeeRole">
            <option value="Developer" ${employee.role === "Developer" ? "selected" : ""}>Developer</option>
            <option value="Designer" ${employee.role === "Designer" ? "selected" : ""}>Designer</option>
            <option value="Project Manager" ${employee.role === "Project Manager" ? "selected" : ""}>Project Manager</option>
            <option value="QA Engineer" ${employee.role === "QA Engineer" ? "selected" : ""}>QA Engineer</option>
          </select>
        </div>
        <div class="form-group">
          <label for="employeeScore">Score:</label>
          <input type="number" id="employeeScore" value="${employee.score}" min="0" max="100">
          <span class="error-message" id="scoreError"></span>
        </div>
        <div class="form-actions">
          <button type="button" class="save-btn" onclick="saveEmployee(${index})">Save</button>
          <button type="button" class="cancel-btn" onclick="closeModal()">Cancel</button>
        </div>
      </form>
    </div>
  `;

  // Add modal to overlay
  overlay.appendChild(modal);

  // Add click outside to close
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  };

  // Add to document
  document.body.appendChild(overlay);

  // Store modal reference globally
  window.currentModal = overlay;
}

function closeModal() {
  if (window.currentModal) {
    document.body.removeChild(window.currentModal);
    window.currentModal = null;
  }
}

function validateScore(score) {
  const scoreNum = parseFloat(score);
  if (isNaN(scoreNum)) {
    return { valid: false, message: "Score must be a number" };
  }
  if (scoreNum < 0 || scoreNum > 100) {
    return { valid: false, message: "Score must be between 0 and 100" };
  }
  return { valid: true, message: "" };
}

function saveEmployee(index) {
  const roleSelect = document.getElementById("employeeRole");
  const scoreInput = document.getElementById("employeeScore");
  const errorElement = document.getElementById("scoreError");

  // Clear previous errors
  errorElement.textContent = "";
  scoreInput.classList.remove("error");

  // Validate score
  const validation = validateScore(scoreInput.value);
  if (!validation.valid) {
    errorElement.textContent = validation.message;
    scoreInput.classList.add("error");
    return;
  }

  // Update employee data
  employees[index].role = roleSelect.value;
  employees[index].score = parseFloat(scoreInput.value);

  // Refresh table display
  createTableRows();

  // Update role filter options if new role was added
  updateRoleFilter();

  // Close modal
  closeModal();
}

function updateRoleFilter() {
  const currentValue = roleFilter.value;
  roleFilter.innerHTML = "";

  const roles = ["All", ...new Set(employees.map((e) => e.role))];
  roles.forEach((role) => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    if (role === currentValue) {
      option.selected = true;
    }
    roleFilter.appendChild(option);
  });
}

// Add Employee Modal
function openAddModal() {
  // Create modal overlay
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  // Create modal container
  const modal = document.createElement("div");
  modal.className = "modal";

  // Create modal content
  modal.innerHTML = `
    <div class="modal-header">
      <h2>Add New Employee</h2>
      <button class="close-btn" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <form id="addForm">
        <div class="form-group">
          <label for="newEmployeeName">Name:</label>
          <input type="text" id="newEmployeeName" placeholder="Enter employee name">
          <span class="error-message" id="nameError"></span>
        </div>
        <div class="form-group">
          <label for="newEmployeeRole">Role:</label>
          <select id="newEmployeeRole">
            <option value="">Select a role</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Project Manager">Project Manager</option>
            <option value="QA Engineer">QA Engineer</option>
          </select>
          <span class="error-message" id="roleError"></span>
        </div>
        <div class="form-group">
          <label for="newEmployeeScore">Score:</label>
          <input type="number" id="newEmployeeScore" placeholder="0-100" min="0" max="100">
          <span class="error-message" id="newScoreError"></span>
        </div>
        <div class="form-actions">
          <button type="button" class="save-btn" onclick="addEmployee()">Add Employee</button>
          <button type="button" class="cancel-btn" onclick="closeModal()">Cancel</button>
        </div>
      </form>
    </div>
  `;

  // Add modal to overlay
  overlay.appendChild(modal);

  // Add click outside to close
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  };

  // Add to document
  document.body.appendChild(overlay);

  // Store modal reference globally
  window.currentModal = overlay;

  // Focus on name input
  setTimeout(() => {
    document.getElementById("newEmployeeName").focus();
  }, 100);
}

function validateName(name) {
  if (!name || name.trim() === "") {
    return { valid: false, message: "Name is required" };
  }
  if (name.length < 2) {
    return { valid: false, message: "Name must be at least 2 characters" };
  }
  // Check for duplicate names
  if (employees.some((emp) => emp.name.toLowerCase() === name.toLowerCase())) {
    return { valid: false, message: "Employee with this name already exists" };
  }
  return { valid: true, message: "" };
}

function validateRole(role) {
  if (!role || role === "") {
    return { valid: false, message: "Please select a role" };
  }
  return { valid: true, message: "" };
}

function getNextId() {
  return Math.max(...employees.map((emp) => emp.id), 0) + 1;
}

function addEmployee() {
  const nameInput = document.getElementById("newEmployeeName");
  const roleSelect = document.getElementById("newEmployeeRole");
  const scoreInput = document.getElementById("newEmployeeScore");

  const nameError = document.getElementById("nameError");
  const roleError = document.getElementById("roleError");
  const scoreError = document.getElementById("newScoreError");

  // Clear previous errors
  nameError.textContent = "";
  roleError.textContent = "";
  scoreError.textContent = "";
  nameInput.classList.remove("error");
  roleSelect.classList.remove("error");
  scoreInput.classList.remove("error");

  let hasError = false;

  // Validate name
  const nameValidation = validateName(nameInput.value);
  if (!nameValidation.valid) {
    nameError.textContent = nameValidation.message;
    nameInput.classList.add("error");
    hasError = true;
  }

  // Validate role
  const roleValidation = validateRole(roleSelect.value);
  if (!roleValidation.valid) {
    roleError.textContent = roleValidation.message;
    roleSelect.classList.add("error");
    hasError = true;
  }

  // Validate score
  const scoreValidation = validateScore(scoreInput.value);
  if (!scoreValidation.valid) {
    scoreError.textContent = scoreValidation.message;
    scoreInput.classList.add("error");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  // Create new employee
  const newEmployee = {
    id: getNextId(),
    name: nameInput.value.trim(),
    role: roleSelect.value,
    score: parseFloat(scoreInput.value),
  };

  // Add to array
  employees.push(newEmployee);

  // Refresh table display
  createTableRows();

  // Update role filter options
  updateRoleFilter();

  // Close modal
  closeModal();
}

// Delete Employee
function deleteEmployee(index, employeeName) {
  if (
    confirm(
      `Are you sure you want to delete ${employeeName}? This action cannot be undone.`,
    )
  ) {
    // Remove from array
    employees.splice(index, 1);

    // Refresh table display
    createTableRows();

    // Update role filter options
    updateRoleFilter();
  }
}
