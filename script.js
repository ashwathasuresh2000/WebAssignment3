document.addEventListener("DOMContentLoaded", function () {
    // Display Name and NUID
    const name = "Ashwatha";
    const nuid = "001234567";
    document.getElementById("name-nuid").textContent = `Name: ${name} | NUID: ${nuid}`;

    setTimeout(() => {
        document.getElementById("content").classList.remove("hidden");
        initializeTable();
    }, 1000);

    const studentTable = document.querySelector("#student-table tbody");
    const submitBtn = document.getElementById("submit-btn");
    let studentCount = 5;

    // Create a custom prompt box for editing
    const editPrompt = document.createElement("div");
    editPrompt.id = "edit-prompt";
    editPrompt.classList.add("prompt");
    editPrompt.innerHTML = `
        <div class="prompt-content">
            <h3 id="prompt-title">Edit Details of <span id="student-name"></span></h3>
            <form id="edit-form">
                <label for="edit-name">Name:</label>
                <input type="text" id="edit-name" required>
                <label for="edit-dept">Department:</label>
                <input type="text" id="edit-dept" required>
                <label for="edit-email">Email:</label>
                <input type="email" id="edit-email" required>
                <label for="edit-phone">Phone:</label>
                <input type="tel" id="edit-phone" required>
                <button type="submit">Ok</button>
                <button type="button" id="cancel-edit">Cancel</button>
            </form>
        </div>
    `;
    document.body.appendChild(editPrompt);

    // Function to show the prompt
    function showPrompt(studentName) {
        document.getElementById("student-name").textContent = studentName;
        editPrompt.style.display = "flex";
    }

    // Function to hide the prompt
    function hidePrompt() {
        editPrompt.style.display = "none";
    }

    // Close prompt when clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === editPrompt) {
            hidePrompt();
        }
    });

    function initializeTable() {
        const starterData = [
            ["1", "Alice Johnson", "Computer Science", "alice@example.com", "123-456-7890"],
            ["2", "Bob Smith", "Mechanical", "bob@example.com", "987-654-3210"],
            ["3", "Charlie Brown", "Electrical", "charlie@example.com", "456-789-1234"],
            ["4", "David Lee", "Civil", "david@example.com", "789-123-4567"],
            ["5", "Emma Wilson", "Business", "emma@example.com", "321-654-9870"],
        ];

        starterData.forEach((data) => addStudentRow(data));
        attachEventListeners(); // Attach event listeners only once
    }

    function addStudentRow([id, name, dept, email, phone]) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="select-expand">
                <input type="checkbox" class="select-checkbox">
                <button class="expand-btn">▼</button>
            </td>
            <td>${id}</td>
            <td>${name}</td>
            <td>${dept}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td><button class="edit-btn hidden">Edit</button></td>
            <td><button class="delete-btn hidden">Delete</button></td>
        `;
        studentTable.appendChild(row);

        // Create an expanded row for details
        const expandedRow = document.createElement("tr");
        expandedRow.classList.add("expanded-content");
        expandedRow.style.display = "none"; // Initially hidden
        expandedRow.innerHTML = `
            <td colspan="8">Details: ID: ${id}, Name: ${name}, Dept: ${dept}, Email: ${email}, Phone: ${phone}</td>
        `;
        studentTable.appendChild(expandedRow);

        // Add event listeners for the expand button
        const expandBtn = row.querySelector(".expand-btn");
        expandBtn.addEventListener("click", function () {
            if (expandedRow.style.display === "none") {
                expandedRow.style.display = "table-row";
                expandBtn.textContent = "▲"; // Change arrow to up
            } else {
                expandedRow.style.display = "none";
                expandBtn.textContent = "▼"; // Change arrow to down
            }
        });

        return name; // Return the name of the added student
    }

    function attachEventListeners() {
        // Event listener for checkboxes
        studentTable.addEventListener("change", function (event) {
            if (event.target.classList.contains("select-checkbox")) {
                const row = event.target.closest("tr");
                const editBtn = row.querySelector(".edit-btn");
                const deleteBtn = row.querySelector(".delete-btn");

                if (event.target.checked) {
                    row.classList.add("selected-row");
                    editBtn.classList.remove("hidden");
                    deleteBtn.classList.remove("hidden");
                } else {
                    row.classList.remove("selected-row");
                    editBtn.classList.add("hidden");
                    deleteBtn.classList.add("hidden");
                }
                updateSubmitButton();
            }
        });

        // Event listener for delete buttons
        studentTable.addEventListener("click", function (event) {
            if (event.target.classList.contains("delete-btn")) {
                const row = event.target.closest("tr");
                const studentName = row.children[2].textContent;
                const nextRow = row.nextElementSibling;

                if (nextRow && nextRow.classList.contains("expanded-content")) {
                    nextRow.remove();
                }
                row.remove();

                // Update student IDs after deletion
                updateStudentIDs();
                 // Update the submit button state
                updateSubmitButton();

                // Show success popup only once
                alert(`${studentName} record deleted successfully`);
            }
        });

        // Event listener for edit buttons
        studentTable.addEventListener("click", function (event) {
            if (event.target.classList.contains("edit-btn")) {
                const row = event.target.closest("tr");
                const id = row.children[1].textContent;
                const name = row.children[2].textContent;
                const dept = row.children[3].textContent;
                const email = row.children[4].textContent;
                const phone = row.children[5].textContent;

                // Populate the prompt with current data
                document.getElementById("edit-name").value = name;
                document.getElementById("edit-dept").value = dept;
                document.getElementById("edit-email").value = email;
                document.getElementById("edit-phone").value = phone;

                // Show the prompt with the student's name in the title
                showPrompt(name);

                // Handle form submission
                const editForm = document.getElementById("edit-form");
                editForm.onsubmit = function (e) {
                    e.preventDefault();

                    // Update the row with new values
                    row.children[2].textContent = document.getElementById("edit-name").value;
                    row.children[3].textContent = document.getElementById("edit-dept").value;
                    row.children[4].textContent = document.getElementById("edit-email").value;
                    row.children[5].textContent = document.getElementById("edit-phone").value;

                    // Hide the prompt
                    hidePrompt();

                    // Show success message with the student's name
                    const updatedName = row.children[2].textContent;
                    alert(`${updatedName} data updated successfully!`);
                };

                // Handle cancel button
                document.getElementById("cancel-edit").onclick = function () {
                    hidePrompt();
                };
            }
        });
    }

    function updateStudentIDs() {
        const rows = document.querySelectorAll("#student-table tbody tr:not(.expanded-content)");
        rows.forEach((row, index) => {
            row.children[1].textContent = index + 1; // Update the ID column
        });
        studentCount = rows.length; // Update the student count
    }

    function updateSubmitButton() {
        const anyChecked = document.querySelectorAll(".select-checkbox:checked").length > 0;
        submitBtn.disabled = !anyChecked;
        submitBtn.classList.toggle("enabled", anyChecked);
    }

    document.getElementById("add-student").addEventListener("click", function () {
        const newStudentForm = document.createElement("form");
        newStudentForm.innerHTML = `
            <label for="new-name">Name:</label>
            <input type="text" id="new-name" required>
            <label for="new-dept">Department:</label>
            <input type="text" id="new-dept" required>
            <label for="new-email">Email:</label>
            <input type="email" id="new-email" required>
            <label for="new-phone">Phone:</label>
            <input type="tel" id="new-phone" required>
            <button type="submit">Add</button>
            <button type="button" id="cancel-add">Cancel</button>
        `;

        // Append the form to the body or a specific container
        document.body.appendChild(newStudentForm);

        // Handle form submission
        newStudentForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = document.getElementById("new-name").value;
            const dept = document.getElementById("new-dept").value;
            const email = document.getElementById("new-email").value;
            const phone = document.getElementById("new-phone").value;

            // Validate inputs
            if (!name || !dept || !email || !phone) {
                alert("Error: All fields are required. Please fill out all fields.");
                return; // Stop execution if validation fails
            }

            if (!validateEmail(email)) {
                alert("Error: Invalid email format. Please enter a valid email address.");
                return; // Stop execution if email is invalid
            }

            if (!validatePhone(phone)) {
                alert("Error: Invalid phone number format. Please enter a valid phone number.");
                return; // Stop execution if phone is invalid
            }

            studentCount++;
            const addedStudentName = addStudentRow([studentCount, name, dept, email, phone]);
            newStudentForm.remove();

            // Show success popup with the student's name
            alert(`${addedStudentName} record added successfully!`);
        });

        // Handle cancel button
        document.getElementById("cancel-add").addEventListener("click", function () {
            newStudentForm.remove();
        });
    });
    // Function to validate email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to validate phone number format
    function validatePhone(phone) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/; // Matches format: 123-456-7890
        return phoneRegex.test(phone);
    }

    document.getElementById("submit-btn").addEventListener("click", function () {
        const selectedStudents = [];
        document.querySelectorAll(".select-checkbox:checked").forEach((checkbox) => {
            const row = checkbox.closest("tr");
            const student = {
                id: row.children[1].textContent,
                name: row.children[2].textContent,
                dept: row.children[3].textContent,
                email: row.children[4].textContent,
                phone: row.children[5].textContent,
            };
            selectedStudents.push(student);
        });

        // Display the selected students (for example, in an alert)
        alert("Selected Students:\n" + JSON.stringify(selectedStudents, null, 2));
    });
});

