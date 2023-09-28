class FakeSecurityModule {

    data = new Map([
        [
            'paziente1', {
                'pid': 'paziente1',
                'name': 'Mario',
                'surname': 'Rossi',
                'birthdate': new Date('1970', '3', '1'),
                'gender': 'M',
                'height': 180,
                'weight': 75,
                'prothesis': null
            }
        ],
        [
            'paziente2', {
                'pid': 'paziente2',
                'name': 'Luca',
                'surname': 'Bianchi',
                'birthdate': new Date('1980', '8', '1'),
                'gender': 'M',
                'height': 185,
                'weight': 89,
                'prothesis': 'Gin sx'
            }
        ],
        [
            'a1b2c3', {
                'pid': 'a1b2c3',
                'name': 'Anna',
                'surname': 'Verdi',
                'birthdate': new Date('1990', '1', '1'),
                'gender': 'M',
                'height': 165,
                'weight': 54,
                'prothesis': null
            }
        ]
    ])

    decriptPatients(idArray) {
        let patients = []
        idArray.forEach(id => {
            patients.push(this.data.get(id.pid))
        });
        return patients
    }

    encryptAndStorePatient(patientObj) {
        let id = ''
        return id
    }
}

const instance = new FakeSecurityModule()
export default instance