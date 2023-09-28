const BASE_URL = "https://jsonbin.org/federico-circosta/patients"

class FakeSecurityModule {

    data = null;

    setData(d) {
        this.data = d
    }

    async getPlainData() {
        let patientsArrayObject = await this.communication("GET")
        const resultMap = new Map();
        await patientsArrayObject.forEach(item => {
            const key = Object.keys(item)[0];
            const patient = item[key];
            const birthdateParts = patient.birthdate.split('-');
            patient.birthdate = new Date(birthdateParts[0], birthdateParts[1] - 1, birthdateParts[2]);
            resultMap.set(key, patient);
        });
        this.setData(resultMap)
    }

    async decriptPatients(idArray) {
        await this.getPlainData()
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

    async communication(method, parameters) {
        let httpResponse = await fetch(BASE_URL, {
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "token 4b23e270-5dd7-45ac-aa1e-753e490ff18f"
            },
            body: JSON.stringify(parameters)
        });
        const status = httpResponse.status;
        try {
            let deserializedObject = await httpResponse.json();
            return deserializedObject;
        } catch (err) {
            console.log(status + " An error occurred")
        }
    }
}

const instance = new FakeSecurityModule()
export default instance