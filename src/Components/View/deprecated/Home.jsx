import { Link } from 'react-router-dom';
import back from '../img/stetoscopio.jpeg';
import search from '../img/icon/search.png'
import add from '../img/icon/add-user.png'

export default function Home() {
    return (
        <div style={styles.mask}>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '15px',
                    margin: 'auto',
                    opacity: 0.2,
                    backgroundImage: `url(${back})`,
                    backgroundSize: 'cover',
                }}
            ></div>
            <div style={styles.buttonsDiv}>
                <Link to={'/searchPatient'} className="btn btn-primary btn-lg" style={styles.button}>
                    <label style={styles.label}>Ricerca paziente <img src={search} alt="search" width={40} style={{ filter: `invert(100%)` }} /></label>
                </Link>
                <br />
                <br />
                <br />
                <br />
                <Link to={'/newPatient'} className="btn btn-primary btn-lg" style={styles.button}>
                    <label style={styles.label}>Nuovo Paziente <img src={add} alt="search" width={40} style={{ filter: `invert(100%)` }} /></label>
                </Link>
            </div>
        </div>
    );
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
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        height: '50%',
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
        marginTop: '2%',
        position: 'relative',
    },
};
