import { useContext, useEffect, useState } from "react"
import { NewVisitContext } from "../Model/NewVisitContext"
import { PatientContext } from "../Model/PatientContext"
import NewVisitModel from "../Model/NewVisitModel"
import HeaderPatient from "./HeaderPatient"
import NoContextModal from "./NoContextModal"
import { FormControl, Switch, InputLabel, Select, MenuItem } from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/it';
import { Link } from "react-router-dom"
import JointModel from "../Model/JointModel"
import EcographImages from "./EcographImages"
import GenerateImages from "../Model/GenerateImages"
import { Modal } from "react-bootstrap"



export default function JointPage2(props) {

    const { newVisit, setNewVisit } = useContext(NewVisitContext)
    const { selectedPatient } = useContext(PatientContext)

    const [joint, setJoint] = useState(new JointModel())
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [showModal, setShowModal] = useState(false)


    useEffect(() => {
        loadJoint();
        fetchPhotos()
    }, [])

    const fetchPhotos = async () => {
        let arr = await GenerateImages()
        setPhotos(arr);
    };

    const checkPresence = (s) => {
        for (let i = 0; i < newVisit.joints.length; i++) {
            if (newVisit.joints[i].jointName == s) {
                return true
            }
        }
        return false
    }

    const end = () => {
        if (checkPresence(joint.jointName)) {
            newVisit.deleteJoint(joint.jointName)
        }
        newVisit.addJoint(joint)
        newVisit.setCurrentJoint('')
        setNewVisit(newVisit)
    }

    const loadJoint = () => {
        let j = newVisit.getJoint(newVisit.currentJoint)
        setJoint(j)
    }

    const openModal = (e) => {
        let index = Number(e.target.alt.substring(e.target.alt.length - 1, e.target.alt.length))
        console.log(photos[index])

        setCurrentPhotoIndex(index);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (selectedPatient !== null) ? (
        <div>
            <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1%' }}>
                <HeaderPatient />
            </div>
            <div className="box-bianco" style={style.box}>
                <div>
                    <h2>{joint.jointName}</h2>
                </div>

                <div style={style.horizontalLine}>

                </div>


                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '50%', }}>
                    <div style={{ width: '60%', height: '100%' }}>
                        <div >
                            <label style={{ fontSize: 25 }}>pippo</label>
                            <Switch />
                        </div>
                        <div >
                            <label style={{ fontSize: 25 }}>ciao</label>
                            <Switch />
                        </div >

                    </div>
                    {/* <div >
                        <label style={{ fontSize: 25 }} >Data ultimo sanguinamento:</label>
                        <br />
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it'>
                            <DatePicker />
                        </LocalizationProvider >
                    </div> */}
                </div>


                <div style={{ display: 'flex', marginBottom: '1.5%', justifyContent: 'space-between', width: '95%' }}>
                    <div>
                        <Link to={'/visit/newVisitInPresence/jointSelection/joint'} class="btn btn-warning btn-lg">Indietro</Link>
                    </div>
                    <div>
                        <Link to={'/visit/newVisitInPresence/jointSelection'} style={style.forwardButton} class="btn btn-success btn-lg" onClick={end}>Fine</Link>
                    </div>
                </div>
            </div>
            <Modal size="xl" show={showModal} onHide={closeModal} centered >
                <Modal.Body>
                    <img src={photos[currentPhotoIndex] != undefined ? photos[currentPhotoIndex].link : null} alt={`Photo ${currentPhotoIndex}`} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                </Modal.Body>
            </Modal>
        </div>
    )
        :
        (
            <NoContextModal what={" un paziente "} service={" nuova articolazione "} />
        )
}


const style = {
    buttons: {
        width: '47%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'right',
        justifyContent: 'space-around',
        marginBottom: '5%',
        border: '1px solid black',
        borderRadius: '20px',
        padding: '4%'
    },


    box: {
        width: '98%',
        height: '80vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1%',
        paddingTop: '0.5%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    horizontalLine: {
        height: 1,
        backgroundColor: 'grey',
        width: '60%',
        borderRadius: 15,
        margin: 0,

    }
}


