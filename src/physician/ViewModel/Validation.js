export const validateForm = (formName, formData, formData2) => {
  let errors = [];
  switch (formName) {
    case "newPatient":
      if (formData.name.trim().length < 2) {
        errors.name = "Insert valid name";
      }
      if (formData.surname.trim().length < 2) {
        errors.surname = "Insert valid surname";
      }
      if (formData.birthdate == "") {
        errors.birthdate = "Insert valid birthdate";
      }
      return errors;
    case "newVisit":
      if (formData.physicalActivity.physicalActivity) {
        if (formData.physicalActivity.physicalActivityDate == "") {
          errors.physicalActivityDate = "Inserisci data attività fisica";
        }
        if (formData.physicalActivity.physicalActivityType == "") {
          errors.physicalActivityType = "Inserisci tipo di attività fisica";
        }
      }
      if (formData.traumaticEvent.traumaticEvent != "") {
        if (formData.traumaticEvent.traumaticEventDate == "") {
          errors.traumaticEvent = "Inserisci data evento traumatico";
        }
      }
      if (formData.visitDate == null) {
        errors.visitDate = "Inserisci data della visita";
      }
      return errors;
    case "drugs":
      if (formData.needFollowUp.needFollowUp) {
        if (formData.needFollowUp.followUpDate == "") {
          errors.needFollowUp = "Insert follow up date";
        }
      }
      if (formData.prophylacticDrug.drug != "") {
        if (formData.prophylacticDrug.unit == "") {
          errors.prophylacticDrugUnit = "Insert prophylactic drug unit";
        }
        if (
          formData.prophylacticDrug.frequency < 1 ||
          formData.prophylacticDrug.frequency == ""
        ) {
          errors.prophylacticDrugFreq =
            "Insert valid prophylactic drug frequency";
        }
        if (formData.prophylacticDrug.dose < 1) {
          errors.prophylacticDrugDose = "Insert valid prophylactic drug dose";
        }
      }
      if (formData.acuteDrug.drug != "") {
        if (formData.acuteDrug.unit < 1) {
          errors.acuteDrugUnit = "Insert acute drug unit";
        }
        if (formData.acuteDrug.dose < 1) {
          errors.acuteDrugDose = "Insert valid acute drug dose";
        }
      }
      return errors;
    case "jointVisit":
      if (
        (formData.distension == "Moderate" ||
          formData.distension == "Severe") &&
        (formData.distensionCause == undefined ||
          formData.distensionCause == "")
      ) {
        errors.distension = "Inserisci una causa per la distensione";
      }
      if (
        formData2.ecographies.find(
          (el) => el.jointRef === formData.jointName
        ) === undefined
      ) {
        errors.images = `Selezionare almeno un'immagine dell'articolazione`;
      }
      return errors;
  }
};
