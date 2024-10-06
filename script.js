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

// Function to generate time options for appointment time (on the hour from 7 AM to 4 PM)
function generateAppointmentTimeOptions() {
    const appointmentTimeSelect = document.getElementById('appointment-time');
    const startHour = 7;  // Start time: 7 AM
    const endHour = 16;   // End time: 4 PM

    for (let hour = startHour; hour <= endHour; hour++) {
        const time = new Date(`1970-01-01T${hour.toString().padStart(2, '0')}:00:00`);
        const timeString = time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const option = document.createElement('option');
        option.value = timeString;
        option.textContent = timeString;
        appointmentTimeSelect.appendChild(option);
    }
}

// Function to generate time options for reminder time (half-hour intervals from 7:30 AM to 3:30 PM)
function generateReminderTimeOptions() {
    const reminderTimeSelect = document.getElementById('reminder-time');
    const startHour = 7;  // Start time: 7 AM
    const endHour = 15;   // End time: 3 PM
    const intervals = [30];  // We only want half-hour intervals

    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute of intervals) {
            const time = new Date(`1970-01-01T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);
            const timeString = time.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const option = document.createElement('option');
            option.value = timeString;
            option.textContent = timeString;
            reminderTimeSelect.appendChild(option);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and script running");

    // Load reminders when the page is loaded
    loadReminders();

    // Generate time options for appointment and reminder time dropdowns
    generateAppointmentTimeOptions();
    generateReminderTimeOptions();

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
        reminders.sort((a, b
