export const validateForm = (formName, formData) => {
    let errors = []
    switch (formName) {
        case 'newPatient':
            if (formData.name.trim().length < 2) {
                errors.name = 'Inserire nome valido'
            }
            if (formData.surname.trim().length < 2) {
                errors.surname = 'Inserire cognome valido'
            }
            if (formData.birthdate == '') {
                errors.birthdate = 'Inserire data di nascita'
            }
            return errors
        case 'newVisit':
            if (formData.physicalActivity.physicalActivity) {
                if (formData.physicalActivity.physicalActivityDate == '') {
                    errors.physicalActivityDate = 'Inserire data attività fisica'
                }
                if (formData.physicalActivity.physicalActivityType == '') {
                    errors.physicalActivityType = 'Inserire tipo di attività fisica'
                }
            }
            if (formData.traumaticEvent.traumaticEvent != 'Nessuno') {
                if (formData.traumaticEvent.traumaticEventDate == '') {
                    errors.traumaticEvent = 'Inserire data evento traumatico'
                }
            }
            return errors
    }
};