import DeanonymizedCC from "../../common/Model/Communication/DeanonymizedCommunicationController";

export default class PatientModel {
  name;
  surname;
  CF;
  birthdate;
  gender;
  height;
  weight;
  prothesis;

  constructor(name, surname, CF, birthdate, gender, height, weight, prothesis) {
    this.name = name;
    this.surname = surname;
    this.CF = CF;
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

  setCF(s) {
    this.CF = s;
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
      this.CF,
      this.birthdate,
      this.gender,
      this.height,
      this.weight,
      this.prothesis
    );
  }

  async register() {
    let params = {
      name: this.name,
      surname: this.surname,
      birthdate: this.birthdate,
      gender: this.gender,
      height: this.height,
      weight: this.weight,
      cf: this.CF,
    };
    console.log(params);
    await DeanonymizedCC.post("patient", params);
  }
}
