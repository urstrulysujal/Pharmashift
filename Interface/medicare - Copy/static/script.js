document.addEventListener("DOMContentLoaded", () => {
    const orders = [];
    const detailsContent = document.getElementById("details-content");
    const dispatchButton = document.getElementById("dispatch-button");

    function updateOrderList() {
        const orderList = document.getElementById("order-list");
        orderList.innerHTML = "";
        orders.forEach((order, index) => {
            const li = document.createElement("li");
            li.textContent = `Order ${index + 1}: ${order.patientName}`;
            li.addEventListener("click", () => showOrderDetails(index));
            orderList.appendChild(li);
        });
    }

    function showOrderDetails(index) {
        const order = orders[index];
        detailsContent.innerHTML = `
            <p><strong>Patient Name:</strong> ${order.patientName}</p>
            <p><strong>Bed Number:</strong> ${order.bedNumber}</p>
            <p><strong>Phone:</strong> ${order.phoneNumber}</p>
            <p><strong>Doctor:</strong> ${order.doctorName}</p>
            <p><strong>Medicine:</strong> ${order.medicine.join(", ")}</p>
        `;
        dispatchButton.disabled = false;
        dispatchButton.onclick = () => dispatchOrder(index);
    }

    function dispatchOrder(index) {
        orders.splice(index, 1);
        updateOrderList();
        detailsContent.innerHTML = "";
        dispatchButton.disabled = true;
        alert("Order dispatched successfully!");
    }

    function clearForm() {
        document.getElementById("nurse-form").reset();
        document.getElementById("search-medicine").value = "";
    }

    // Initial call to update the order list
    updateOrderList();
});