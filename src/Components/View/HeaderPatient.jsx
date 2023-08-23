import { PatientContext } from '../Model/PatientContext';
import { useContext } from 'react';
import { format, } from 'date-fns';
import { Link } from 'react-router-dom';

export default function HeaderPatient() {

    const { selectedPatient, setSelectedPatient } = useContext(PatientContext);


    return (
        <div style={{ width: '30%', background: 'white', textAlign: 'center', borderRadius: 15, alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
            <div style={{ alignItems: 'center', margin: 'auto' }} >
                <h5>{selectedPatient.name} {selectedPatient.surname} — {format(selectedPatient.birthdate, 'dd-MM-y')}</h5>

            </div>
            <div>
                <Link to={'/'} onClick={() => setSelectedPatient()} class="btn btn-danger ">X</Link>
            </div>
        </div>
    )
}