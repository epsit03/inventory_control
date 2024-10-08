let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Function to generate unique ID
function generateProductId() {
  return 'P' + Math.floor(Math.random() * 1000000);
}

const validUsername = "admin";
    const validPassword = "admin123";

    // Handle login
    function handleLogin() {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const loginError = document.getElementById('loginError');

      // Check if credentials are correct
      if (username === validUsername && password === validPassword) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('inventoryForm').style.display = 'flex';
        document.querySelector('table').style.display = 'table';
        document.getElementById('clearInventory').style.display = 'block';
        document.getElementById('downloadExcel').style.display = 'block';
        document.getElementById('loadFromExcel').style.display = 'block';
      } else {
        loginError.textContent = "Invalid username or password. Please try again.";
      }
    }

// Function to add new product
document.getElementById('inventoryForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const newProduct = {
    id: generateProductId(),
    category: document.getElementById('category').value,
    brand: document.getElementById('brand').value,
    product: document.getElementById('product').value,
    quantity: document.getElementById('quantity').value,
    price: document.getElementById('price').value,
    assignedTo: null // Initially not assigned
  };

  inventory.push(newProduct);
  localStorage.setItem('inventory', JSON.stringify(inventory));
  displayInventory();
});

// Function to display products
function displayInventory() {
  const inventoryTableBody = document.querySelector('#inventoryTable tbody');
  inventoryTableBody.innerHTML = '';

  inventory.forEach((item, index) => {
    inventoryTableBody.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.category}</td>
        <td>${item.brand}</td>
        <td>${item.product}</td>
        <td>${item.quantity}</td>
        <td>${item.price}</td>
        <td>${item.assignedTo || 'Not Assigned'}</td>
        <td>
          <button onclick="assignProduct(${index})">Assign</button>
        </td>
      </tr>
    `;
  });
}

displayInventory();

// Function to assign product to a person
function assignProduct(index) {
  const person = prompt('Enter the person name:');
  if (person) {
    inventory[index].assignedTo = person;
    localStorage.setItem('inventory', JSON.stringify(inventory));
    displayInventory();
  }
}

document.getElementById('downloadExcel').addEventListener('click', function() {
  const ws = XLSX.utils.json_to_sheet(inventory);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventory');

  XLSX.writeFile(wb, 'inventory.xlsx');
});

document.getElementById('clearInventory').addEventListener('click', function() {
  localStorage.removeItem('inventory');
  inventory = [];
  displayInventory();
});

document.getElementById('searchForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const searchValue = document.getElementById('search').value.toLowerCase();
  const filteredInventory = inventory.filter(item => {
    return item.category.toLowerCase().includes(searchValue) ||
      item.brand.toLowerCase().includes(searchValue) ||
      item.product.toLowerCase().includes(searchValue) ||
      item.quantity.toLowerCase().includes(searchValue) ||
      item.price.toLowerCase().includes(searchValue) ||
      item.assignedTo.toLowerCase().includes(searchValue);
  });

  const inventoryTableBody = document.querySelector('#inventoryTable tbody');
  inventoryTableBody.innerHTML = '';

  filteredInventory.forEach((item, index) => {
    inventoryTableBody.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.category}</td>
        <td>${item.brand}</td>
        <td>${item.product}</td>
        <td>${item.quantity}</td>
        <td>${item.price}</td>
        <td>${item.assignedTo || 'Not Assigned'}</td>
        <td>
          <button onclick="assignProduct(${index})">Assign</button>
        </td>
      </tr>
    `;
  });
});

document.getElementById('loadFromExcel').addEventListener('click', function() {
  document.getElementById('uploadExcel').click();
});

document.getElementById('uploadExcel').addEventListener('change', function(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const workbook = XLSX.read(event.target.result, { type: 'binary' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet);

    // Replace inventory with the loaded data and update localStorage
    inventory = data;
    localStorage.setItem('inventory', JSON.stringify(inventory));
    displayInventory();
  };

  reader.readAsBinaryString(file);
});
