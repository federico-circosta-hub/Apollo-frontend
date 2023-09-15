import { useContext, useState, useEffect } from "react"
import { VisitContext } from "../../Model/VisitContext"
import { format, } from 'date-fns';
import it from 'date-fns/locale/it';
import NoContextModal from "../Modals/NoContextModal";
import VisitObjectGenerator from '../../Model/VisitObjectGenerator'
import { useNavigate } from "react-router-dom";

export default function SeeVisit() {

    const { selectedVisit } = useContext(VisitContext)
    const [visit, setVisitObject] = useState()

    const [selectedJoint, setSelectedJoint] = useState(null)

    useEffect(() => {
        loadVisit()
    }, [])


    const loadVisit = async () => {
        const visitGenerator = new VisitObjectGenerator();
        let joints = ['Right knee', 'Left knee', 'Left elbow', 'Right elbow', 'Left ankle', 'Right ankle']
        let count = Math.floor(Math.random() * 6)
        while (count == 0) { count = Math.floor(Math.random() * 6) }
        for (let i = 0; i < count; i++) {
            await visitGenerator.addJoint(joints[i])

        }
        setVisitObject(visitGenerator.generateVisitObject())
    }

    const jointInfo = () => {
        let jointToDisplay = visit.joints.find((item) => item.jointName == selectedJoint)
        return (<>
            <h4>{jointToDisplay.jointName}</h4>

            <p>Index Joint: {jointToDisplay.indexJoint ? 'Sì' : 'No'}</p>
            <p>Difficoltà di movimento: {jointToDisplay.jointDifficulty ? 'Yes' : 'No'}</p>
            <p>Dolore: {jointToDisplay.pain ? 'Sì' : 'No'}</p>
            <p>Ultimo sanguinamento: {jointToDisplay.lastBleed.toDateString()}</p>
            <p>Sinovite: {jointToDisplay.synovitis}</p>
            <p>Cartilagine: {jointToDisplay.articularCartilage}</p>
            <p>Osso subcondrale: {jointToDisplay.subchondralBone}</p>
            <p>Distension: {jointToDisplay.distension}</p>
            <p>Distension cause: {jointToDisplay.distensionCause}</p>
            <p>Ecografie:</p>
            {jointToDisplay.selectedImages.map((item, index) =>
                <img key={index} src={item.link} style={{ width: '100%', margin: 5 }} />
            )}

        </>
        )
    }

    const navigate = useNavigate()

    if (selectedVisit !== null) {
        if (visit == null) {
            return (
                <h3>Loading...</h3>
            )
        } else {
            return (
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={style.box}>
                            <div style={{ display: 'flex', justifyContent: 'center', background: '#2f4f4f', width: '100%', height: '10vh', alignItems: 'center', marginBottom: 20 }}>
                                <h2 style={{ color: 'white' }}>Dettagli visita</h2>
                            </div>
                            <div style={{ overflow: 'auto', width: '90%', textAlign: 'center', height: '80vh', border: '1px solid gray', padding: '1.5%', borderRadius: 15 }}>

                                <div style={{ textAlign: 'left', width: '100%', }}>
                                    <h3>Data visita: {format(selectedVisit, 'd MMMM y', { locale: it })}</h3>
                                    <br />
                                    <br />

                                    <h3>Attività fisica</h3>
                                    <p>Attività fisicay: {visit.physicalActivity.physicalActivity ? 'Sì' : 'No'}</p>
                                    <p>Tipo attività fisica: {visit.physicalActivity.physicalActivity ? visit.physicalActivity.physicalActivityType : '/'}</p>
                                    <p>Data attività fisica: {visit.physicalActivity.physicalActivity ? visit.physicalActivity.physicalActivityDate.toDateString() : '/'}</p>
                                    <br />
                                    <br />

                                    <h3>Evento traumatico</h3>
                                    <p>Tipo di evento traumatico: {visit.traumaticEvent.traumaticEvent}</p>
                                    <p>Data evento traumatico: {visit.traumaticEvent.traumaticEvent != 'Nessuno' ? visit.traumaticEvent.traumaticEventDate.toDateString() : '/'}</p>
                                    <br />
                                    <br />


                                    <h3>Follow-Up</h3>
                                    <p>Follow-Up: {visit.followUp.followUp ? 'Sì' : 'No'}</p>
                                    <p>Risposta al trattamento: {visit.followUp.followUp ? visit.followUp.treatmentResponse : '/'}</p>
                                    <p>Visita precedente: {visit.followUp.followUp ? visit.followUp.lastVisit.toDateString() : '/'}</p>
                                    <br />
                                    <br />

                                    <h3>Necessità di visita di Follow-Up</h3>
                                    <p>Necessità di visita di Follow-Up: {visit.needFollowUp.needFollowUp ? 'Sì' : 'No'}</p>
                                    <p>Data di visita di Follow-Up: {visit.needFollowUp.needFollowUp ? visit.needFollowUp.followUpDate.toDateString() : '/'}</p>


                                    <br />
                                    <br />
                                    <h3>Farmaco di profilassi</h3>
                                    <p>Nome farmaco: {visit.prophylacticDrug.drug}</p>
                                    <p>Dose: {visit.prophylacticDrug.drug != 'None' ? visit.prophylacticDrug.dose : '/'}</p>
                                    <p>Frequenza: {visit.prophylacticDrug.drug != 'None' ? visit.prophylacticDrug.frequency : '/'}</p>

                                    <br />
                                    <br />
                                    <h3>Farmaco acuto</h3>
                                    <p>Nome farmaco: {visit.acuteDrug.drug}</p>
                                    <p>Dose: {visit.acuteDrug.drug != 'None' ? visit.acuteDrug.dose : '/'}</p>
                                </div>
                            </div>

                            <button style={{ margin: 5 }} className="btn btn-danger btn-lg" onClick={() => { navigate(-1) }} >Back</button>
                        </div>
                        <div style={style.centralBox}>
                            <div style={{ display: 'flex', justifyContent: 'center', background: '#2f4f4f', width: '100%', height: '8.5vh', alignItems: 'center' }}>
                                <h2 style={{ color: "white" }}>Articolazioni visitate</h2>
                            </div>

                            {visit.joints.map((item, index) => (
                                <div style={{ width: '100%', textAlign: 'center', padding: '2.5vh', background: selectedJoint == item.jointName ? '#1e90ff' : 'white', }} >
                                    <button onClick={() => selectedJoint != item.jointName ? setSelectedJoint(item.jointName) : setSelectedJoint(null)} className={selectedJoint != item.jointName ? "btn btn-lg btn-primary" : "btn btn-lg btn-light"} key={index}>{item.jointName}</button>
                                </div>
                            ))}

                        </div>

                        <div style={style.box}>
                            <div style={{ display: 'flex', justifyContent: 'center', background: selectedJoint != null ? '#1e90ff' : '#2f4f4f', width: '100%', height: '10vh', alignItems: 'center', marginBottom: 20 }}>
                                <h2 style={{ color: "white" }} >Dettagli articolazione</h2>
                            </div>

                            <div style={{ overflow: 'auto', width: '90%', textAlign: 'center', height: '80vh', border: '1px solid gray', padding: '1.5%', borderRadius: 15 }}>
                                {selectedJoint != null ? jointInfo() : 'Selezionare una articolazione per vederne i dettagli'}
                            </div>

                        </div>


                    </div>

                </div >
            )
            {/* <div style={style.box}>
                    <div>
                        <h1>Visita: {format(selectedVisit, 'EEEEEE, d MMMM y', { locale: itLocale })}</h1>
                    </div>

                    <div>
                        <h3>Attività Fisica</h3>
                        <p>Fisica: {visit.physicalActivity.physicalActivity ? 'Sì' : 'No'}</p>
                        <p>Data dell'attività fisica: {visit.physicalActivity.physicalActivityDate.toDateString()}</p>
                        <p>Tipo di attività fisica: {visit.physicalActivity.physicalActivityType}</p>

                        
                        <h3>Evento Traumatico</h3>
                        <p>Tipo di evento traumatico: {visit.traumaticEvent.traumaticEvent}</p>
                        <p>Data dell'evento traumatico: {visit.traumaticEvent.traumaticEventDate.toDateString()}</p>

                        
                        <h3>Follow-Up</h3>
                        <p>Follow-Up: {visit.followUp.followUp ? 'Sì' : 'No'}</p>
                        <p>Risposta al trattamento: {visit.followUp.treatmentResponse}</p>
                        <p>Data dell'ultima visita: {visit.followUp.lastVisit.toDateString()}</p>

                        
                        <h3>Articolazioni</h3>
                        <ul>
                            {visit.joints.map((joint, index) => (
                                <li key={index}>
                                    <h4>Articolazione {joint.jointName}</h4>
                                    <p>Immagine selezionate: {joint.selectedImages.join(', ')}</p>
                                    <p>Index Joint: {joint.indexJoint ? 'Sì' : 'No'}</p>
                                    <p>Difficoltà articolazione: {joint.jointDifficulty ? 'Sì' : 'No'}</p>
                                    <p>Dolore: {joint.pain ? 'Sì' : 'No'}</p>
                                    <p>Data dell'ultima emorragia: {joint.lastBleed.toDateString()}</p>
                                    <p>Sinovite: {joint.synovitis}</p>
                                    <p>Stato della cartilagine: {joint.articularCartilage}</p>
                                    <p>Stato dell'osso subcondrale: {joint.subchondralBone}</p>
                                    <p>Distensione: {joint.distension}</p>
                                    <p>Causa della distensione: {joint.distensionCause}</p>
                                </li>
                            ))}
                        </ul>

                        
                        <h3>Follow-Up Necessario</h3>
                        <p>Follow-Up Necessario: {visit.needFollowUp.needFollowUp ? 'Sì' : 'No'}</p>
                        <p>Data del follow-up: {visit.needFollowUp.followUpDate.toDateString()}</p>

                        
                        <h3>Medicina Profilattica</h3>
                        <p>Nome della medicina: {visit.prophylacticDrug.drug}</p>
                        <p>Dose: {visit.prophylacticDrug.dose}</p>
                        <p>Frequenza: {visit.prophylacticDrug.frequency}</p>
                        <h3>Medicina Acuta</h3>
                        <p>Nome della medicina: {visit.acuteDrug.drug}</p>
                        <p>Dose: {visit.acuteDrug.dose}</p>

                    </div>
                    
                </div> */}

        }
    } else {
        return (
            <NoContextModal what={" paziente e relativa visita "} service={" visualizzazione visita passata"} />
        )
    }

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
        width: '40%',
        height: '90vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1.5%',
        display: 'flex',
        flexDirection: 'column',
        alignText: 'center',
        alignItems: 'center',
        paddingBottom: '2%',

        overflow: 'auto',
        justifyContent: 'start',
    },
    centralBox: {
        width: '13%',
        height: '90vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1.5%',
        display: 'flex',
        flexDirection: 'column',
        alignText: 'center',
        alignItems: 'center',
        paddingBottom: '2%',
        overflow: 'auto',
        justifyContent: 'start',
    },
    horizontalLine: {

        height: 1, background: 'black', width: '80%', margin: 5
    }

}




