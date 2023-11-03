import format from "date-fns/format";
import JointToSendModel from "./JointToSendModel";

export default class NewVisitToSend {
  //id;
  patient; //string
  physician; //number
  date; //data string
  type; // live | remote | expost
  follows; // id della visita seguita da questa
  report = {
    /* date: visitDate, // string | undefined	(maggiore o uguale alla data della visita, se non definito viene salvata quella della visita) */
    trauma_event: "trauma_event", // string | undefined	(se non esiste e non date_trauma non è undefined lo crea)
    date_trauma: "date_trauma", // string | undefined (solo se trauma_event !== undefined)
    exercise: "exercise", // string | undefined	(se non esiste e non date_exercise non è undefined lo crea)
    date_exercise: "date_exercise", // string | undefined (solo se exercise !== undefined)
    treatment_response: "treatment_response", // number | undefined
    prophylaxis_drug: "prophylaxis_drug", // string | undefined
    prophylaxis_frequency: "prophylaxis_frequency", //number | undefined (solo se prophylaxis_drug !== undefined)
    prophylaxis_dose: "prophylaxis_dose", // number | undefined (solo se prophylaxis_drug !== undefined)
    acute_drug: "acute_drug", // string | undefined
    acute_dose: "acute_dose", // number | undefined	(solo se acute_drug !== undefined)
    joints: "joints",
  };

  constructor(newVisit) {
    //this.id = newVisit.visitId;
    this.patient = newVisit.patient;
    this.physician = newVisit.physician;
    this.date = format(newVisit.visitDate, "y-MM-dd");
    this.type = newVisit.isInPresence ? "live" : "expost";
    this.follows =
      newVisit.followUp.followUp && newVisit.previousVisit.id !== -1
        ? newVisit.previousVisit.id
        : undefined;
    this.report.trauma_event =
      newVisit.traumaticEvent.traumaticEvent === "Nessuno"
        ? undefined
        : newVisit.traumaticEvent.traumaticEvent;
    this.report.date_trauma =
      newVisit.traumaticEvent.traumaticEvent === "Nessuno"
        ? undefined
        : newVisit.traumaticEvent.traumaticEventDate;
    this.report.exercise = !newVisit.physicalActivity.physicalActivity
      ? undefined
      : newVisit.physicalActivity.physicalActivityType;
    this.report.date_exercise = !newVisit.physicalActivity.physicalActivity
      ? undefined
      : newVisit.physicalActivity.physicalActivityDate;
    this.report.treatment_response = !newVisit.followUp.followUp
      ? undefined
      : newVisit.followUp.treatmentResponse;
    this.report.prophylaxis_drug =
      newVisit.prophylacticDrug.drug.name === "Nessuno" ||
      newVisit.prophylacticDrug.drug.name === ""
        ? undefined
        : newVisit.prophylacticDrug.drug.name;
    this.report.prophylaxis_dose =
      newVisit.prophylacticDrug.drug.name === "Nessuno" ||
      newVisit.prophylacticDrug.drug.name === ""
        ? undefined
        : newVisit.prophylacticDrug.dose;
    this.report.prophylaxis_frequency =
      newVisit.prophylacticDrug.drug.name === "Nessuno" ||
      newVisit.prophylacticDrug.drug.name === ""
        ? undefined
        : newVisit.prophylacticDrug.frequency;
    this.report.acute_drug =
      newVisit.acuteDrug.drug.name === "Nessuno" ||
      newVisit.acuteDrug.drug.name === ""
        ? undefined
        : newVisit.acuteDrug.drug.name;
    this.report.acute_dose =
      (newVisit.acuteDrug.drug.name === "Nessuno") |
      (newVisit.acuteDrug.drug.name === "")
        ? undefined
        : newVisit.acuteDrug.dose;
    this.report.joints = [];
  }

  setJoints(newVisit) {
    if (newVisit.joints.length === 0) return;
    let joints = [];
    newVisit.joints.forEach((element) => {
      let jointToSend = new JointToSendModel(element);
      jointToSend.setMediaIds(newVisit);
      joints.push(jointToSend);
    });
    this.report.joints = joints;
  }
}
