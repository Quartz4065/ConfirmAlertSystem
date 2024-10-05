// Initialize Supabase
const supabaseUrl = 'https://akyxjjugvoygatvmdcew.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXhqanVndm95Z2F0dm1kY2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMzgzNTksImV4cCI6MjA0MzcxNDM1OX0.tYy2TURvZA0FPteFMANyVWQe8urI7_Ilg8mrDEnA-cs
';
const supabase = Supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', loadReminders);

async function setReminder() {
    const patientName = document.getElementById('patient-name').value;
    const location = document.getElementById('location').value;
    const appointmentTime = document.getElementById('appointment-time').value;
    const reminderTime = document.getElementById('reminder-time').value;

    if (!patientName || !location || !appointmentTime || !reminderTime) {
        document.getElementById('status').textContent = 'Please fill out all fields.';
        return;
    }
    const { data, error } = await supabase
        .from('appointments')
        .insert([{ 
            patient_name: patientName, 
            location, 
            appointment_time: appointmentTime, 
            reminder_time: reminderTime,
            completed: false
        }]);

    if (error) {
        console.error('Error storing appointment:', error);
        document.getElementById('status').textContent = 'Error setting the reminder.';
    } else {
        document.getElementById('status').textContent = `Reminder set for ${reminderTime}`;
        addReminderToUI(data[0]);
        schedulePushNotification(new Date(reminderTime), data[0].id);
    }
}

function schedulePushNotification(reminderTime, reminderId) {
    const now = new Date();
    const timeUntilReminder = reminderTime - now;

    if (timeUntilReminder > 0) {
        setTimeout(() => {
            notifyUser(reminderId);
        }, timeUntilReminder);
    }
}

function notifyUser(reminderId) {
    OneSignal.push(function() {
        OneSignal.sendSelfNotification(
            "Reminder",
            "Time to call and confirm the appointment!",
            "https://your-site.com",  // Replace with your site URL
            {
                action: "confirm",
                actionText: "Mark as Completed"
            }
        );
    });
}

async function loadReminders() {
    const { data: reminders, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('completed', false);

    if (error) {
        console.error('Error loading reminders:', error);
    } else {
        reminders.forEach(addReminderToUI);
    }
}

function addReminderToUI(reminder) {
    const reminderList = document.getElementById('reminder-list');
    const listItem = document.createElement('li');
    listItem.classList.add('reminder-item');
    listItem.id = `reminder-${reminder.id}`;
    listItem.innerHTML = `
        <strong>${reminder.patient_name}</strong> - ${reminder.location}<br>
        Appointment Time: ${new Date(reminder.appointment_time).toLocaleString()}<br>
        Reminder Time: ${new Date(reminder.reminder_time).toLocaleString()}<br>
        <button onclick="markAsCompleted('${reminder.id}')">Mark as Completed</button>
    `;
    reminderList.appendChild(listItem);
}

async function markAsCompleted(reminderId) {
    const { error } = await supabase
        .from('appointments')
        .update({ completed: true })
        .eq('id', reminderId);

    if (error) {
        console.error('Error marking as completed:', error);
    } else {
        document.getElementById(`reminder-${reminderId}`).remove();
    }
}
