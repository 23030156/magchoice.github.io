        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        let totalPrice = 0;

        const ordersListElement = document.getElementById('ordersList');
        const customerNameElement = document.getElementById('customerName');
        const customerPhoneElement = document.getElementById('customerPhone');

        // Function to update the order list display and localStorage
        function updateOrdersDisplay() {
            ordersListElement.innerHTML = ''; // Clear current list
            totalPrice = 0; // Reset total price
            orders.forEach((order, index) => {
                const orderElement = document.createElement('div');
                orderElement.innerHTML = `Product: ${order.name}, Price: $${order.price.toFixed(2)} 
                                          <button onclick="deleteOrder(${index})"> X </button>`;
                ordersListElement.appendChild(orderElement);
                totalPrice += order.price;
            });
            document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
            localStorage.setItem('orders', JSON.stringify(orders)); // Update localStorage
        }

        // Function to delete an order
        function deleteOrder(index) {
            orders.splice(index, 1); // Remove the order at the specified index
            updateOrdersDisplay(); // Refresh the display
        }

        // Fetch and display customer details
        const customerName = localStorage.getItem('userName');
        const customerPhone = localStorage.getItem('userPhone');
        customerNameElement.textContent = customerName ? customerName : 'Not Provided';
        customerPhoneElement.textContent = customerPhone ? customerPhone : 'Not Provided';

        // Initial display of orders
        updateOrdersDisplay();

        // Make deleteOrder function available globally for button onclick event
        window.deleteOrder = deleteOrder;
		
		document.getElementById('printOrder').addEventListener('click', function() {
			const printContent = document.querySelector('.main-content').innerHTML;
			const printWindow = window.open('', 'PRINT', 'height=600,width=800');

			printWindow.document.write('<html><head><title>' + document.title + '</title>');
			printWindow.document.write('<link rel="stylesheet" href="css/style.css"></head><body>');
			printWindow.document.write('<h1>' + document.title + '</h1>');
			printWindow.document.write(printContent);
			printWindow.document.write('</body></html>');

			printWindow.document.close();
			printWindow.focus();

			printWindow.onload = function() {
				setTimeout(() => {
					printWindow.print();
					printWindow.close();
					// Show the "Finish and Clear Data" button after initiating the print action
					document.getElementById('finishOrder').style.display = 'block';
				}, 500);
			};
});

		document.getElementById('finishOrder').addEventListener('click', function() {
			
		alert("All Order Will Be Ready In 30minutes, Please Bring Your Receipt To Claim Your Order.");
		
		// Clear localStorage
		localStorage.clear();
		// Redirect to index.html
		window.location.href = 'index.html';
});

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