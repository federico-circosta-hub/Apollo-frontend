import GenerateImages from "./GenerateImages";

export default class VisitObjectGenerator {

    physicalActivity = {
        'physicalActivity': Math.random() < 0.5, // Genera un valore booleano casuale
        'physicalActivityDate': ('physicalActivity' != false) ? new Date() : '',
        'physicalActivityType': ('physicalActivity' != false) ? ['Cycling', 'Walk', 'Running', 'Swimming'][Math.floor(Math.random() * 4)] : '',
    };

    traumaticEvent = {
        'traumaticEvent': ['None', 'Operation', 'Fall', 'Accident'][Math.floor(Math.random() * 4)],
        'traumaticEventDate': ('traumaticEvent' != 'None') ? new Date() : ''
    };

    followUp = {
        'followUp': Math.random() < 0.5, // Genera un valore booleano casuale
        'treatmentResponse': Math.floor(Math.random() * 5), // Genera un numero intero casuale tra 0 e 4
        'lastVisit': new Date(), // Genera una data casuale
    };

    joints = [];

    needFollowUp = {
        'needFollowUp': Math.random() < 0.5, // Genera un valore booleano casuale
        'followUpDate': new Date(), // Genera una data casuale
    };

    prophylacticDrug = {
        'drug': ['None', 'Artiflexinol', 'FlexiRelieve', 'JointEasePro', 'CartiFlexaMax', 'SynoFlexitron',][Math.floor(Math.random() * 6)], // Genera un nome casuale per la medicina
        'dose': Math.floor(Math.random() * 10), // Genera una dose casuale
        'frequency': Math.floor(Math.random() * 5), // Genera una frequenza casuale
    };

    acuteDrug = {
        'drug': ['None', 'PainXcel', 'ReliefFast', 'AcuPainGone'][Math.floor(Math.random() * 4)], // Genera un nome casuale per la medicina
        'dose': Math.floor(Math.random() * 10), // Genera una dose casuale
    };


    async addJoint(jointName) {
        const newJoint = {
            jointName: jointName,
            selectedImages: await GenerateImages(), // Puoi aggiungere immagini casuali qui se necessario
            indexJoint: Math.random() < 0.5, // Genera un valore booleano casuale
            jointDifficulty: Math.random() < 0.5, // Genera un valore booleano casuale
            pain: Math.random() < 0.5, // Genera un valore booleano casuale
            lastBleed: new Date(), // Genera una data casuale
            synovitis: ['Mild', 'Moderate', 'Severe'][Math.floor(Math.random() * 3)], // Scegli casualmente un livello di sinovite
            articularCartilage: ['Normal', 'Mild', 'Moderate', 'Severe'][Math.floor(Math.random() * 4)], // Scegli casualmente lo stato della cartilagine
            subchondralBone: ['Normal', 'Mild', 'Moderate', 'Severe'][Math.floor(Math.random() * 4)], // Scegli casualmente lo stato dell'osso subcondrale
            distension: ['None', 'Mild', 'Moderate', 'Severe'][Math.floor(Math.random() * 4)], // Scegli casualmente un livello di distensione
            distensionCause: ['Unclear', 'Synovial Effusion', 'Synovial Effusion + Synovial Hyperplasia', 'Vacuum', 'Vacuum + Synovial Hyperplasia', 'Synovial Hyperplasia'][Math.floor(Math.random() * 6)]
        };

        this.joints.push(newJoint);
    }

    generateVisitObject() {
        return {
            physicalActivity: { ...this.physicalActivity },
            traumaticEvent: { ...this.traumaticEvent },
            followUp: { ...this.followUp },
            joints: [...this.joints],
            needFollowUp: { ...this.needFollowUp },
            prophylacticDrug: { ...this.prophylacticDrug },
            acuteDrug: { ...this.acuteDrug },
        };
    }
}

