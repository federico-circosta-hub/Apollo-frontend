import NavDropdown from 'react-bootstrap/NavDropdown';
import format from 'date-fns/format';
import { useContext, useState } from 'react';
import padlock from '../../img/icon/padlock.png'
import heartbeat from '../../img/icon/heartbeat.png'
import joints from '../../img/icon/joints.png'
import { PatientContext } from '../../Model/PatientContext';
import { NewVisitContext } from '../../Model/NewVisitContext';
import { CurrentJointContext } from '../../Model/CurrentJointContext';
import StopPatientProcessModal from '../Modals/StopPatientProcessModal';

export default function Header(props) {

    const { selectedPatient } = useContext(PatientContext);
    const { newVisit } = useContext(NewVisitContext);
    const { currentJoint, setCurrentJoint } = useContext(CurrentJointContext)

    const [showModal, setShowModal] = useState(false)

    const joint = () => {
        console.log(currentJoint)
        return (
            (currentJoint != null && currentJoint != '') ? <h5><img src={joints} width={30} style={{ marginRight: 5 }} />{currentJoint}</h5> : ''
        )
    }

    return (<>
        <nav class="navbar bg-body-tertiary" >
            <div class="container-fluid" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    {selectedPatient != null && <button class="btn btn-primary" onClick={() => setShowModal(true)}> {"< Esci"} </button>}
                </div>
                <div style={{ display: 'flex' }}>
                    {selectedPatient != null ? (<h6><img src={heartbeat} width={30} style={{ marginRight: 5 }} />{selectedPatient.name + " " + selectedPatient.surname + " " + format(selectedPatient.birthdate, '(dd/MM/y)')}</h6>) : ""}
                    {joint()}
                </div>
                <div style={{ display: 'flex' }}>
                    <img src={padlock} width={30} style={{ marginRight: 5 }} />
                    <NavDropdown
                        title={props.data}

                    >
                        <button onClick={props.logout} style={{ margin: 'auto' }} class="btn btn-danger">
                            Logout
                        </button>
                    </NavDropdown>
                </div>
            </div>
        </nav >
        <StopPatientProcessModal show={{ showModal, setShowModal }} />
    </>
    )
}