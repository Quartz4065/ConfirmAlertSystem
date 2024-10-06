let reminders = [];

// Function to load reminders from local storage
function loadReminders() {
    const savedReminders = localStorage.getItem('reminders');
    if (savedReminders) {
        reminders = JSON.parse(savedReminders); // Parse JSON from local storage
        displayReminders(); // Display reminders on page load
    }
}

// Function to save reminders to local storage
function saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(reminders)); // Convert array to JSON and save to local storage
}

// Function to generate time options for select dropdown (7:00 AM to 4:00 PM in 30-minute intervals)
function generateTimeOptions() {
    const startTime = 7 * 60; // 7:00 AM in minutes
    const endTime = 16 * 60;  // 4:00 PM in minutes
    const timeInterval = 30;  // 30-minute intervals
    const appointmentTimeSelect = document.getElementById('appointment-time');
    const reminderTimeSelect = document.getElementById('reminder-time');

    for (let time = startTime; time <= endTime; time += timeInterval) {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        // Format time in 12-hour format with AM/PM
        const timeString = new Date(`1970-01-01T${formattedTime}:00`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        // Create option elements for both appointment and reminder time
        const optionApp = document.createElement('option');
        optionApp.value = formattedTime;
        optionApp.textContent = timeString;
        appointmentTimeSelect.appendChild(optionApp);

        const optionRem = document.createElement('option');
        optionRem.value = formattedTime;
        optionRem.textContent = timeString;
        reminderTimeSelect.appendChild(optionRem);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and script running");

    // Load reminders when the page is loaded
    loadReminders();

    // Generate time options for appointment and reminder time dropdowns
    generateTimeOptions();

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
        reminders.sort((a, b) => new Date(`1970-01-01T${a.reminderTime}:00`) - new Date(`1970-01-01T${b.reminderTime}:00`));

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
