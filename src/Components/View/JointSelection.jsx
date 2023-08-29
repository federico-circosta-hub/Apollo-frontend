import { useState, useContext, useEffect } from "react"
import male from '../img/male.png'
import "react-day-picker/dist/style.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import HeaderPatient from "./HeaderPatient";
import { Button, Modal } from "react-bootstrap";
import JointModel from "../Model/JointModel";
import { NewVisitContext } from "../Model/NewVisitContext";
import EcographModal from "./EcographModal";
import EndingJointModal from "./EndingJointModal";
import JointSelectionButtonVisualizer from "../ViewModel/JointSelectionButtonVisualizer";


export default function JointSelection() {

    const { newVisit, setNewVisit } = useContext(NewVisitContext)

    const [showModal, setShowModal] = useState(false)
    const [showEndingModal, setShowEndingModal] = useState(false)

    const navigate = useNavigate()

    const handleJoint = (s, b) => {
        newVisit.setCurrentJoint(s)
        setNewVisit(newVisit)
        console.log(newVisit)
        if (b) {
            navigate('/visit/newVisitInPresence/jointSelection/joint')
        } else {
            setShowModal(true)
        }
    }

    return (
        <div>
            <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1%' }}>
                <HeaderPatient />
            </div>
            <div className="box-bianco" style={style.box}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'left', padding: '1%' }}>
                    <div >
                        <h2 >Seleziona l'articolazione da visitare: </h2>
                    </div>

                </div>

                <div className="fascia centrale" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    textAlign: 'center',
                    margin: '1.5%'
                }}>

                    <div style={style.protLeft} >
                        <div >
                            <JointSelectionButtonVisualizer click={(alreadySeen) => handleJoint('Gom dx', alreadySeen)} name={'Gom dx'} />
                        </div>
                        <div  >
                            <JointSelectionButtonVisualizer click={() => handleJoint('Gin dx')} name={'Gin dx'} />
                        </div>
                        <div >
                            <JointSelectionButtonVisualizer click={() => handleJoint('Cav dx')} name={'Cav dx'} />
                        </div>
                    </div>

                    <div style={{ width: '33%' }}>
                        <img src={male} alt="male human silhouette" style={{ width: '100%', position: 'relative', margin: 'auto' }} />
                    </div>
                    <div style={style.prot}>

                        <div >
                            <JointSelectionButtonVisualizer click={() => handleJoint('Gom sx')} name={'Gom sx'} />
                        </div>
                        <div >
                            <JointSelectionButtonVisualizer click={() => handleJoint('Gin sx')} name={'Gin sx'} />
                        </div>
                        <div >
                            <JointSelectionButtonVisualizer click={() => handleJoint('Cav sx')} name={'Cav sx'} />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', marginBottom: '1.5%', justifyContent: 'space-between', width: '95%' }}>
                    <div >
                        <Link class="btn btn-danger btn-lg" to={'/visit/newVisitInPresence/'} >Indietro</Link>
                    </div>
                    <div >
                        <button class="btn btn-warning btn-lg" onClick={() => setShowEndingModal(true)} >Avvia conclusione visita</button>
                    </div>
                </div>


            </div>
            <EndingJointModal objectData={newVisit} show={{ showEndingModal, setShowEndingModal }} />
            <EcographModal setShowModal={setShowModal} showModal={showModal} />
        </div>
    )
}

const style = {

    prot: {
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: '22%',
    },
    protLeft: {
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: '22%',
    },
    box: {
        justifyContent: 'space-between',
        width: '90%',
        height: '80vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '2%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    forwardButton: {
        justifyContent: 'right',
        display: 'flex',
        marginRight: '1%',
        marginBottom: '1%',
        marginLeft: 'auto',
        alignItems: 'right'
    }
}
