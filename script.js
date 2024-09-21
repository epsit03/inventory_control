// Open (or create) an IndexedDB database
let db;
const request = indexedDB.open("InventoryDB", 1);

request.onerror = function(event) {
  console.log("Error opening database:", event);
};

request.onsuccess = function(event) {
  db = event.target.result;
  console.log("Database opened successfully");
};

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const objectStore = db.createObjectStore("inventory", { keyPath: "id", autoIncrement: true });
  objectStore.createIndex("category", "category", { unique: false });
  objectStore.createIndex("brand", "brand", { unique: false });
  objectStore.createIndex("product", "product", { unique: false });
  objectStore.createIndex("issuedTo", "issuedTo", { unique: false });
  objectStore.createIndex("returnTo", "returnTo", { unique: false });
};

// Function to add data to IndexedDB
function addInventory(category, brand, product, issuedTo, returnTo) {
  const transaction = db.transaction(["inventory"], "readwrite");
  const objectStore = transaction.objectStore("inventory");

  const newItem = { category, brand, product, issuedTo, returnTo };

  const request = objectStore.add(newItem);

  request.onsuccess = function(event) {
    console.log("Item added to database:", newItem);
    displayInventory(); // Refresh the dashboard
  };

  request.onerror = function(event) {
    console.log("Error adding item:", event);
  };
}

// Function to display inventory data on the dashboard
function displayInventory() {
  const transaction = db.transaction(["inventory"], "readonly");
  const objectStore = transaction.objectStore("inventory");

  objectStore.openCursor().onsuccess = function(event) {
    const cursor = event.target.result;
    if (cursor) {
      const tbody = document.querySelector('#inventoryTable tbody');
      const row = `<tr>
                    <td>${cursor.value.category}</td>
                    <td>${cursor.value.brand}</td>
                    <td>${cursor.value.product}</td>
                    <td>${cursor.value.issuedTo}</td>
                    <td>${cursor.value.returnTo}</td>
                  </tr>`;
      tbody.innerHTML += row;
      cursor.continue();
    }
  };
}

// Save form data into IndexedDB on form submission
document.getElementById('inventoryForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const category = document.getElementById('category').value || document.getElementById('newCategoryInput').value;
  const brand = document.getElementById('brand').value || document.getElementById('newBrandInput').value;
  const product = document.getElementById('product').value || document.getElementById('newProductInput').value;
  const issuedTo = document.getElementById('issuedTo').value;
  const returnTo = document.getElementById('returnTo').value;

  addInventory(category, brand, product, issuedTo, returnTo);
});
