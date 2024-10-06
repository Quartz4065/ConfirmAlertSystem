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

// Function to display reminders
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
                Location: ${reminder.location}<br>
                Appointment at ${new Date(reminder.appointmentTime).toLocaleString()}<br>
                Reminder time: ${new Date(reminder.reminderTime).toLocaleString()}
            </div>
            <button onclick="markAsCompleted(${reminder.id})">Complete</button>
        `;

        reminderList.appendChild(listItem);
    });
}

// Function to create and set a new reminder
function setReminder() {
    const employeeName = document.getElementById('employee-name').value;
    const patientName = document.getElementById('patient-name').value;
    const patientPhone = document.getElementById('patient-phone').value;
    const location = document.getElementById('location').value;
    const appointmentTime = document.getElementById('appointment-time').value;
    const reminderTime = document.getElementById('reminder-time').value;

    // Input validation
    if (!employeeName || !patientName || !patientPhone || !location || !appointmentTime || !reminderTime) {
        document.getElementById('status').textContent = "Please fill out all fields!";
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

// Function to mark a reminder as completed and remove it from the list
function markAsCompleted(reminderId) {
    // Remove the reminder from the array
    reminders = reminders.filter(reminder => reminder.id !== reminderId);

    // Save updated reminders to local storage
    saveReminders();

    // Refresh the reminder list
    displayReminders();
}

// Function to dismiss the popup
function dismissPopup() {
    document.getElementById('reminder-popup').style.display = 'none';
}

// Function to show a reminder popup
function showReminderPopup(reminder) {
    const popup = document.getElementById('reminder-popup');
    const popupContent = document.getElementById('popup-content');

    popupContent.innerHTML = `
        <p><strong>${reminder.employeeName}</strong> needs to confirm with <strong>${reminder.patientName}</strong> (${reminder.patientPhone})</p>
        <p>Location: ${reminder.location}</p>
        <p>Appointment at ${new Date(reminder.appointmentTime).toLocaleString()}</p>
        <p>Reminder time: ${new Date(reminder.reminderTime).toLocaleString()}</p>
    `;

    popup.style.display = 'block';
}

// Function to check if it's time for a reminder
function checkReminders() {
    const now = new Date();
    reminders.forEach(reminder => {
        const reminderTime = new Date(reminder.reminderTime);
        // If the reminder time is now or past, show the popup
        if (reminderTime <= now) {
            showReminderPopup(reminder);
        }
    });
}

// Load reminders and expose necessary functions to the global scope
document.addEventListener('DOMContentLoaded', function () {
    loadReminders();
    window.setReminder = setReminder;
    window.markAsCompleted = markAsCompleted;
    window.dismissPopup = dismissPopup;

    // Check for reminders every minute
    setInterval(checkReminders, 60000); // 60000 milliseconds = 1 minute
});
