import { useContext, useState } from "react"
import { NewVisitContext } from "../../Model/NewVisitContext"
import notification from '../../img/icon/notification.png'
import { FormControl, Switch, InputLabel, Select, MenuItem, } from "@mui/material"
import format from "date-fns/format"
import a_drugs from '../../img/icon/a_drugs.png'
import p_drugs from '../../img/icon/p_drugs.png'
import eye from '../../img/icon/view.png'
import response from '../../img/icon/hydrotherapy.png'
import { useNavigate } from "react-router-dom"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/it';
import { validateForm } from '../../ViewModel/Validation'
import FormModal from '../Modals/FormModal'
import Slider from '@mui/material/Slider';

export default function Drug() {

    const { newVisit, setNewVisit } = useContext(NewVisitContext)

    const prophylacticDrugs = ['None', 'Artiflexinol', 'FlexiRelieve', 'JointEasePro', 'CartiFlexaMax', 'SynoFlexitron',]
    const acuteDrugs = ['None', 'PainXcel', 'ReliefFast', 'AcuPainGone']
    const treatmentResponses = [{ value: 10, label: 'Low/absent' }, { value: 20, label: 'Discrete' }, { value: 30, label: 'Good' }, { value: 40, label: 'Excellent' }]
    const distensionCauseValues = ['Unclear', 'Synovial Effusion', 'Synovial Effusion + Synovial Hyperplasia', 'Vacuum', 'Vacuum + Synovial Hyperplasia', 'Synovial Hyperplasia']


    const units = ['Pills', 'Drops', 'Grams', 'Milligrams']

    const [disabledProphylactic, setDisabledProphylactic] = useState(newVisit.prophylacticDrug.drug == 'None' ? true : false)
    const [disabledAcute, setDisabledAcute] = useState(newVisit.acuteDrug.drug == 'None' ? true : false)
    const [needFollowUp, setNeedFollowUp] = useState(newVisit.needFollowUp == undefined ? { 'needFollowUp': false, 'followUpDate': '' } : newVisit.needFollowUp)
    const [prophylacticDrug, setProphylacticDrug] = useState(newVisit.prophylacticDrug)
    const [acuteDrug, setAcuteDrug] = useState(newVisit.acuteDrug)
    const [formModal, setFormModal] = useState(false)
    const [errors, setErrors] = useState({ none: 'none' })

    const navigate = useNavigate()

    const datePickerResolver = (b, s) => {
        if (b) {
            return <DatePicker value={'DD-MM-YYYY'} disabled />
        } else {
            return <DatePicker onChange={(newValue) => modifyDate(newValue.$d, s)} />
        }
    }

    const modifyDate = (date) => {
        needFollowUp.followUpDate = format(date, 'y-MM-dd')
        setNeedFollowUp(needFollowUp)
    }

    const handleChange = (e) => {
        let nfu = { ...needFollowUp }
        nfu.needFollowUp = e.target.checked
        setNeedFollowUp(nfu)
    }

    const handleProphylacticDrug = (e) => {
        let pd = { ...prophylacticDrug }
        pd.drug = e.target.value
        if (pd.drug == 'None') {
            pd.dose = ''
            pd.unit = ''
            pd.frequency = ''
            setDisabledProphylactic(true)
        } else {
            setDisabledProphylactic(false)
        }
        setProphylacticDrug(pd)
    }

    const handleProphylacticDrugDose = (e) => {
        let pd = { ...prophylacticDrug }
        pd.dose = Number(e.target.value)
        setProphylacticDrug(pd)
    }

    const handleProphylacticDrugUnit = (e) => {
        let pd = { ...prophylacticDrug }
        pd.unit = e.target.value
        setProphylacticDrug(pd)
    }

    const handleProphylacticDrugFrequency = (e) => {
        let pd = { ...prophylacticDrug }
        pd.frequency = Number(e.target.value)
        setProphylacticDrug(pd)
    }

    const handleAcuteDrug = (e) => {
        let ad = { ...acuteDrug }
        ad.drug = e.target.value
        if (ad.drug == 'None') {
            ad.dose = ''
            ad.unit = ''
            setDisabledAcute(true)
        } else {
            setDisabledAcute(false)
        }
        setAcuteDrug(ad)
    }

    const handleAcuteDrugDose = (e) => {
        let ad = { ...acuteDrug }
        ad.dose = Number(e.target.value)
        setAcuteDrug(ad)
    }

    const handleAcuteDrugUnit = (e) => {
        let ad = { ...acuteDrug }
        ad.unit = e.target.value
        setAcuteDrug(ad)
    }

    const forward = () => {
        let o = {}
        o.needFollowUp = needFollowUp
        o.prophylacticDrug = prophylacticDrug
        o.acuteDrug = acuteDrug
        console.log(o)
        let e = (validateForm('drugs', o))
        console.log(Object.keys(e))
        if (Object.keys(e).length == 0) {
            newVisit.setNeedFollowUp(needFollowUp)
            newVisit.setProphylacticDrug(prophylacticDrug)
            newVisit.setAcuteDrug(acuteDrug)
            setNewVisit(newVisit)
            setErrors({})
            console.log(newVisit)
            navigate('/newVisit/endVisit');
        } else {
            setErrors(e)
            setFormModal(true)
        }
    }

    const visitButtonResolver = () => {
        if (newVisit.followUp.followUp) {
            return (
                <button class="btn btn-info"><img width={22} src={eye} alt="" /> {format(newVisit.previousVisit, 'dd-MM-y')}</button>
            )
        } else {
            return (
                <button disabled class="btn btn-info"><img width={22} src={eye} alt="" /> Previous visit</button>
            )
        }
    }

    const displayDistensionCauses = () => {
        return distensionCauseValues.map(element => <MenuItem value={element}>{element}</MenuItem>)
    }

    return (
        <div>
            <div className="box-bianco" style={style.box}>

                <div style={{ display: 'flex', width: '95%', alignItems: "center", justifyContent: 'space-between', marginTop: '1.5%' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                        <div style={{ width: '45vw', display: 'flex', flexDirection: 'column', justifyContent: 'left', gap: '4vh', border: '1px solid black', borderRadius: '20px', padding: '4%', height: '45vh', margin: '1%', opacity: newVisit.followUp.followUp ? '100%' : '40%' }}>
                            <div>
                                <h4><img src={response} width={50} alt="" />Treatment response</h4>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'start', gap: 20, alignItems: 'center', }}>
                                <div>
                                    <label style={{ fontSize: 15 }}>Previous visit</label>
                                </div>
                                <div>
                                    {visitButtonResolver()}
                                </div>

                            </div>
                            <div style={{ display: 'flex', justifyContent: 'start', gap: 20, width: '80%' }}>
                                <div>
                                    <label style={{ fontSize: 15 }}>Treatment response</label>
                                </div>
                                <Slider name="treatment response"
                                    disabled={!newVisit.followUp.followUp}
                                    marks={treatmentResponses}
                                    min={10}
                                    max={40}
                                    step={10}
                                    defaultValue={newVisit.followUp.treatmentResponse != '' ? newVisit.followUp.treatmentResponse : 10}
                                />
                            </div>
                            <div >
                                <FormControl fullWidth disabled={!newVisit.followUp.followUp} >
                                    <InputLabel id="demo-simple-select-label" style={{ width: '80%' }}>Which <strong>was</strong> the most likely cause of the distension?</InputLabel>
                                    <Select style={{ fontSize: 15 }}
                                        id="demo-simple-select"
                                        label='Which was the most likely cause of the distension?'
                                    >
                                        {displayDistensionCauses()}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div style={style.needFollowUpButtons}>
                            <div style={{ display: 'flex', width: '70%', alignItems: 'center' }}>
                                <label style={{ fontSize: 26 }} ><img src={notification} width={50} alt="" />Need follow up?</label>
                                <Switch checked={needFollowUp == null ? false : needFollowUp.needFollowUp} onChange={handleChange} />

                            </div>
                            <div>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it'>
                                    {datePickerResolver(!needFollowUp.needFollowUp, 'followUpDate')}
                                </LocalizationProvider >
                            </div>
                        </div>

                    </div>

                    <div style={style.verticalLine}></div>


                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                        <div style={style.prophylacticButtons}>
                            <div>
                                <h4><img src={p_drugs} width={50} alt="" />Prophylactic Drug</h4>
                            </div>
                            <div >
                                <FormControl fullWidth >
                                    <InputLabel id="demo-simple-select-label" style={{ maxWidth: 'fit-content' }}>Prophylactic drug</InputLabel>
                                    <Select style={{ fontSize: 15 }}
                                        id="demo-simple-select"
                                        defaultValue={newVisit.prophylacticDrug.drug}
                                        onChange={(e) => handleProphylacticDrug(e)}
                                        label="Prophylactic drug">
                                        {prophylacticDrugs.map(element => <MenuItem value={element}>{element}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{ display: "flex" }} >
                                <div style={{ width: '30%' }}>
                                    <FormControl disabled={disabledProphylactic} fullWidth >
                                        <InputLabel id="demo-simple-select-label" >Unit</InputLabel>
                                        <Select style={{ fontSize: 15 }}
                                            id="demo-simple-select"
                                            onChange={handleProphylacticDrugUnit}
                                            defaultValue={newVisit.prophylacticDrug.unit}
                                            label="Unit">
                                            {units.map(element => <MenuItem value={element}>{element}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </div>

                                <input placeholder="Dose" defaultValue={newVisit.prophylacticDrug.dose} onChange={handleProphylacticDrugDose} style={{ background: `#fffacd` }} name="prophylacticDose" type="number" disabled={disabledProphylactic} />
                            </div>
                            <div >
                                <input placeholder="Frequency" defaultValue={newVisit.prophylacticDrug.frequency} onChange={handleProphylacticDrugFrequency} style={{ background: `#fffacd` }} name="prophylacticFrequency" type="number" disabled={disabledProphylactic} />
                            </div>

                        </div>

                        <div style={style.acuteButtons}>
                            <div>
                                <h4><img src={a_drugs} width={50} alt="" />Acute Drug</h4>
                            </div>
                            <div >
                                <FormControl fullWidth >
                                    <InputLabel id="demo-simple-select-label" style={{ maxWidth: 'fit-content' }}>Acute drug</InputLabel>
                                    <Select style={{ fontSize: 15 }}
                                        id="demo-simple-select"
                                        defaultValue={newVisit.acuteDrug.drug}
                                        onChange={(e) => handleAcuteDrug(e)}
                                        label="Acute drug">
                                        {acuteDrugs.map(element => <MenuItem value={element}>{element}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{ display: "flex" }} >
                                <div style={{ width: '30%' }}>
                                    <FormControl disabled={disabledAcute} fullWidth >
                                        <InputLabel id="demo-simple-select-label" style={{}}>Unit</InputLabel>
                                        <Select style={{ fontSize: 15 }}
                                            id="demo-simple-select"
                                            label="Unit"
                                            defaultValue={newVisit.acuteDrug.unit}
                                            onChange={handleAcuteDrugUnit}>
                                            {units.map(element => <MenuItem value={element}>{element}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </div>
                                <input placeholder="Dose" style={{ background: `#ffe4e1` }} value={acuteDrug.dose} name="AcuteDose" type="number" onChange={handleAcuteDrugDose} disabled={disabledAcute} />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', marginBottom: '1.5%', justifyContent: 'space-between', width: '75%' }}>
                    <div>
                        <button onClick={() => navigate(-1)} class="btn btn-primary btn-lg">Back</button>
                    </div>
                    <div>
                        <button style={style.forwardButton} class="btn btn-success btn-lg" onClick={forward}>End visit</button>
                    </div>
                </div>
            </div>
            < div >
                {formModal && <FormModal formModal={formModal} setFormModal={setFormModal} errors={errors} />}
            </div >
        </div>
    )
}

const style = {
    needFollowUpButtons: {
        width: '45vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid black',
        borderRadius: '20px',
        padding: '4%',
        height: '22vh',
        margin: '1%'
    },

    prophylacticButtons: {
        background: `#fffacd`,
        width: '45vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid black',
        borderRadius: '20px',
        padding: '4%',
        height: '35vh',
        margin: '1%'
    },

    acuteButtons: {
        background: `#ffe4e1`,
        width: '45vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid black',
        borderRadius: '20px',
        padding: '4%',
        height: '32vh',
        margin: '1%'
    },


    box: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '98%',
        height: '90vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1.5%',
        flexDirection: 'column',
        alignItems: 'center'
    },
    verticalLine: {
        width: 1,
        backgroundColor: 'black',
        height: '85%',
        borderRadius: 15,
    }
}


