document.addEventListener("DOMContentLoaded", function () {
    const newOrderButton = document.getElementById("new-order-button");
    const orderFormSection = document.getElementById("new-order-section");
    const closeOrderFormButton = document.getElementById("close-order-form");
    const ordersList = document.getElementById("orders-list").querySelector('tbody');
    const newOrderForm = document.getElementById("new-order-form");
    const filterButton = document.getElementById("filter-button");
    const orderFilter = document.getElementById("order-filter");
    const medicineSearch = document.getElementById("medicine-search");
    const medicineResults = document.getElementById("medicine-results");
    const medicineList = document.getElementById("medicine-list");

    // Show the order form
    newOrderButton.addEventListener("click", function () {
        orderFormSection.classList.remove("hidden");
    });

    // Close the order form
    closeOrderFormButton.addEventListener("click", function () {
        orderFormSection.classList.add("hidden");
    });

    // Fetch and display orders
    function fetchOrders() {
        console.log('Fetching orders...');
        fetch('/orders')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Orders fetched:', data);
                displayOrders(data);
            })
            .catch((error) => console.error('Error fetching orders:', error));
    }

    // Display orders with sorting and filtering
    function displayOrders(data) {
        ordersList.innerHTML = ''; // Clear previous content

        // Sort and filter orders based on selected criteria
        const filterValue = orderFilter.value;
        if (filterValue === 'recent') {
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (filterValue === 'oldest') {
            data.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (filterValue === 'pending') {
            data = data.filter(order => order.status === 'Pending');
        } else if (filterValue === 'completed') {
            data = data.filter(order => order.status === 'Completed');
        }

        // Sort emergency orders to the top
        data.sort((a, b) => {
            if (a.emergency && !b.emergency) return -1;
            if (!a.emergency && b.emergency) return 1;
            return 0;
        });

        data.forEach((order, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${order.patient}</td>
                <td>${order.bed}</td>
                <td>${order.phone}</td>
                <td>${order.doctor}</td>
                <td>${order.medicine}</td>
                <td>${order.status}</td>
                <td>${order.emergency}</td>
                <td>${order.date}</td>
                <td>${order.time}</td>
                <td><button class="btn btn-primary btn-sm send-order" data-id="${order.patient}">Send Order</button></td>
            `;
            if (order.emergency) {
                row.style.color = 'red';
            }
            ordersList.appendChild(row);
        });
    }

    // Submit a new order
    newOrderForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = {
            patient: document.getElementById("patient-name").value,
            bed: document.getElementById("bed-number").value,
            phone: document.getElementById("phone-number").value,
            doctor: document.getElementById("doctor-name").value,
            medicine: medicineList.value,
            status: "Pending",
            emergency: document.getElementById("emergency").value === "Yes", // Assuming emergency is a select
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
        };

        fetch('/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Order submitted successfully!");
                    fetchOrders(); // Refresh orders
                    newOrderForm.reset();
                    orderFormSection.classList.add("hidden");
                } else {
                    alert("Failed to submit order");
                }
            })
            .catch((error) => console.error('Error submitting order:', error));
    });

    // Apply filter and fetch orders
    filterButton.addEventListener("click", function () {
        fetchOrders();
    });

    // Fetch medicines for search
    function fetchMedicines(query) {
        fetch('/medicines')
            .then((response) => response.json())
            .then((data) => {
                const filteredMedicines = data.filter(medicine => medicine.toLowerCase().includes(query.toLowerCase()));
                displayMedicineResults(filteredMedicines);
            })
            .catch((error) => console.error('Error fetching medicines:', error));
    }

    // Display medicine search results
    function displayMedicineResults(medicines) {
        medicineResults.innerHTML = '';
        medicines.forEach(medicine => {
            const li = document.createElement('li');
            li.textContent = medicine;
            li.addEventListener('click', () => {
                addMedicineToList(medicine);
            });
            medicineResults.appendChild(li);
        });
    }

    // Add selected medicine to the list
    function addMedicineToList(medicine) {
        const currentMedicines = medicineList.value ? medicineList.value.split(', ') : [];
        if (!currentMedicines.includes(medicine)) {
            currentMedicines.push(medicine);
            medicineList.value = currentMedicines.join(', ');
        }
        medicineResults.innerHTML = ''; // Clear search results
        medicineSearch.value = ''; // Clear search input
    }

    // Handle medicine search input
    medicineSearch.addEventListener('input', function () {
        const query = medicineSearch.value;
        if (query.length > 2) { // Start searching after 3 characters
            fetchMedicines(query);
        } else {
            medicineResults.innerHTML = ''; // Clear search results if query is too short
        }
    });

    // Handle sending an order
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('send-order')) {
            const patientId = event.target.getAttribute('data-id');
            sendOrder(patientId);
        }
    });

    // Function to send an order
    function sendOrder(patientId) {
        // Get the current WiFi IP address
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const ipAddress = data.ip;
                const url = `https://${ipAddress}/backward`; // IP adress add here..................................................................................................................................

                // Print the current IP address and the constructed URL in the console
                console.log('Current IP Address:', ipAddress);
                console.log('Send Order URL:', url);

                // Open the send order URL in a new tab
                window.open(url, '_blank');

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ patient: patientId }),
                })
                    .then(response => {
                        if (response.ok) {
                            alert('Order sent successfully!');
                            // Remove the sent order from the list
                            const row = document.querySelector(`tr[data-id="${patientId}"]`);
                            if (row) {
                                row.remove();
                            }
                        } else {
                            console.log('Failed to send order.');
                        }
                    })
                    .catch(error => console.error('Error sending order:', error));
            })
            .catch(error => console.error('Error fetching IP address:', error));
    }

    // Initial fetch for existing orders
    fetchOrders();
});