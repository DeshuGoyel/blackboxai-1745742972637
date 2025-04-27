// Notifications Handler for Medicine Reminder App
class NotificationHandler {
    constructor() {
        this.hasPermission = false;
        this.checkPermission();
    }

    // Check if we have notification permission
    async checkPermission() {
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications");
            return;
        }

        if (Notification.permission === "granted") {
            this.hasPermission = true;
        } else if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            this.hasPermission = permission === "granted";
        }
    }

    // Request notification permission
    async requestPermission() {
        try {
            const permission = await Notification.requestPermission();
            this.hasPermission = permission === "granted";
            return this.hasPermission;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    // Schedule a notification
    scheduleNotification(medication, time) {
        if (!this.hasPermission) {
            console.log("Notification permission not granted");
            return;
        }

        const scheduledTime = new Date(time).getTime();
        const now = new Date().getTime();
        const delay = scheduledTime - now;

        if (delay < 0) {
            console.log("Cannot schedule notification in the past");
            return;
        }

        setTimeout(() => {
            this.showNotification(medication);
        }, delay);
    }

    // Show notification
    showNotification(medication) {
        if (!this.hasPermission) return;

        const options = {
            body: `Time to take ${medication.name} - ${medication.dosage}`,
            icon: '/assets/icons/pill.png',
            badge: '/assets/icons/badge.png',
            vibrate: [100, 50, 100],
            data: {
                medicationId: medication.id,
                timestamp: new Date().toISOString()
            },
            actions: [
                {
                    action: 'take',
                    title: 'Take Now'
                },
                {
                    action: 'snooze',
                    title: 'Snooze'
                }
            ]
        };

        const notification = new Notification('Medicine Reminder', options);

        notification.onclick = (event) => {
            event.preventDefault();
            window.focus();
            notification.close();
        };

        return notification;
    }

    // Schedule daily reminders
    scheduleDailyReminders(medications) {
        medications.forEach(medication => {
            if (medication.schedule && medication.schedule.times) {
                medication.schedule.times.forEach(time => {
                    const [hours, minutes] = time.split(':');
                    const now = new Date();
                    const scheduleTime = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        parseInt(hours),
                        parseInt(minutes)
                    );

                    // If time has passed for today, schedule for tomorrow
                    if (scheduleTime < now) {
                        scheduleTime.setDate(scheduleTime.getDate() + 1);
                    }

                    this.scheduleNotification(medication, scheduleTime);
                });
            }
        });
    }

    // Snooze a notification
    snoozeNotification(medication, minutes = 15) {
        const snoozeTime = new Date(Date.now() + minutes * 60000);
        this.scheduleNotification(medication, snoozeTime);
    }

    // Handle notification actions
    handleNotificationAction(action, notification) {
        const medicationId = notification.data.medicationId;
        const medication = db.getMedications().find(m => m.id === medicationId);

        if (!medication) return;

        switch (action) {
            case 'take':
                // Record medication as taken
                db.updateMedication(medicationId, {
                    lastTaken: new Date().toISOString()
                });
                notification.close();
                break;

            case 'snooze':
                this.snoozeNotification(medication);
                notification.close();
                break;

            default:
                notification.close();
                break;
        }
    }
}

// Initialize notification handler
const notificationHandler = new NotificationHandler();
