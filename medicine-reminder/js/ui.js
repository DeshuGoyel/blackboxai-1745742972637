// UI Handler for Medicine Reminder App
class UI {
    constructor() {
        this.initializeEventListeners();
        this.updateDashboard();
        this.addEmergencyFeature();
        this.addAdherenceTips();
    }

    // Add Emergency Feature UI and logic
    addEmergencyFeature() {
        const emergencyBtn = document.createElement('button');
        emergencyBtn.textContent = 'Emergency Help';
        emergencyBtn.className = 'fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-red-700 transition duration-300';
        emergencyBtn.title = 'Contact Medical Professional';

        emergencyBtn.addEventListener('click', () => {
            aiFeatures.triggerEmergencyContact();
        });

        document.body.appendChild(emergencyBtn);
    }

    // Add Child Safety Mode UI and logic
    addChildSafetyMode() {
        const childModeBtn = document.createElement('button');
        childModeBtn.textContent = 'Child Safety Mode';
        childModeBtn.className = 'fixed bottom-16 right-6 bg-yellow-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-yellow-600 transition duration-300';
        childModeBtn.title = 'Enable Child Safety Mode';

        childModeBtn.addEventListener('click', () => {
            alert('Child Safety Mode Activated! Fun reminders enabled.');
            // Implement fun reminders and dashboard adjustments here
        });

        document.body.appendChild(childModeBtn);
    }

    // Add personalized adherence tips UI
    addAdherenceTips() {
        const tipsContainer = document.createElement('div');
        tipsContainer.id = 'adherenceTips';
        tipsContainer.className = 'fixed bottom-20 right-6 bg-blue-100 text-blue-900 p-4 rounded-lg shadow-md max-w-xs font-inter text-sm';

        tipsContainer.innerHTML = `
            <h4 class="font-semibold mb-2">Medication Adherence Tips</h4>
            <ul id="tipsList" class="list-disc list-inside">
                <li>Stay consistent with your medication schedule.</li>
                <li>Use reminders and alarms.</li>
                <li>Keep a medication journal.</li>
            </ul>
        `;

        document.body.appendChild(tipsContainer);
    }

