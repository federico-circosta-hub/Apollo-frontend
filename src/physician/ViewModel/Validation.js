export const validateForm = (formName, formData, formData2) => {
  let errors = [];
  switch (formName) {
    case "newPatient":
      if (formData.name.trim().length < 2) {
        errors.name = "Insere nome valido";
      }
      if (formData.surname.trim().length < 2) {
        errors.surname = "Inserire cognome valido";
      }
      if (formData.birthdate == "") {
        errors.birthdate = "Inserire data di nascita valida";
      }
      return errors;
    case "newVisit":
      if (formData.physicalActivity.physicalActivity) {
        if (formData.physicalActivity.physicalActivityDate == "") {
          errors.physicalActivityDate = "Inserire data attività fisica";
        }
        if (formData.physicalActivity.physicalActivityType == "") {
          errors.physicalActivityType = "Inserire tipo di attività fisica";
        }
      }
      if (formData.traumaticEvent.traumaticEvent !== "Nessuno") {
        if (formData.traumaticEvent.traumaticEventDate === "") {
          errors.traumaticEvent = "Inserire data evento traumatico";
        }
      }
      if (formData.visitDate == null) {
        errors.visitDate = "Inserire data della visita";
      }
      return errors;
    case "drugs":
      if (formData.needFollowUp.needFollowUp) {
        if (formData.needFollowUp.followUpDate == "") {
          errors.needFollowUp = "Inserire data di follow-up";
        }
      }
      if (
        formData.prophylacticDrug.drug.name !== "Nessuno" &&
        formData.prophylacticDrug.drug.name !== ""
      ) {
        if (
          formData.prophylacticDrug.frequency < 1 ||
          formData.prophylacticDrug.frequency == ""
        ) {
          errors.prophylacticDrugFreq =
            "Inserire frequenza medicinale di profilassi valida";
        }
        if (formData.prophylacticDrug.dose < 1) {
          errors.prophylacticDrugDose =
            "Inserire dose medicinale di profilassi valida";
        }
      }
      if (
        formData.acuteDrug.drug.name !== "Nessuno" &&
        formData.acuteDrug.drug.name !== ""
      ) {
        if (formData.acuteDrug.dose < 1) {
          errors.acuteDrugDose = "Inserire dose medicinale acuto valida";
        }
      }
      return errors;
    case "jointVisit":
      if (
        (formData.distension == "minor" || formData.distension == "severe") &&
        (formData.distensionCause == undefined ||
          formData.distensionCause == "")
      ) {
        errors.distension = "Inserire una causa per la distensione";
      }
      /*       if (
        formData2.ecographies.find(
          (el) => el.jointRef === formData.jointName
        ) === undefined
      ) {
        errors.images = `Selezionare almeno un'immagine dell'articolazione`;
      } */
      return errors;
  }
};
