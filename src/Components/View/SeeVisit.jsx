import { useContext, useState, useEffect } from "react"
import { VisitContext } from "../Model/VisitContext"
import { format, } from 'date-fns';
import itLocale from 'date-fns/locale/it';
import en from 'date-fns/locale/en-US';
import NoContextModal from "./NoContextModal";
import VisitObjectGenerator from './../Model/VisitObjectGenerator'
import { useNavigate } from "react-router-dom";
import HeaderPatient from "./HeaderPatient";

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

            <p>Index Joint: {jointToDisplay.indexJoint ? 'Yes' : 'No'}</p>
            <p>Difficulty: {jointToDisplay.jointDifficulty ? 'Yes' : 'No'}</p>
            <p>Pain: {jointToDisplay.pain ? 'Yes' : 'No'}</p>
            <p>Last bleed: {jointToDisplay.lastBleed.toDateString()}</p>
            <p>Synovitis: {jointToDisplay.synovitis}</p>
            <p>Cartilage: {jointToDisplay.articularCartilage}</p>
            <p>Subchondral bone: {jointToDisplay.subchondralBone}</p>
            <p>Distension: {jointToDisplay.distension}</p>
            <p>Distension cause: {jointToDisplay.distensionCause}</p>
            <p>Images:</p>
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
                    <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1%' }}>
                        <HeaderPatient />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={style.box}>
                            <div style={{ display: 'flex', justifyContent: 'center', background: '#2f4f4f', width: '100%', height: '10vh', alignItems: 'center' }}>
                                <h2 style={{ color: 'white' }}>General info</h2>
                            </div>
                            <div style={style.horizontalLine}>

                            </div>
                            <div style={{ overflow: 'auto', width: '90%', textAlign: 'center', height: '80vh' }}>

                                <div style={{ textAlign: 'center', width: '100%' }}>
                                    <h3>Visit date: {format(selectedVisit, 'd MMMM y', { locale: en })}</h3>
                                    <br />
                                    <br />
                                    <br />
                                    <h3>Phisical activity</h3>
                                    <p>Physical activity: {visit.physicalActivity.physicalActivity ? 'Yes' : 'No'}</p>
                                    <p>Physical activity type: {visit.physicalActivity.physicalActivity ? visit.physicalActivity.physicalActivityType : '/'}</p>
                                    <p>Physical activity date: {visit.physicalActivity.physicalActivity ? visit.physicalActivity.physicalActivityDate.toDateString() : '/'}</p>
                                    <br />
                                    <br />
                                    <br />
                                    <h3>Traumatic event</h3>
                                    <p>Traumatic event type: {visit.traumaticEvent.traumaticEvent}</p>
                                    <p>Traumatic event date: {visit.traumaticEvent.traumaticEvent != 'Nessuno' ? visit.traumaticEvent.traumaticEventDate.toDateString() : '/'}</p>
                                    <br />
                                    <br />
                                    <br />

                                    <h3>Follow-Up</h3>
                                    <p>Follow-Up: {visit.followUp.followUp ? 'Yes' : 'No'}</p>
                                    <p>Treatment response: {visit.followUp.followUp ? visit.followUp.treatmentResponse : '/'}</p>
                                    <p>Previous visit: {visit.followUp.followUp ? visit.followUp.lastVisit.toDateString() : '/'}</p>
                                    <br />
                                    <br />
                                    <br />
                                    <h3>Follow-Up Needed</h3>
                                    <p>Follow-Up Needed: {visit.needFollowUp.needFollowUp ? 'Yes' : 'No'}</p>
                                    <p>Follow-up date: {visit.needFollowUp.needFollowUp ? visit.needFollowUp.followUpDate.toDateString() : '/'}</p>

                                    <br />
                                    <br />
                                    <br />
                                    <h3>Prophylactic drug</h3>
                                    <p>Drug name: {visit.prophylacticDrug.drug}</p>
                                    <p>Dose: {visit.prophylacticDrug.drug != 'None' ? visit.prophylacticDrug.dose : '/'}</p>
                                    <p>Frequency: {visit.prophylacticDrug.drug != 'None' ? visit.prophylacticDrug.frequency : '/'}</p>
                                    <br />
                                    <br />
                                    <br />
                                    <h3>Acute drug</h3>
                                    <p>Drug name: {visit.acuteDrug.drug}</p>
                                    <p>Dose: {visit.acuteDrug.drug != 'None' ? visit.acuteDrug.dose : '/'}</p>
                                </div>
                            </div>
                            <div style={{ height: 1, background: 'black', width: '30%', margin: 5 }}>

                            </div>
                            <button style={{ margin: 5 }} className="btn btn-danger btn-lg" onClick={() => { navigate(-1) }} >Back</button>
                        </div>
                        <div style={style.centralBox}>
                            <div style={{ display: 'flex', justifyContent: 'center', background: '#2f4f4f', width: '100%', height: '8.5vh', alignItems: 'center' }}>
                                <h2 style={{ color: "white" }}>Joints</h2>
                            </div>
                            <div style={style.horizontalLine}>

                            </div>
                            {visit.joints.map((item, index) => (
                                <div style={{ width: '100%', textAlign: 'center', padding: '2.5vh', background: selectedJoint == item.jointName ? '#1e90ff' : 'white', }} >
                                    <button onClick={() => selectedJoint != item.jointName ? setSelectedJoint(item.jointName) : setSelectedJoint(null)} className={selectedJoint != item.jointName ? "btn btn-lg btn-primary" : "btn btn-lg btn-light"} key={index}>{item.jointName}</button>
                                </div>
                            ))}

                        </div>

                        <div style={style.box}>
                            <div style={{ display: 'flex', justifyContent: 'center', background: selectedJoint != null ? '#1e90ff' : '#2f4f4f', width: '100%', height: '10vh', alignItems: 'center' }}>
                                <h2 style={{ color: "white" }} >Joint info</h2>
                            </div>

                            <div style={style.horizontalLine}>

                            </div>
                            <div style={{ overflow: 'auto', width: '90%', textAlign: 'center', height: '80vh' }}>
                                {selectedJoint != null && jointInfo()}
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
        height: '83vh',
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
        height: '83vh',
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




