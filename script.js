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
    for (let hour = 7; hour <= 16; hour++) {
        let period = "AM";
        let displayHour = hour;
        if (hour > 12) {
            displayHour = hour - 12;
            period = "PM";
        } else if (hour === 12) {
            period = "PM";
        }
        const timeString = `${displayHour}:00 ${period}`;
        
        const option = document.createElement('option');
        option.value = timeString;
        option.textContent = timeString;
        appointmentTimeSelect.appendChild(option);
    }
}

// Function to generate time options for reminder time (half-hour intervals from 7:30 AM to 3:30 PM)
function generateReminderTimeOptions() {
    const reminderTimeSelect = document.getElementById('reminder-time');
    for (let hour = 7; hour <= 15; hour++) {
        let period = "AM";
        let displayHour = hour;
        if (hour > 12) {
            displayHour = hour - 12;
            period = "PM";
        } else if (hour === 12) {
            period = "PM";
        }
        // Generate half-hour intervals
        const timeStringHalfHour = `${displayHour}:30 ${period}`;
        
        const optionHalfHour = document.createElement('option');
        optionHalfHour.value = timeStringHalfHour;
        optionHalfHour.textContent = timeStringHalfHour;
        reminderTimeSelect.appendChild(optionHalfHour);
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
        reminders.sort((a, b) => new Date(`1970-01-01T${a.reminderTime}`) - new Date(`1970-01-01T${b.reminderTime}`));

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
                    Appointment at ${reminder.location} on ${reminder.appointmentTime}<br>
                    Reminder time: ${reminder.reminderTime}
                </div>
                <button onclick="markAsCompleted(${reminder.id})">Completed</button>
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
