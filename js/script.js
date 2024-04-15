let originalProductsData = [];
let filteredProductsData = [];

let currentIndex = 0;
const displayCount = 3; // Number of products to display at once
const userName = localStorage.getItem('userName');
const userPhone = localStorage.getItem('userPhone');

function loadXMLAndInit() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "xml/products.xml", true);
  xhr.onload = function() {
    if (this.status === 200) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(this.responseText, "text/xml");
      const products = xmlDoc.getElementsByTagName("product");
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        originalProductsData.push({
          id: product.getAttribute("id"),
          name: product.getElementsByTagName("name")[0].textContent,
          category: product.getElementsByTagName("category")[0].textContent,
          price: product.getElementsByTagName("price")[0].textContent,
          description: product.getElementsByTagName("description")[0].textContent,
          image: product.getElementsByTagName("image")[0].textContent,
        });
      }
      populateDropdown();
      displayProducts("all");
    }
  };
  xhr.send();
}

function switchTheme() {
    const themeStyleLink = document.getElementById('themeStyle');
    const currentTheme = themeStyleLink.getAttribute('href');
    const newTheme = currentTheme.includes('style.css') ? 'css/style2.css' : 'css/style.css';

    themeStyleLink.setAttribute('href', newTheme);
    localStorage.setItem('themePreference', newTheme);
}

// Function to load the saved theme preference
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('themePreference');
    if (savedTheme) {
        document.getElementById('themeStyle').setAttribute('href', savedTheme);
    }
}

// Ensuring theme loading doesn't conflict with other onload actions
document.addEventListener('DOMContentLoaded', function() {
    loadSavedTheme();
});

function populateDropdown() {
  const categories = [...new Set(originalProductsData.map(product => product.category))];
  const filterSelect = document.getElementById("filter");
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filterSelect.appendChild(option);
  });
}

function filterData() {
  const selectedCategory = document.getElementById("filter").value;
  displayProducts(selectedCategory);
}

function displayProducts(category) {
  const container = document.getElementById("product-container");
  container.innerHTML = "";
  filteredProductsData = category === "all" ? originalProductsData : originalProductsData.filter(product => product.category === category);
  currentIndex = 0;
  displayCurrentProduct();
}

function showNextProduct() {
  if (filteredProductsData.length > displayCount) {
    currentIndex = (currentIndex + displayCount) % filteredProductsData.length;
    displayCurrentProduct();
  }
}

function showPrevProduct() {
  if (filteredProductsData.length > displayCount) {
    currentIndex = (currentIndex - displayCount + filteredProductsData.length) % filteredProductsData.length;
    displayCurrentProduct();
  }
}

function displayCurrentProduct() {
    const container = document.getElementById('product-container');
    container.innerHTML = ''; // Clear the container

    // Calculate the number of products to display (up to the display count)
    const displayUpTo = Math.min(displayCount, filteredProductsData.length);

    for (let i = 0; i < displayUpTo; i++) {
        let productIndex = (currentIndex + i) % filteredProductsData.length;
        const product = filteredProductsData[productIndex];
        const productElement = `
        <div class="product" style="margin:10px; padding:10px; border:1px solid #ccc; float:left; width: calc(25% - 20px);">
            <h2 class="name">${product.name}</h2>
			<p class="description">${product.description}</p>
            <p class="category">${product.category}</p>
            <p class="price">Price: ${product.price}</p>
            <img src="${product.image}" alt="${product.name}" style="width:300px;height:275px;">
            <button onclick="orderProduct('${product.id}')">Order</button>
        </div>`;
        container.innerHTML += productElement;
    }
    
    // Adjust buttons visibility depending on the number of items and current index
    adjustButtonVisibility();
}

function orderProduct(productId) {
    const product = originalProductsData.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push({ name: product.name, price: parseFloat(product.price) });
    localStorage.setItem('orders', JSON.stringify(orders));

    alert(`Order placed for product: ${product.name}`);
}

function viewOrder() {
    window.location.href = 'order.html';
}

function adjustButtonVisibility() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    // Hide prev button if at the start
    if (currentIndex === 0) {
        prevButton.style.visibility = 'hidden';
    } else {
        prevButton.style.visibility = 'visible';
    }
    
    // Hide next button if at the end or if there's only one product
    if (currentIndex + displayCount >= filteredProductsData.length || filteredProductsData.length === 1) {
        nextButton.style.visibility = 'hidden';
    } else {
        nextButton.style.visibility = 'visible';
    }
}

window.onload = loadXMLAndInit;

// Event listener for form submission on the index page
if (document.getElementById('userInfoForm')) {
    document.getElementById('userInfoForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Capture user input
        const userName = document.getElementById('name').value;
        const userPhone = document.getElementById('phone').value;

        // Store data in localStorage
        localStorage.setItem('userName', userName);
        localStorage.setItem('userPhone', userPhone);

        // Redirect to product.html
        window.location.href = 'product.html';
    });
}

// Code to execute when product.html has loaded
if (document.getElementById('greeting')) {
    document.addEventListener('DOMContentLoaded', (event) => {
        const userName = localStorage.getItem('userName');
        const greetingElement = document.getElementById('greeting');

        if(userName) {
            greetingElement.innerHTML = `<h2>Hi ${userName}, Please Proceed With Your Order.!</h2>`;
        }
    });
}






