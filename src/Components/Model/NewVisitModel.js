import JointModel from "./JointModel";
import { format, } from 'date-fns';


export default class NewVisitModel {

    patient
    visitDate;
    physicalActivity = {
        'physicalActivity': Boolean,
        'physicalActivityDate': Date,
        'physicalActivityType': String
    };

    traumaticEvent = {
        'traumaticEvent': String,
        'traumaticEventDate': Date
    };
    followUp = {
        'followUp': false,
        'treatmentResponse': Number,
        'lastVisit': Date
    };

    joints = [];

    needFollowUp = {
        'needFollowUp': Boolean,
        'followUp': Date,
    };

    prophylacticDrug = {
        'drug': String,
        'dose': Number,
        'frequency': Number
    }

    acuteDrug = {
        'drug': String,
        'dose': Number,
    }

    currentJoint;



    constructor() {

    }

    setPatient(p) {
        this.patient = p
    }

    setVisitDate(d) {
        this.visitDate = d
    }

    setPhysicalActivity(o) {
        this.physicalActivity = {
            physicalActivity: o.physicalActivity,
            physicalActivityDate: o.physicalActivityDate,
            physicalActivityType: o.physicalActivityType
        }
    }

    setTraumaticEvent(t) {
        this.traumaticEvent = {
            traumaticEvent: t.traumaticEvent,
            traumaticEventDate: t.traumaticEventDate
        };
    }

    setIsFollowUp(b) {
        this.followUp = {
            followUp: b,
            treatmentResponse: Number,
            lastVisit: Date
        }
    }

    setJoints(a) {
        this.joints = a
    }

    setFollowUp(t, l) {
        this.followUp = {
            followUp: this.followUp.followUp,
            treatmentResponse: t,
            lastVisit: l
        }
    }

    addJoint(j) {
        this.joints.push(j)
    }

    setNeedFollowUp(b, n) {
        this.needFollowUp = {
            needFollowUp: b,
            followUp: n
        };
    }

    setProphylacticDrug(dr, ds, f) {
        this.prophylacticDrug = {
            drug: dr,
            dose: ds,
            frequency: f
        }
    }

    setAcuteDrug(dr, ds) {
        this.acuteDrug = {
            drug: dr,
            dose: ds,
        }
    }

    setCurrentJoint(s) {
        this.currentJoint = s
    }

    clone() {
        return new NewVisitModel()
    }

    getJoint(s) {
        let joint = new JointModel()
        this.joints.forEach(e => {
            if (e.jointName === s) {
                console.log(e.jointName, ' è uguale a ', s)
                joint = e
                return joint
            }
        });
        joint.setName(s)
        return joint
    }

    jointPresence(s) {
        console.log('chiamato jointPresence')
        this.joints.forEach(e => {
            if (e.jointName == s) {
                return true
            }
            console.log(e.jointName + ' non uguale a ' + s)
        })
        return false
    }

    deleteJoint(s) {
        let index
        for (let i = 0; i < this.joints.length; i++) {
            if (this.joints[i].jointName === s) {
                index = i
            }
        }
        this.joints.splice(index, 1)
    }

    toString(f) {
        switch (f) {
            case 'patient':
                return this.patient
            case 'visitDate':
                return format(this.visitDate, 'dd-MM-y')
            case 'physicalActivity':
                if (this.physicalActivity.physicalActivity) {
                    return (
                        this.physicalActivity.physicalActivityDate + '\n' + this.physicalActivity.physicalActivityType
                    )
                } else {
                    return 'nessuna'
                }
            case 'traumaticEvent':
                return (
                    this.traumaticEvent.traumaticEvent + '\n' + this.traumaticEvent.traumaticEventDate
                )
            case 'joints':
                let s = 'Sono stati visitati:\n'
                this.joints.forEach(e => {
                    s += e.jointName + " num ecografie: "
                    if (e.images != undefined) {
                        s += e.images.length + '\n'
                    } else {
                        s += 0
                    }
                })
                return s
        }
    }
}