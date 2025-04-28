$(document).ready(function () {
    // Load orders on page load
    function loadOrders(filters = {}) {
        $.get('/orders', function (orders) {
            const ordersList = JSON.parse(orders);
            const tbody = $('#orderList');
            tbody.empty(); // Clear existing rows

            ordersList.forEach(order => {
                if (applyFilters(order, filters)) {
                    const row = `
                        <tr data-id="${order.patient}">
                            <td>${order.patient}</td>
                            <td>${order.medicine}</td>
                            <td>${order.status}</td>
                            <td>
                                <button class="btn btn-info btn-sm view-details" data-id="${order.patient}">View Details</button>
                                <button class="btn btn-primary btn-sm dispatch-order" data-id="${order.patient}">Dispatch</button>
                            </td>
                        </tr>
                    `;
                    tbody.append(row);
                }
            });
        });
    }

    // Apply filters to orders
    function applyFilters(order, filters) {
        if (filters.status && order.status !== filters.status) {
            return false;
        }
        if (filters.patient && !order.patient.toLowerCase().includes(filters.patient.toLowerCase())) {
            return false;
        }
        return true;
    }

    // Handle applying filters
    $('#applyFilters').click(function () {
        const filters = {
            status: $('#statusFilter').val(),
            patient: $('#patientFilter').val()
        };
        loadOrders(filters);
    });

    // Load medicines on page load
    function loadMedicines() {
        $.get('/medicines', function (medicines) {
            const medicinesList = JSON.parse(medicines);
            const tbody = $('#medicinesList');
            tbody.empty(); // Clear existing rows

            medicinesList.forEach(medicine => {
                const row = `
                    <tr>
                        <td>${medicine.name}</td>
                        <td>${medicine.quantity}</td>
                        <td>${medicine.description}</td>
                        <td>
                            <button class="btn btn-danger btn-sm delete-medicine" data-name="${medicine.name}">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });
        });
    }

    // Handle adding a new medicine
    $('#addMedicineButton').click(function () {
        $('#addMedicineForm').removeClass('hidden');
    });

    $('#saveMedicineButton').click(function () {
        const data = {
            name: $('#medicineName').val(),
            quantity: $('#quantity').val(),
            description: $('#description').val(),
        };

        if (!data.name || !data.quantity || !data.description) {
            alert("Please fill all the fields.");
            return;
        }

        $.ajax({
            url: '/medicines',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function () {
                loadMedicines();
                $('#addMedicineForm').addClass('hidden');
                $('#add-medicine-form')[0].reset();
            },
            error: function () {
                alert("Failed to add medicine.");
            }
        });
    });

    // Handle deleting a medicine
    $(document).on('click', '.delete-medicine', function () {
        const medicineName = $(this).data('name');

        $.ajax({
            url: `/medicines/${medicineName}`,
            method: 'DELETE',
            success: function () {
                loadMedicines();
            },
            error: function () {
                alert("Failed to delete medicine.");
            }
        });
    });

    // Handle viewing order details
    $(document).on('click', '.view-details', function () {
        const patientId = $(this).data('id');

        // Fetch order details
        $.get(`/orders/${patientId}`, function (order) {
            const orderDetails = JSON.parse(order)[0]; // Get the first (and only) order
            const medicines = orderDetails.medicine.split(', ');

            let detailsHtml = `<h4>Order Details for ${orderDetails.patient}</h4>`;
            detailsHtml += '<ul id="medicineChecklist">';
            medicines.forEach(medicine => {
                detailsHtml += `<li><input type="checkbox" class="medicine-checkbox" data-medicine="${medicine}"> ${medicine}</li>`;
            });
            detailsHtml += '</ul>';

            $('#orderDetails').html(detailsHtml);
            $('#orderDetailsModal').modal('show');

            // Show dispatch button only when all checkboxes are checked
            $('.medicine-checkbox').on('change', function () {
                const allChecked = $('.medicine-checkbox').length === $('.medicine-checkbox:checked').length;
                if (allChecked) {
                    $('#dispatchButton').removeClass('hidden');
                } else {
                    $('#dispatchButton').addClass('hidden');
                }
            });

            // Handle dispatching the order from the modal
            $('#dispatchButton').off('click').on('click', function () {
                dispatchOrder(patientId);
            });
        });
    });

    // Handle dispatching an order from the table
    $(document).on('click', '.dispatch-order', function () {
        const patientId = $(this).data('id');
        dispatchOrder(patientId);
    });

    // Function to dispatch an order
    function dispatchOrder(patientId) {
        // Get the current WiFi IP address
        $.get('https://api.ipify.org?format=json', function (data) {
            const ipAddress = data.ip;
            const url = `http://192.168.159.32/forward`; //ip adress add here...................................................................................................................

            // Print the current IP address and the constructed URL in the console
            console.log('Current IP Address:', ipAddress);
            console.log('Dispatch URL:', url);

            // Open the dispatch URL in a new tab
            window.open(url, '_blank');

            $.ajax({
                url: url,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ patient: patientId }),
                success: function () {
                    alert('Order dispatched successfully!');
                    // Remove the dispatched order from the list
                    $(`tr[data-id="${patientId}"]`).remove();
                    $('#orderDetailsModal').modal('hide');
                },
                error: function () {
                    console.log('Failed to dispatch order.');
                }
            });
        });
    }

    // Initial data load
    loadOrders();
    loadMedicines();
});