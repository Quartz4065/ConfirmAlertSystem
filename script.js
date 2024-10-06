let reminders = [];

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

    // Sort reminders by the reminder time, newest (earliest) first
    reminders.sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime));

    // Clear form fields after submission
    document.getElementById('employee-name').value = '';
    document.getElementById('patient-name').value = '';
    document.getElementById('patient-phone').value = '';
    document.getElementById('location').value = '';
    document.getElementById('appointment-time').value = '';
    document.getElementById('reminder-time').value = '';

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
                Appointment at ${reminder.location} on ${new Date(reminder.appointmentTime).toLocaleString()}<br>
                Reminder time: ${new Date(reminder.reminderTime).toLocaleString()}
            </div>
            <input type="checkbox" onclick="markAsCompleted(${reminder.id})">
        `;

        reminderList.appendChild(listItem);
    });
}

function markAsCompleted(reminderId) {
    // Remove the reminder from the array
    reminders = reminders.filter(reminder => reminder.id !== reminderId);

    // Refresh the reminder list
    displayReminders();
}
