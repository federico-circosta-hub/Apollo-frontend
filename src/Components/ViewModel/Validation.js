export const validateForm = (formName, formData) => {
    let errors = []
    switch (formName) {
        case 'newPatient':
            if (formData.name.trim().length < 2) {
                errors.name = 'Insert valid name'
            }
            if (formData.surname.trim().length < 2) {
                errors.surname = 'Insert valid surname'
            }
            if (formData.birthdate == '') {
                errors.birthdate = 'Insert valid birthdate'
            }
            return errors
        case 'newVisit':
            if (formData.physicalActivity.physicalActivity) {
                if (formData.physicalActivity.physicalActivityDate == '') {
                    errors.physicalActivityDate = 'Insert physical activity date'
                }
                if (formData.physicalActivity.physicalActivityType == '') {
                    errors.physicalActivityType = 'Insert physical activity type'
                }
            }
            if (formData.traumaticEvent.traumaticEvent != 'None') {
                if (formData.traumaticEvent.traumaticEventDate == '') {
                    errors.traumaticEvent = 'Insert traumatic event date'
                }
            }
            return errors
        case 'drugs':
            if (formData.needFollowUp.needFollowUp) {
                if (formData.needFollowUp.followUpDate == '') {
                    errors.needFollowUp = 'Insert follow up date'
                }
            }
            if (formData.prophylacticDrug.drug != 'None') {
                if (formData.prophylacticDrug.unit == '') {
                    errors.prophylacticDrugUnit = 'Insert prophylactic drug unit'
                }
                if (formData.prophylacticDrug.frequency < 1 || formData.prophylacticDrug.frequency == '') {
                    errors.prophylacticDrugFreq = 'Insert valid prophylactic drug frequency'
                }
                if (formData.prophylacticDrug.dose < 1) {
                    errors.prophylacticDrugDose = 'Insert valid prophylactic drug dose'
                }
            }
            if (formData.acuteDrug.drug != 'None') {
                if (formData.acuteDrug.unit < 1) {
                    errors.acuteDrugUnit = 'Insert acute drug unit'
                }
                if (formData.acuteDrug.dose < 1) {
                    errors.acuteDrugDose = 'Insert valid acute drug dose'
                }

            }
            return errors
    }
};