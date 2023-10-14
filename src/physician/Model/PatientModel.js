import DeanonymizedCC from "../../common/Model/Communication/DeanonymizedCommunicationController";

export default class PatientModel {
    name;
    surname;
    birthdate;
    gender;
    height;
    weight;
    prothesis;

    constructor(name, surname, birthdate, gender, height, weight, prothesis) {
        this.name = name;
        this.surname = surname;
        this.birthdate = birthdate;
        this.gender = gender;
        this.height = height;
        this.weight = weight;
        this.prothesis = prothesis;
    }

    setName(s) {
        this.name = s;
    }

    setSurname(s) {
        this.surname = s;
    }

    setBirthdate(d) {
        this.birthdate = d;
    }

    setGender(s) {
        this.gender = s;
    }

    setHeight(h) {
        this.height = h;
    }

    setWeight(w) {
        this.weight = w;
    }

    addProthesis(p) {
        this.prothesis.push(p);
    }

    deleteProthesis(p) {
        let i = this.prothesis.indexOf(p);
        this.prothesis.splice(i, 1);
    }

    toString() {
        console.log(
            "My name is %s %s I was born in %s, I'm %s, my height is %d and my weight is %d, I've %s prothesis",
            this.name,
            this.surname,
            this.birthdate,
            this.gender,
            this.height,
            this.weight,
            this.prothesis.toString()
        );
    }

    clone() {
        return new PatientModel(
            this.name,
            this.surname,
            this.birthdate,
            this.gender,
            this.height,
            this.weight,
            this.prothesis
        );
    }

    async register(pid) {
        await DeanonymizedCC.post("patient", { pid: pid });
    }
}
