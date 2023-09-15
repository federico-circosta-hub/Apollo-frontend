import { useState } from "react"
import { Switch } from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import format from "date-fns/format";
import Slider from '@mui/material/Slider';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"

export default function JointVisitQuestions(props) {

    const synovitisValues = [{ value: 10, label: 'Absent/low' }, { value: 20, label: 'Mid' }, { value: 30, label: 'Severe' }]
    const cartilageValues = [{ value: 10, label: 'Normal' }, { value: 20, label: '<25% depletion' }, { value: 30, label: '<50% depletion' }, { value: 40, label: '>50% depletion' }, { value: 50, label: 'Full destruction' }]
    const subchondralValues = [{ value: 10, label: 'Normal' }, { value: 20, label: 'Minor irregularities' }, { value: 30, label: 'Osteophytes' }]
    const distensionValues = [{ value: 10, label: 'Absent' }, { value: 20, label: 'Minor' }, { value: 30, label: 'Moderate' }, { value: 40, label: 'Severe' }]
    const distensionCauseValues = ['Unclear', 'Synovial Effusion', 'Synovial Effusion + Synovial Hyperplasia', 'Vacuum', 'Vacuum + Synovial Hyperplasia', 'Synovial Hyperplasia']

    const [disableDistensionCauses, setDisableDistensionCauses] = useState((props.joint.distension == 'Absent' || props.joint.distension == 'Minor' || props.joint.distension == undefined) ? true : false)


    const modifyJoint = (e, field) => {
        let b = e.target.checked
        switch (field) {
            case 'index':
                return props.joint.setIndexJoint(b)
            case 'difficulty':
                return props.joint.setJointDiffuculty(b)
            case 'pain':
                return props.joint.setPain(b)
        }
        props.setJoint(props.joint)
    }

    const lastBleed = (d) => {
        props.joint.setLastBleed(d)
        props.setJoint(props.joint)
    }

    const modifyPatientSliders = (e) => {
        switch (e.target.name) {
            case 'synovitis':
                let synovitis = synovitisValues.find(element => element.value == e.target.value)
                props.joint.setSynovitis(synovitis.label)
                return props.setJoint(props.joint)
            case 'cartilage':
                let cartilage = cartilageValues.find(element => element.value == e.target.value)
                props.joint.setCartilage(cartilage.label)
                return props.setJoint(props.joint)
            case 'subchondral':
                let subchondralBone = subchondralValues.find(element => element.value == e.target.value)
                props.joint.setSubchondralBone(subchondralBone.label)
                return props.setJoint(props.joint)
            case 'distension':
                let distension = distensionValues.find(element => element.value == e.target.value)
                if (distension.label == 'Moderate' || distension.label == 'Severe') setDisableDistensionCauses(false)
                else setDisableDistensionCauses(true)
                props.joint.setDistension(distension.label)
                return props.setJoint(props.joint)
        }
    }

    const valueResolver = (s) => {
        let n = 10
        switch (s) {
            case 'synovitis':
                console.log('case synovitis')
                if (props.joint.synovitis != undefined) {
                    let synovitis = synovitisValues.find(element => element.label == props.joint.synovitis)
                    n = synovitis.value
                }
                return n
            case 'cartilage':
                if (props.joint.cartilage != undefined) {
                    let cartilage = cartilageValues.find(element => element.label == props.joint.cartilage)
                    n = cartilage.value
                }
                return n
            case 'subchondral':
                if (props.joint.subchondralBone != undefined) {
                    let subchondral = subchondralValues.find(element => element.label == props.joint.subchondralBone)
                    n = subchondral.value
                }
                return n
            case 'distension':
                if (props.joint.distension != undefined) {
                    let distension = distensionValues.find(element => element.label == props.joint.distension)
                    n = distension.value
                }
                return n
        }
        return n
    }

    const displayDistensionCauses = () => {
        return distensionCauseValues.map(element => <MenuItem value={element}>{element}</MenuItem>)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'space-between', width: '100%', height: '100%' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '2vw', width: '37%' }}>
                <label style={{ fontSize: 20 }}>Index Joint</label>
                <Switch defaultChecked={props.joint.indexJoint} onChange={(e) => modifyJoint(e, 'index')} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '2vw', width: '37%' }}>
                <label style={{ fontSize: 20 }}>Difficulty moving</label>
                <Switch defaultChecked={props.joint.jointDifficulty} onChange={(e) => modifyJoint(e, 'difficulty')} />
            </div >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '2vw', width: '37%' }}>
                <label style={{ fontSize: 20 }}>Pain</label>
                <Switch defaultChecked={props.joint.pain} onChange={(e) => modifyJoint(e, 'pain')} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '2vw', width: '95%', alignItems: 'center' }} >
                <div>
                    <label style={{ fontSize: 20 }} >Last bleeding:</label>
                </div>
                <div style={{ width: '70%' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it'>
                        <DatePicker label={props.joint.lastBleed != undefined ? format(props.joint.lastBleed, 'dd-MM-y') : 'DD-MM-YYYY'} onChange={(newValue) => lastBleed(newValue.$d)} />
                    </LocalizationProvider >
                </div>

            </div>


            <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '2vw', width: '95%' }}>
                <div>
                    <label style={{ fontSize: 20 }}>Synovitis</label>
                </div>

                <div style={{ width: '70%' }}>
                    <Slider name="synovitis"
                        disabled={false}
                        marks={synovitisValues}
                        min={10}
                        max={30}
                        step={10}
                        defaultValue={() => valueResolver('synovitis')}
                        className='MuiSlider-markLabel'
                        onChange={(e) => modifyPatientSliders(e)}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '2vw', width: '95%' }}>
                <div>
                    <label style={{ fontSize: 20 }}>Cartilage</label>
                </div>

                <div style={{ width: '70%' }}>
                    <Slider name="cartilage"
                        disabled={false}
                        marks={cartilageValues}
                        min={10}
                        max={50}
                        step={10}
                        defaultValue={() => valueResolver('cartilage')}
                        onChange={(e) => modifyPatientSliders(e)}
                    />
                </div>



            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '2vw', width: '95%' }}>
                <div>
                    <label style={{ fontSize: 20 }}>Subchondral bone</label>
                </div>

                <div style={{ width: '70%' }}>
                    <Slider name="subchondral"
                        disabled={false}
                        marks={subchondralValues}
                        min={10}
                        max={30}
                        step={10}
                        defaultValue={() => valueResolver('subchondral')}
                        onChange={(e) => modifyPatientSliders(e)}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '95%' }}>
                <div>
                    <label style={{ fontSize: 20 }}>Distension level</label>
                </div>

                <div style={{ width: '70%' }}>
                    <Slider name="distension"
                        disabled={false}
                        marks={distensionValues}
                        min={10}
                        max={40}
                        step={10}
                        defaultValue={() => valueResolver('distension')}
                        onChange={(e) => modifyPatientSliders(e)}
                    />
                </div>



            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '60%' }}>
                <FormControl fullWidth disabled={disableDistensionCauses} size="small">
                    <InputLabel id="demo-simple-select-label" style={{ width: '100%' }} size="small">Which is the most likely cause of the distension?</InputLabel>
                    <Select style={{ fontSize: 20 }}
                        id="demo-simple-select"
                        label="Which is the most likely cause of the..."
                    >
                        {displayDistensionCauses()}
                    </Select>
                </FormControl>
            </div>
        </div>

    )
}