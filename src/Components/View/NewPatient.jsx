import PatientModel from "../Model/PatientModel"
import { useState } from "react"
import male from '../img/male.png'
import question from '../img/icon/question.png'
import Slider from '@mui/material/Slider';
import "react-day-picker/dist/style.css";
import { format, } from 'date-fns';
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Checkbox } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NewPatientModal from "./NewPatientModal";
import { Link } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/it';
import { validateForm } from "../ViewModel/Validation";
import FormModal from "./FormModal"

export default function NewPatient() {

    const marksH = [{ value: 180, label: '180cm', }, { value: 170, label: '170cm', }, { value: 190, label: '190cm', }, { value: 160, label: '160cm', }, { value: 220, label: '220cm', }, { value: 120, label: '120cm', }];
    const marksW = [{ value: 40, label: '40kg', }, { value: 50, label: '50kg', }, { value: 60, label: '60kg', }, { value: 70, label: '70kg', }, { value: 80, label: '80kg', }, { value: 90, label: '90kg', }, { value: 100, label: '100kg', }, { value: 150, label: '150kg', }];
    const [patient, setPatient] = useState(new PatientModel('', '', '', 'M', 170, 75, []))
    const [protButtonClass, setProtButtonClass] = useState("btn btn-warning")
    const [showProthesis, setShowProthesis] = useState('none')
    const [showModal, setShowModal] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [sendingButton, setSendingButton] = useState('Conferma e procedi')
    const [showAlert, setShowAlert] = useState(false)
    const [formModal, setFormModal] = useState(false)
    const [errors, setErrors] = useState({ none: 'none' })
    const navigate = useNavigate();

    const handleNew = async () => {
        setDisabled(true)
        setSendingButton("Inviando...")
        setTimeout(() => {
            patient.register()
            setShowAlert(true)
        }, 3000)
    }

    const add = () => {
        let e = validateForm('newPatient', patient)
        if (Object.keys(e).length == 0) {
            setShowModal(true)
        }
        else {
            setErrors(e)
            setFormModal(true)
        }
    }

    const modifyPatientName = (event) => {
        let p = patient.clone()
        if (event.target.id === 'name') {
            p.setName(event.target.value)
        } else {
            p.setSurname(event.target.value)
        }
        setPatient(p);
    }

    const modifyPatientDimensions = (event, dimension) => {
        let p = patient.clone()
        if (event.target.name === 'weight') {
            p.setWeight(dimension)
        } else {
            p.setHeight(dimension)
        }
        setPatient(p);
    }

    const modifyPatientBirthdate = (date) => {
        console.log('modifico data nascita', date.$d)
        let p = patient.clone()
        p.setBirthdate(format(date.$d, 'y-MM-dd'))
        setPatient(p)
    }

    const handleGender = (event) => {
        let p = patient.clone()
        p.setGender(event.target.value)
        console.log(p.toString())
        setPatient(p)
    }

    const handleProthesis = (event) => {
        let p = patient.clone()
        if (event.target.checked) {
            p.addProthesis(event.target.name)
        } else {
            p.deleteProthesis(event.target.name)
        }
        setPatient(p)
    }

    const handleDisplayProthesis = () => {
        console.log('handleDisplayProthesis al momento mostro %s', showProthesis)
        if (showProthesis === 'none') {
            setShowProthesis('flex')
            setProtButtonClass("btn btn-outline-warning")
        } else {
            setShowProthesis('none')
            setProtButtonClass("btn btn-warning")
        }
    }

    return (
        <div className="box-bianco" style={style.box}>
            <div className="input-group mb-3" style={{
                justifyContent: 'center',
                display: 'flex',
                marginTop: '2%',
                alignItems: 'center'
            }}>
                <input id='name' type="text" placeholder="nome..." onChange={e => modifyPatientName(e)} />
                <input id='surname' type="text" placeholder="cognome..." onChange={e => modifyPatientName(e)} />
            </div>
            <div className="fascia centrale" style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <div style={style.leftButtons}>
                    <div >
                        <label style={{ fontSize: 25 }} >Data di nascita:</label>
                        <br />
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it'>
                            <DatePicker onChange={modifyPatientBirthdate} />
                        </LocalizationProvider >
                    </div>

                    <div >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Genere</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={patient.gender}
                                label="Sesso"
                                onChange={handleGender}>
                                <MenuItem value='M'>Maschio</MenuItem>
                                <MenuItem value='F'>Femmina</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div >
                        <button onClick={() => handleDisplayProthesis()} type="button" class={protButtonClass}>Protesi <img src={question} alt="question mark" width={'10%'} /></button>
                    </div>
                </div>

                <div style={style.protLeft} >
                    <div style={{ display: showProthesis }}>
                        <label >
                            <Checkbox
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                                name="Gom-dx"
                                onChange={handleProthesis}
                            />Gom dx</label>
                    </div>
                    <div style={{ display: showProthesis }} >
                        <label >
                            <Checkbox
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                                name="Gin-dx"
                                onChange={handleProthesis}
                            />Gin dx</label>
                    </div>
                    <div style={{ display: showProthesis }}>
                        <label >
                            <Checkbox
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                                name="Cav-dx"
                                onChange={handleProthesis}
                            />Cav dx</label>
                    </div>
                </div>

                <div style={{ width: '33%' }}>
                    <img src={male} alt="male human silhouette" style={{ width: '60%', position: 'relative', margin: 'auto' }} />
                </div>
                <div style={style.prot}>

                    <div style={{ display: showProthesis }}>
                        <label >
                            <Checkbox
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                                name="Gom-sx"
                                onChange={handleProthesis}
                            />Gom sx</label>
                    </div>
                    <div style={{ display: showProthesis }}>
                        <label >
                            <Checkbox
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                                name="Gin-sx"
                                onChange={handleProthesis}
                            />Gin sx</label>
                    </div>
                    <div style={{ display: showProthesis }}>
                        <label >
                            <Checkbox
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                                name="Cav-sx"
                                onChange={handleProthesis}
                            />Cav sx</label>
                    </div>
                </div>

                <div style={{ width: '25%' }} >
                    <Slider name="height"
                        disabled={false}
                        marks={marksH}
                        max={220}
                        value={patient.height}
                        min={120}
                        orientation="vertical"
                        onChange={modifyPatientDimensions}
                        valueLabelDisplay="on"
                    />
                </div>

            </div>
            <div style={{ width: '50%' }} >
                <Slider name="weight"
                    disabled={false}
                    marks={marksW}
                    max={150}
                    value={patient.weight}
                    min={40}
                    onChange={modifyPatientDimensions}
                    valueLabelDisplay="on"
                />
            </div>

            <div style={{ display: 'flex', marginBottom: '1.5%', justifyContent: 'space-between', width: '90%' }}>
                <div>
                    <Link class="btn btn-danger btn-lg" to={'/'}>Annulla</Link>
                </div>

                <div>
                    <button class="btn btn-success btn-lg" onClick={() => add()} >Aggiungi paziente</button>
                </div>
            </div>

            <NewPatientModal data={{ navigate: navigate, showAlert: showAlert, patient: patient, disabled: disabled, showModal: showModal, handleNew: handleNew, sendingButton: sendingButton, setShowModal: setShowModal }} />
            < div >
                {formModal && <FormModal formModal={formModal} setFormModal={setFormModal} errors={errors} />}
            </div >
        </div>
    )
}

const style = {
    leftButtons: {
        width: '25%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: '10%',
        marginLeft: '3.5%'
    },
    prot: {
        width: '3%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: '17%',
        marginRight: 'auto',

    },
    protLeft: {
        width: '3%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: '17%',
        marginLeft: 'auto',

    },
    box: {
        justifyContent: 'space-between',
        width: '90%',
        height: '85vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1.5%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    forwardButton: {
        display: 'flex',
        //marginRight: '1%',
        justifyContent: 'space-between',
        marginBottom: '1.5%',
    }
}
