let reminders = [];

// Load reminders from local storage
function loadReminders() {
    const savedReminders = localStorage.getItem('reminders');
    if (savedReminders) {
        reminders = JSON.parse(savedReminders); // Parse JSON from local storage
        displayReminders(); // Display reminders on page load
    }
}

// Save reminders to local storage
function saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(reminders)); // Convert array to JSON and save to local storage
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and script running");

    // Load reminders when the page is loaded
    loadReminders();

    function setReminder() {
        console.log("setReminder function called");

        const employeeName = document.getElementById('employee-name').value;
        const patientName = document.getElementById('patient-name').value;
        const patientPhone = document.getElementById('patient-phone').value;
        const location = document.getElementById('location').value;
        const appointmentTime = document.getElementById('appointment-time').value;
        const reminderTime = document.getElementById('reminder-time').value;

        // Input validation
        if (!employeeName || !patientName || !patientPhone || !location || !appointmentTime || !reminderTime) {
            document.getElementById('status').textContent = "Please fill out all fields!";
            console.log("Form not filled out correctly");
            return;
        }

        // Create a new reminder object
        const reminder = {
            id: Date.now(),
            employeeName,
            patientName,
            patientPhone,
            location,
            appointmentTime,
            reminderTime,
        };

        console.log("Reminder object created:", reminder);

        // Add reminder to the array
        reminders.push(reminder);

        // Sort reminders by the reminder time, from earliest to latest
        reminders.sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime));

        // Clear form fields after submission
        document.getElementById('employee-name').value = '';
        document.getElementById('patient-name').value = '';
        document.getElementById('patient-phone').value = '';
        document.getElementById('location').value = '';
        document.getElementById('appointment-time').value = '';
        document.getElementById('reminder-time').value = '';

        // Save reminders to local storage
        saveReminders();

        // Display the updated reminder list
        displayReminders();
    }

    function displayReminders() {
        const reminderList = document.getElementById('reminder-list');
        reminderList.innerHTML = '';  // Clear the list

        // Add each reminder to the list
        reminders.forEach(reminder => {
            const listItem = document.createElement('li');
            listItem.classList.add('reminder-item');
            listItem.id = `reminder-${reminder.id}`;
            
            listItem.innerHTML = `
                <div>
                    <strong>${reminder.employeeName}</strong> needs to confirm with <strong>${reminder.patientName}</strong> (${reminder.patientPhone})<br>
                    Appointment at ${new Date(reminder.appointmentTime).toLocaleString()}<br>
                    Reminder time: ${new Date(reminder.reminderTime).toLocaleString()}
                </div>
                <button onclick="markAsCompleted(${reminder.id})">Complete</button>
            `;

            reminderList.appendChild(listItem);
        });
    }

    window.markAsCompleted = function(reminderId) {
        // Remove the reminder from the array
        reminders = reminders.filter(reminder => reminder.id !== reminderId);

        // Save updated reminders to local storage
        saveReminders();

        // Refresh the reminder list
        displayReminders();
    }

    // Expose the setReminder function to the global scope so the onclick handler works
    window.setReminder = setReminder;
});