    // Update adherence tips dynamically (placeholder)
    updateAdherenceTips(tips) {
        const tipsList = document.getElementById('tipsList');
        if (!tipsList) return;

        tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Add Medication Button
        const addMedBtn = document.querySelector('#addMedicationBtn');
        if (addMedBtn) {
            addMedBtn.addEventListener('click', () => this.showAddMedicationModal());
        }

        // Add Medication Form
        const addMedForm = document.querySelector('#addMedicationForm');
        if (addMedForm) {
            addMedForm.addEventListener('submit', (e) => this.handleAddMedication(e));
        }

        // Mark as Taken Buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.mark-taken-btn')) {
                const medicationId = e.target.dataset.medicationId;
                this.markMedicationAsTaken(medicationId);
            }
        });
    }

    // Show Add Medication Modal
    showAddMedicationModal() {
        const modal = document.querySelector('#addMedicationModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    // Hide Add Medication Modal
    hideAddMedicationModal() {
        const modal = document.querySelector('#addMedicationModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Handle Add Medication Form Submission
    handleAddMedication(e) {
        e.preventDefault();
        
        const medicationData = {
            name: document.querySelector('#medication').value,
            dosage: document.querySelector('#dosage').value,
            frequency: document.querySelector('#frequency').value,
            schedule: this.generateSchedule(document.querySelector('#frequency').value),
            stock: 30, // Default 30 days supply
            created: new Date().toISOString()
        };

        // Add to database
        db.addMedication(medicationData);
        
        // Schedule notifications
        notificationHandler.scheduleDailyReminders([medicationData]);
        
        // Update UI
        this.updateDashboard();
        this.hideAddMedicationModal();
        
        // Reset form
        e.target.reset();
    }

    // Generate schedule based on frequency
    generateSchedule(frequency) {
        const schedule = {
            times: []
        };

        switch (frequency) {
            case 'Once daily':
                schedule.times.push('09:00');
                break;
            case 'Twice daily':
                schedule.times.push('09:00', '21:00');
                break;
            case 'Three times daily':
                schedule.times.push('09:00', '15:00', '21:00');
                break;
            case 'As needed':
                schedule.asNeeded = true;
                break;
        }

        return schedule;
    }

    // Mark medication as taken
    markMedicationAsTaken(medicationId) {
        const medication = db.getMedications().find(m => m.id === medicationId);
        if (medication) {
            db.updateMedication(medicationId, {
                lastTaken: new Date().toISOString()
            });
            this.updateDashboard();
        }
    }

    // Update Dashboard
    updateDashboard() {
        this.updateStats();
        this.updateSchedule();
        this.updateMedicationList();
    }

    // Update Statistics
    updateStats() {
        const medications = db.getMedications();
        const today = new Date().toISOString().split('T')[0];
        
        // Count today's medications
        const todaysMeds = medications.filter(med => {
            return med.schedule && !med.schedule.asNeeded;
        }).length;

        // Count taken medications
        const takenMeds = medications.filter(med => {
            return med.lastTaken && med.lastTaken.startsWith(today);
        }).length;

        // Update UI elements
        const todaysMedsElement = document.querySelector('#todaysMeds');
        const takenMedsElement = document.querySelector('#takenMeds');
        const remainingMedsElement = document.querySelector('#remainingMeds');

        if (todaysMedsElement) todaysMedsElement.textContent = todaysMeds;
        if (takenMedsElement) takenMedsElement.textContent = takenMeds;
        if (remainingMedsElement) remainingMedsElement.textContent = todaysMeds - takenMeds;
    }

    // Update Schedule
    updateSchedule() {
        const scheduleContainer = document.querySelector('#todaySchedule');
        if (!scheduleContainer) return;

        const medications = db.getMedications();
        const today = new Date().toISOString().split('T')[0];
        
        // Group medications by time
        const schedule = medications.reduce((acc, med) => {
            if (med.schedule && med.schedule.times) {
                med.schedule.times.forEach(time => {
                    if (!acc[time]) acc[time] = [];
                    acc[time].push(med);
                });
            }
            return acc;
        }, {});

        // Sort times and create schedule elements
        const sortedTimes = Object.keys(schedule).sort();
        scheduleContainer.innerHTML = sortedTimes.map(time => {
            const meds = schedule[time];
            const isTaken = meds.every(med => 
                med.lastTaken && med.lastTaken.startsWith(today)
            );

            return `
                <div class="flex items-center p-4 ${isTaken ? 'bg-green-50' : 'bg-blue-50'} rounded-lg">
                    <div class="h-10 w-10 ${isTaken ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mr-4">
                        <i class="fas fa-clock text-${isTaken ? 'green' : 'blue'}-500"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800">${time}</h4>
                        <p class="text-sm text-gray-600">
                            ${meds.map(med => med.name).join(', ')}
                        </p>
                    </div>
                    ${isTaken ? 
                        '<span class="px-4 py-2 bg-green-500 text-white rounded-lg">Taken</span>' :
                        `<button class="mark-taken-btn px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            data-medication-id="${meds[0].id}">
                            Mark as Taken
                        </button>`
                    }
                </div>
            `;
        }).join('');
    }

    // Update Medication List
    updateMedicationList() {
        const listContainer = document.querySelector('#medicationList');
        if (!listContainer) return;

        const medications = db.getMedications();
        
        listContainer.innerHTML = medications.map(med => `
            <tr class="border-b">
                <td class="py-3 px-4">
                    <div class="flex items-center">
                        <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <i class="fas fa-capsules text-blue-500"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-800">${med.name}</p>
                            <p class="text-sm text-gray-500">${med.dosage}</p>
                        </div>
                    </div>
                </td>
                <td class="py-3 px-4 text-gray-600">${med.frequency}</td>
                <td class="py-3 px-4">
                    <span class="px-2 py-1 bg-green-100 text-green-600 rounded">
                        ${med.stock} days left
                    </span>
                </td>
                <td class="py-3 px-4">
                    <button class="text-gray-600 hover:text-primary mr-3" onclick="ui.editMedication('${med.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-gray-600 hover:text-red-500" onclick="ui.deleteMedication('${med.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Edit Medication
    editMedication(id) {
        const medications = db.getMedications();
        const medication = medications.find(med => med.id === id);
        if (!medication) {
            alert('Medication not found');
            return;
        }

        // Populate modal form with medication data
        const modal = document.getElementById('addMedicationModal');
        if (!modal) return;

        modal.classList.remove('hidden');
        document.getElementById('medication').value = medication.name;
        document.getElementById('dosage').value = medication.dosage;
        document.getElementById('frequency').value = medication.frequency;

        // Change modal submit button text to 'Update Medication'
        const submitBtn = modal.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Update Medication';
        }

        // Remove previous event listener if any
        const newForm = modal.querySelector('form');
        if (newForm) {
            newForm.onsubmit = (e) => {
                e.preventDefault();
                medication.name = document.getElementById('medication').value;
                medication.dosage = document.getElementById('dosage').value;
                medication.frequency = document.getElementById('frequency').value;
                db.updateMedication(id, medication);
                this.updateDashboard();
                this.hideAddMedicationModal();
                // Reset submit button text
                submitBtn.textContent = 'Add Medication';
                // Reset form submit handler to default
                newForm.onsubmit = this.handleAddMedication.bind(this);
            };
        }
    }

    // Delete Medication
    deleteMedication(id) {
        if (confirm('Are you sure you want to delete this medication?')) {
            db.deleteMedication(id);
            this.updateDashboard();
        }
    }
}

// Initialize UI
const ui = new UI();
