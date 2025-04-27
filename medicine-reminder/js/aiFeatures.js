class AIFeatures {
    constructor() {
        this.userMedicalHistory = null;
        this.dietarySuggestions = {};
        this.wearableData = {};
        this.psychologicalPreferences = {};
    }

    loadMedicalHistory(history) {
        this.userMedicalHistory = history;
        this.updateCustomizations();
    }

    updateCustomizations() {
        if (!this.userMedicalHistory) return;

        if (this.userMedicalHistory.conditions.includes('diabetes')) {
            console.log('Adjusting reminders for diabetes');
        }
        if (this.userMedicalHistory.conditions.includes('hypertension')) {
            console.log('Adjusting reminders for hypertension');
        }
    }

    suggestDietaryAdjustments(medications) {
        medications.forEach(med => {
            if (med.name.toLowerCase().includes('fiber')) {
                this.dietarySuggestions[med.name] = 'Increase intake of fruits and vegetables rich in fiber.';
            }
            if (med.name.toLowerCase().includes('warfarin')) {
                this.dietarySuggestions[med.name] = 'Avoid foods high in vitamin K such as spinach and kale.';
            }
        });
        return this.dietarySuggestions;
    }

    syncWearableData(data) {
        this.wearableData = data;
        this.analyzeWearableData();
    }

    analyzeWearableData() {
        if (!this.wearableData) return;

        if (this.wearableData.heartRate > 100) {
            console.log('High heart rate detected, consider alerting user.');
        }
        if (this.wearableData.bloodSugar < 70) {
            console.log('Low blood sugar detected, adjust medication schedule.');
        }
    }

    loadPsychologicalPreferences(prefs) {
        this.psychologicalPreferences = prefs;
    }

    personalizeSchedules() {
        if (!this.psychologicalPreferences) return;

        if (this.psychologicalPreferences.prefersVoiceReminders) {
            console.log('Enable voice reminders.');
        }
        if (this.psychologicalPreferences.prefersTextReminders) {
            console.log('Enable text reminders.');
        }
    }

    triggerEmergencyContact() {
        alert('Emergency! Contacting medical professional...');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                console.log('User location:', position.coords.latitude, position.coords.longitude);
            });
        }
    }
}

window.aiFeatures = new AIFeatures();
