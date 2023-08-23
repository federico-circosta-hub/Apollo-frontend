import PatientModel from "./PatientModel";


export default function GeneratePatients() {
    const patients = [];

    const names = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Hannah", "Isaac", "Julia"];
    const surnames = ["Smith", "Johnson", "Brown", "Lee", "Garcia", "Davis", "Wilson", "Martinez", "Anderson", "Taylor"];
    const genders = ["M", "F"];
    const prothesisOptions = ["Gin-sx", "Gin-dx", "Gom-sx", "Gom-dx", "Cav-sx", "Cav-dx"];

    const getRandomElement = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    function getRandomDate() {
        const maxDate = Date.now();
        const timestamp = Math.floor(Math.random() * maxDate);
        return new Date(timestamp);
    }

    for (let i = 0; i < 10; i++) {
        const name = getRandomElement(names);
        const surname = getRandomElement(surnames);
        const birthdate = getRandomDate()
        const gender = getRandomElement(genders);
        const height = Math.floor(Math.random() * (220 - 120 + 1)) + 120;
        const weight = Math.floor(Math.random() * (150 - 40 + 1)) + 40;

        const prothesisCount = Math.floor(Math.random() * prothesisOptions.length);
        const selectedProthesis = new Set();
        while (selectedProthesis.size < prothesisCount) {
            selectedProthesis.add(getRandomElement(prothesisOptions));
        }
        const prothesis = Array.from(selectedProthesis);
        let patient

        patient = new PatientModel(name, surname, birthdate, gender, height, weight, prothesis);



        patients.push(patient);
    }

    return patients

}
