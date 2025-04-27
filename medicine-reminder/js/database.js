// Database Management for Medicine Reminder App with Offline Support
class Database {
    constructor() {
        this.initializeDB();
        this.setupSync();
    }

    // Initialize database with default structure
    initializeDB() {
        if (!localStorage.getItem('medications')) {
            localStorage.setItem('medications', JSON.stringify([]));
        }
        if (!localStorage.getItem('reminders')) {
            localStorage.setItem('reminders', JSON.stringify([]));
        }
        if (!localStorage.getItem('syncQueue')) {
            localStorage.setItem('syncQueue', JSON.stringify([]));
        }
    }

    // Medication Management
    addMedication(medication) {
        const medications = this.getMedications();
        medication.id = Date.now().toString();
        medication.created = new Date().toISOString();
        medications.push(medication);
        localStorage.setItem('medications', JSON.stringify(medications));
        this.queueSync({ action: 'add', data: medication });
        return medication;
    }

    getMedications() {
        return JSON.parse(localStorage.getItem('medications') || '[]');
    }

    updateMedication(id, updates) {
        let medications = this.getMedications();
        const index = medications.findIndex(med => med.id === id);
        if (index !== -1) {
            medications[index] = { ...medications[index], ...updates };
            localStorage.setItem('medications', JSON.stringify(medications));
            this.queueSync({ action: 'update', data: medications[index] });
            return true;
        }
        return false;
    }

    deleteMedication(id) {
        let medications = this.getMedications();
        medications = medications.filter(med => med.id !== id);
        localStorage.setItem('medications', JSON.stringify(medications));
        this.queueSync({ action: 'delete', data: { id } });
    }

    // Reminder Management
    addReminder(reminder) {
        const reminders = this.getReminders();
        reminder.id = Date.now().toString();
        reminder.created = new Date().toISOString();
        reminders.push(reminder);
        localStorage.setItem('reminders', JSON.stringify(reminders));
        this.queueSync({ action: 'addReminder', data: reminder });
        return reminder;
    }

    getReminders() {
        return JSON.parse(localStorage.getItem('reminders') || '[]');
    }

    updateReminder(id, updates) {
        let reminders = this.getReminders();
        const index = reminders.findIndex(rem => rem.id === id);
        if (index !== -1) {
            reminders[index] = { ...reminders[index], ...updates };
            localStorage.setItem('reminders', JSON.stringify(reminders));
            this.queueSync({ action: 'updateReminder', data: reminders[index] });
            return true;
        }
        return false;
    }

    deleteReminder(id) {
        let reminders = this.getReminders();
        reminders = reminders.filter(rem => rem.id !== id);
        localStorage.setItem('reminders', JSON.stringify(reminders));
        this.queueSync({ action: 'deleteReminder', data: { id } });
    }

    // Queue sync actions for offline mode
    queueSync(action) {
        const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
        syncQueue.push(action);
        localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
    }

    // Setup sync process to send queued actions when online
    setupSync() {
        window.addEventListener('online', () => {
            this.processSyncQueue();
        });
    }

    // Process sync queue
    processSyncQueue() {
        const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
        if (syncQueue.length === 0) return;

        // Simulate sending data to server
        console.log('Syncing data with server:', syncQueue);

        // Clear queue after sync
        localStorage.setItem('syncQueue', JSON.stringify([]));
    }
}

// Initialize database
const db = new Database();
