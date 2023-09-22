import PatientModel from "./PatientModel";


export default function GeneratePatients() {
    const patients = [];

    const names = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Hannah", "Isaac", "Julia", "Oliver", "Sophia", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Mia", "Mason", "Lily", "Lucas", "Chloe", "Elijah", "Charlotte", "Logan", "Ella", "Aiden", "Harper", "Carter", "Scarlett", "Jackson", "Zoe", "Michael", "Madison", "James", "Abigail", "Benjamin", "Emily", "Henry"];
    const surnames = ["Smith", "Johnson", "Brown", "Lee", "Garcia", "Davis", "Wilson", "Martinez", "Anderson", "Taylor", "Jones", "Miller", "Williams", "Jackson", "Harris", "Clark", "Lewis", "Walker", "White", "Moore", "Hall", "Allen", "Young", "Turner", "Thomas", "Baker", "Green", "Hill", "King", "Scott", "Evans", "Wright", "Perez", "Robinson", "Stewart", "Cook", "Murphy", "Rogers", "Adams"];
    const genders = ["M", "F"];
    const prothesisOptions = ["Left knee", "Right knee", "Left elbow", "Right elbow", "Left ankle", "Right ankle"];

    const getRandomElement = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    function getRandomDate() {
        const maxDate = Date.now();
        const timestamp = Math.floor(Math.random() * maxDate);
        return new Date(timestamp);
    }

    for (let i = 0; i < 50; i++) {
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
