import { useState, useContext } from "react"
import male from '../../img/male.png'
import "react-day-picker/dist/style.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { NewVisitContext } from "../../Model/NewVisitContext";
import EndingJointModal from "../Modals/EndingJointModal";
import JointSelectionButtonVisualizer from "../../ViewModel/JointSelectionButtonVisualizer";
import { CurrentJointContext } from "../../Model/CurrentJointContext";


export default function JointSelection() {

    const { newVisit, setNewVisit } = useContext(NewVisitContext)
    const { setCurrentJoint } = useContext(CurrentJointContext)

    const [showEndingModal, setShowEndingModal] = useState(false)

    const navigate = useNavigate()

    const handleJoint = (s) => {
        newVisit.setCurrentJoint(s)
        setNewVisit(newVisit)
        setCurrentJoint(s)
        navigate('/newVisit/jointSelection/joint')
    }

    return (
        <div>
            <div className="box-bianco" style={style.box}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'left', padding: '1%' }}>
                    <div >
                        <h3 >Seleziona l'articolazione da visitare: </h3>
                    </div>

                </div>

                <div className="fascia centrale" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    textAlign: 'center',
                    margin: '1%'
                }}>

                    <div style={style.protLeft} >
                        <div >
                            <JointSelectionButtonVisualizer click={() => { handleJoint('Gomito dx') }} name={'Gomito dx'} />
                        </div>
                        <div  >
                            <JointSelectionButtonVisualizer click={() => handleJoint('Ginocchio dx',)} name={'Ginocchio dx'} />
                        </div>
                        <div >
                            <JointSelectionButtonVisualizer click={() => handleJoint('Caviglia dx',)} name={'Caviglia dx'} />
                        </div>
                    </div>

                    <div style={{ width: '35%' }}>
                        <img src={male} alt="male human silhouette" style={{ maxWidth: '100%', maxHeight: '110vh', position: 'relative', margin: 'auto' }} />
                    </div>
                    <div style={style.prot}>

                        <div >
                            <JointSelectionButtonVisualizer click={() => handleJoint('Gomito sx',)} name={'Gomito sx'} />
                        </div>
                        <div >
                            <JointSelectionButtonVisualizer click={() => handleJoint('Ginocchio sx',)} name={'Ginocchio sx'} />
                        </div>
                        <div >
                            <JointSelectionButtonVisualizer click={() => handleJoint('Caviglia sx',)} name={'Caviglia sx'} />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', marginBottom: '1.5%', justifyContent: 'space-between', width: '95%' }}>
                    <div >
                        <Link class="btn btn-danger btn-lg" to={'/newVisit/'} >Back</Link>
                    </div>
                    <div >
                        <button class="btn btn-warning btn-lg" onClick={() => setShowEndingModal(true)} >Visit conclusion</button>
                    </div>
                </div>
            </div>
            <EndingJointModal objectData={newVisit} show={{ showEndingModal, setShowEndingModal }} />
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
        width: '95%',
        height: '90vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1.5%',
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
