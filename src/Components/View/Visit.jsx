import { Link } from 'react-router-dom';
import scientist from '../img/scientist.jpeg';
import newFile from '../img/icon/new-file.png'
import folder from '../img/icon/folder.png'
import newEvent from '../img/icon/add-event.png'
import HeaderPatient from './HeaderPatient';
import { useContext } from 'react';
import { PatientContext } from '../Model/PatientContext';
import NoContextModal from './NoContextModal';

export default function Visit() {

    const { selectedPatient } = useContext(PatientContext)

    return (selectedPatient !== null) ? (
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: '1%', justifyContent: 'space-between' }}>
            <HeaderPatient />
            <div style={styles.mask}>
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '15px',
                        margin: 'auto',
                        opacity: 0.2,
                        backgroundImage: `url(${scientist})`,
                        backgroundSize: 'cover',
                    }}
                ></div>
                <div style={styles.buttonsDiv}>
                    <Link to={'/visit/searchVisit'} className="btn btn-primary btn-lg" style={styles.button}>
                        <label style={styles.label}>Consulta visite passate <img src={folder} alt="search" width={50} style={{ filter: `invert(100%)` }} /></label>
                    </Link>

                    <Link to={'/visit/newVisitInPresence'} className="btn btn-primary btn-lg" style={styles.button}>
                        <label style={styles.label}>Nuova visita <img src={newFile} alt="search" width={50} style={{ filter: `invert(100%)` }} /></label>
                    </Link>

                    <Link to={'/visit/newVisitPast'} className="btn btn-primary btn-lg" style={styles.button}>
                        <label style={styles.label}>Inserisci visita passata <img src={newEvent} alt="search" width={50} style={{ filter: `invert(100%)` }} /></label>
                    </Link>
                </div>
            </div>
        </div>
    )
        :
        (<div style={{ width: '100%', height: '80vh' }}>
            <NoContextModal what={" un paziente "} service={" visita"} />
        </div>
        )
}

const styles = {
    label:
    {
        fontSize: 32
    },
    button: {
        minWidth: '60%',
        textAlign: 'center',
    },
    buttonsDiv: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 'auto',
        height: '70%',
        width: '60%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },

    mask: {
        width: '75%',
        height: '75vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1%',
        position: 'relative',
    },
};
