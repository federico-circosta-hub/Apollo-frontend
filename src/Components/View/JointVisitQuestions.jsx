import { useEffect, useState } from "react"
import { Switch } from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import format from "date-fns/format";
import Slider from '@mui/material/Slider';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"

export default function JointVisitQuestions(props) {

    const panel = props.panel
    const joint = props.joint

    const synovitisValues = [{ value: 10, label: 'Absent/low' }, { value: 20, label: 'Mid' }, { value: 30, label: 'Severe' }]
    const cartilageValues = [{ value: 10, label: 'Normal' }, { value: 20, label: '<25% depletion' }, { value: 30, label: '<50% depletion' }, { value: 40, label: '>50% depletion' }, { value: 50, label: 'Full destruction' }]
    const subcondraleValues = [{ value: 10, label: 'Normal' }, { value: 20, label: 'Minor irregularities' }, { value: 30, label: 'Osteophytes' }]
    const distensionValues = [{ value: 10, label: 'Absent' }, { value: 20, label: 'Minor' }, { value: 30, label: 'Moderate' }, { value: 40, label: 'Severe' }]
    const distensionCauseValues = ['Unclear', 'Synovial Effusion', 'Synovial Effusion + Synovial Hyperplasia', 'Vacuum', 'Vacuum + Synovial Hyperplasia', 'Synovial Hyperplasia']


    const modifyJoint = (e, field) => {
        let b = e.target.checked
        switch (field) {
            case 'index':
                return joint.setIndexJoint(b)
            case 'difficulty':
                return joint.setJointDiffuculty(b)
            case 'pain':
                return joint.setPain(b)
        }
        props.setJoint(joint)
    }

    const lastBleed = (d) => {
        joint.setLastBleed(d)
        props.setJoint(joint)
    }

    const modifyPatientSliders = (e) => {
        switch (e.target.name) {
            case 'synovitis':
                let synovitis = synovitisValues.find(element => element.value == e.target.value)
                joint.setSynovitis(synovitis.label)
        }
        return props.setJoint(joint)
    }

    const valueResolver = () => {
        if (joint.synovitis != undefined) {
            let synovitis = synovitisValues.find(element => element.label == joint.synovitis)
            return synovitis.value
        }
        return 20
    }

    const displayDistensionCauses = () => {
        return distensionCauseValues.map(element => <MenuItem value={element}>{element}</MenuItem>)
    }

    if (panel == 1) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '70%', marginBottom: '3%' }}>
                <div style={{ width: '60%', height: '100%' }}>
                    <div >
                        <label style={{ fontSize: 25 }}>Index Joint</label>
                        <Switch checked={joint.indexJoint} onChange={(e) => modifyJoint(e, 'index')} />
                    </div>
                    <div >
                        <label style={{ fontSize: 25 }}>Difficulty moving</label>
                        <Switch checked={joint.jointDifficulty} onChange={(e) => modifyJoint(e, 'difficulty')} />
                    </div >
                    <div >
                        <label style={{ fontSize: 25 }}>Pain</label>
                        <Switch checked={joint.pain} onChange={(e) => modifyJoint(e, 'pain')} />
                    </div>
                </div>
                <div >
                    <label style={{ fontSize: 25 }} >Last bleeding:</label>
                    <br />
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it'>
                        <DatePicker label={joint.lastBleed != undefined ? format(joint.lastBleed, 'dd-MM-y') : 'DD-MM-YYYY'} onChange={(newValue) => lastBleed(newValue.$d)} />
                    </LocalizationProvider >
                </div>
            </div>
        )
    } else {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', width: '95%' }}>


                <div style={{ display: 'flex', flexDirection: 'column', width: '50%', }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '2vw' }}>
                        <div>
                            <label style={{ fontSize: 18 }}>Synovitis</label>
                        </div>

                        <div style={{ width: '60%' }}>
                            <Slider name="synovitis"
                                disabled={false}
                                marks={synovitisValues}
                                min={10}
                                max={30}
                                step={10}
                                className='MuiSlider-markLabel'
                                defaultValue={valueResolver('synovitis')}
                                onChange={(e) => modifyPatientSliders(e)}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '2vw' }}>
                        <div>
                            <label style={{ fontSize: 18 }}>Cartilage</label>
                        </div>

                        <div style={{ width: '80%' }}>
                            <Slider name="synovitis"
                                disabled={false}
                                marks={cartilageValues}
                                min={10}
                                max={50}

                                step={10}
                                defaultValue={valueResolver('synovitis')}
                                onChange={(e) => modifyPatientSliders(e)}
                            />
                        </div>



                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '2vw' }}>
                        <div>
                            <label style={{ fontSize: 18 }}>Subchondral bone</label>
                        </div>

                        <div style={{ width: '60%' }}>
                            <Slider name="synovitis"
                                disabled={false}
                                marks={subcondraleValues}
                                min={10}
                                max={30}
                                step={10}
                                defaultValue={valueResolver('synovitis')}
                                onChange={(e) => modifyPatientSliders(e)}
                                valueLabelDisplay="auto"
                            />
                        </div>



                    </div>
                </div>
                <div style={style.verticalLine}>

                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '40%', justifyContent: 'space-around' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                        <div>
                            <label style={{ fontSize: 18 }}>Distension level</label>
                        </div>

                        <div style={{ width: '60%' }}>
                            <Slider name="synovitis"
                                disabled={false}
                                marks={distensionValues}
                                min={10}
                                max={40}
                                step={10}
                                defaultValue={valueResolver('synovitis')}
                                onChange={(e) => modifyPatientSliders(e)}
                                valueLabelDisplay="auto"
                            />
                        </div>



                    </div>
                    <div >
                        <FormControl fullWidth >
                            <InputLabel id="demo-simple-select-label" style={{ width: '100%' }}>Which is the most likely cause of the distension?</InputLabel>
                            <Select style={{ fontSize: 28 }}
                                id="demo-simple-select"
                                label="evento"
                            >
                                {displayDistensionCauses()}
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div >
        )
    }
}

const style = {
    verticalLine: {
        height: '90%',
        backgroundColor: 'grey',
        width: 1,
        borderRadius: 15,
        marginRight: '3vw',
        marginLeft: '3vw'
    }
}