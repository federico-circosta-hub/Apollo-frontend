import { useContext, useRef } from "react"
import { NewVisitContext } from "../../Model/NewVisitContext"
import { PatientContext } from "../../Model/PatientContext"
import { Link } from "react-router-dom"
import 'dayjs/locale/it';
import MyDocument from "../../ViewModel/PdfCreator"
import { useReactToPrint } from 'react-to-print';

export default function EndVisit() {

    const { newVisit, setNewVisit } = useContext(NewVisitContext)
    const { selectedPatient, setSelectedPatient } = useContext(PatientContext)


    const componentRef = useRef()

    const handleclick = useReactToPrint({
        content: () => componentRef.current,
    })

    return (
        <div>

            <div style={styles.box}>
                <h3>Report</h3>
                <div style={{ overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80%', height: '60vh', border: '1px solid black', background: 'grey' }} >
                    <MyDocument patient={selectedPatient} visit={newVisit} ref={componentRef} />
                </div>

                <div style={{ display: 'flex', marginBottom: '1.5%', justifyContent: 'space-between', width: '40%' }}>
                    <div>
                        <Link to={'/'} class="btn btn-danger btn-lg" onClick={() => { setNewVisit(null); setSelectedPatient(null) }} >Exit</Link>
                    </div>
                    <div>
                        <button class='btn btn-success btn-lg' onClick={() => { handleclick(); console.log(componentRef) }}>Save document or print</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    box: {
        justifyContent: 'space-around',
        width: '98%',
        height: '90vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1%',
        paddingTop: '1%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    container: {
        width: '90%',
        padding: 5,
        height: '90%',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',

    },
    title: {
        fontSize: 24,
    },
    text: {
        fontSize: 18,
    },
    link: {
        fontSize: 12,
    },
}


