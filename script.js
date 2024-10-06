// Placeholder reminder logic using basic JavaScript for now
function setReminder() {
    const employeeName = document.getElementById('employee-name').value;
    const patientName = document.getElementById('patient-name').value;
    const location = document.getElementById('location').value;
    const appointmentTime = document.getElementById('appointment-time').value;
    const reminderTime = document.getElementById('reminder-time').value;

    // Input validation
    if (!employeeName || !patientName || !location || !appointmentTime || !reminderTime) {
        document.getElementById('status').textContent = "Please fill out all fields!";
        return;
    }

    // Display the reminder set message
    document.getElementById('status').textContent = `Reminder set for ${reminderTime} to call and confirm ${patientName}'s appointment with ${employeeName}`;

    // Calculate time to reminder
    const reminderDate = new Date(reminderTime);
    const currentDate = new Date();
    const timeUntilReminder = reminderDate - currentDate;

    // Set a timeout to trigger the alert at the reminder time
    setTimeout(() => {
        alert(`Reminder: It's time for ${employeeName} to call and confirm ${patientName}'s appointment at ${location}`);
    }, timeUntilReminder);

    // Clear form fields after submission
    document.getElementById('employee-name').value = '';
    document.getElementById('patient-name').value = '';
    document.getElementById('location').value = '';
    document.getElementById('appointment-time').value = '';
    document.getElementById('reminder-time').value = '';
}
