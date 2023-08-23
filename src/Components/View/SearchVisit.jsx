import { Link } from 'react-router-dom';
import newFile from '../img/icon/new-file.png'
import newEvent from '../img/icon/add-event.png'
import folder from '../img/icon/folder.png'
import GenerateVisits from '../Model/GenerateVisits';
import { useState, useEffect, useContext } from 'react';
import VisitLine from './VisitLine';
import { VisitContext } from '../Model/VisitContext';
import { PatientContext } from '../Model/PatientContext';
import NoContextModal from './NoContextModal';
import HeaderPatient from './HeaderPatient';

export default function SearchVisit() {

    const [visitList, setVisitList] = useState([])
    const [forward, setForward] = useState('none');
    const [disabledForward, setDisabledForward] = useState('flex');

    const { selectedVisit, setSelectedVisit } = useContext(VisitContext);
    const { selectedPatient } = useContext(PatientContext);

    useEffect(() => {
        getVisits()
    }, [])

    const getVisits = () => {
        let arr = GenerateVisits()
        arr.sort((a, b) => b - a);
        setVisitList(arr);
    }

    const handleSelect = () => {
        setForward('flex')
        setDisabledForward('none')
    }


    return (selectedPatient !== null) ? (
        <div>
            <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1%' }}>
                <HeaderPatient />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={style.box}>
                    <button className="btn btn-secondary btn-lg" disabled>
                        <label >Consulta visita passata  <img src={folder} alt="search" width={40} style={{ filter: `invert(100%)` }} /></label>
                    </button>

                    <Link to={'/visit/newVisitInPresence'} className="btn btn-primary btn-lg" >
                        <label >Nuova visita  <img src={newFile} alt="search" width={40} style={{ filter: `invert(100%)` }} /></label>
                    </Link>

                    <Link to={'/visit/searchVisit/newVisitPast'} className="btn btn-primary btn-lg">
                        <label >Inserisci visita passata  <img src={newEvent} alt="search" width={40} style={{ filter: `invert(100%)` }} /></label>
                    </Link>
                </div>

                <div style={style.box}>

                    <div style={{ overflow: 'auto', width: '90%', textAlign: 'center' }}>

                        <h2 style={{ position: 'sticky', top: 0, bottom: 10, background: 'white' }}>Elenco visite:</h2>
                        <div style={{ height: '45vh' }}>
                            {visitList.map((visit, index) => (
                                <VisitLine key={index} visit={visit} isSelected={visit === selectedVisit} onSelectVisit={() => { setSelectedVisit(visit); handleSelect() }} />
                            ))}
                        </div>
                    </div>
                    <div style={{ display: forward }}>
                        <Link to={'/visit/seeVisit'} style={{ margin: 20 }} class="btn btn-success btn-lg" >Prosegui</Link>
                    </div>
                    <div style={{ display: disabledForward }}>
                        <button style={{ margin: 20 }} class="btn btn-success btn-lg" disabled>Prosegui</button>
                    </div>
                </div>


            </div>
        </div>
    )
        :
        (
            <NoContextModal what={" un paziente "} service={" ricerca visita "} />
        )
}

const style = {
    box: {
        width: '45%',
        height: '75vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1.5%',
        display: 'flex',
        flexDirection: 'column',
        alignText: 'center',
        alignItems: 'center',
        paddingBottom: '2%',
        paddingTop: '5%',
        overflow: 'auto',
        justifyContent: 'space-around',
        gap: 20
    }
}

