document.getElementById("login-button").addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;
    const feedback = document.getElementById("login-feedback");

    feedback.textContent = ""; // Clear previous feedback

    // Basic validation
    if (!username) {
        feedback.textContent = "Username is required.";
        return;
    }
    if (!password) {
        feedback.textContent = "Password is required.";
        return;
    }
    if (!role) {
        feedback.textContent = "Please select a role.";
        return;
    }

    // Dummy authentication logic
    if (role === "nurse") {
        window.location.href = "nurses.html"; // Redirect to nurses' panel
    } else if (role === "pharmacy") {
        window.location.href = "pharmacy.html"; // Redirect to pharmacy panel
    } else {
        feedback.textContent = "Invalid role selected.";
    }
});