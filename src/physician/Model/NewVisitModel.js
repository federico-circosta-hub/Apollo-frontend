import JointModel from "./JointModel";
import { format } from "date-fns";
import JointNameChager from "./../ViewModel/JointNameChanger";

export default class NewVisitModel {
  visitId;
  patient;
  visitDate;
  physician;
  physicalActivity = {
    physicalActivity: false,
    physicalActivityDate: "",
    physicalActivityType: "Nessuna",
  };

  traumaticEvent = {
    traumaticEvent: "Nessuno",
    traumaticEventDate: "",
  };
  followUp = {
    followUp: false,
    treatmentResponse: "",
    lastVisit: "",
  };

  joints = [];

  needFollowUp = {
    needFollowUp: false,
    followUpDate: "",
  };

  prophylacticDrug = {
    drug: { name: "" },
    unit: "",
    dose: "",
    frequency: "",
  };

  acuteDrug = {
    drug: { name: "" },
    unit: "",
    dose: "",
  };

  previousVisit;

  previousVisitList;

  isInPresence;
  sended;

  ecographies = [];
  ecographiesId = [];

  constructor() {}

  setTreatment(n) {
    this.followUp.treatmentResponse = n;
  }

  setVisitId(id) {
    this.visitId = id;
  }

  setEcographiesId(e) {
    let union = this.ecographiesId.concat(e);
    this.ecographiesId = union.filter(
      (item, pos) => union.indexOf(item) === pos
    );
  }

  setEcographies(e) {
    let union = this.ecographies.concat(e);
    union.forEach((e) => (e.actualModified = { value: false, select: null }));
    this.ecographies = union.filter((item, pos) => union.indexOf(item) === pos);
  }

  setPhysician(p) {
    this.physician = p;
  }

  setPatient(p) {
    this.patient = p;
  }

  setVisitDate(d) {
    this.visitDate = d;
  }

  setPhysicalActivity(o) {
    this.physicalActivity = {
      physicalActivity: o.physicalActivity,
      physicalActivityDate: o.physicalActivityDate,
      physicalActivityType: o.physicalActivityType,
    };
  }

  setTraumaticEvent(t) {
    this.traumaticEvent = {
      traumaticEvent: t.traumaticEvent,
      traumaticEventDate: t.traumaticEventDate,
    };
  }

  setIsFollowUp(b) {
    this.followUp = {
      followUp: b,
      treatmentResponse: Number,
      lastVisit: Date,
    };
  }

  setJoints(a) {
    this.joints = a;
  }

  setFollowUp(t, l) {
    this.followUp = {
      followUp: this.followUp.followUp,
      treatmentResponse: t,
      lastVisit: l,
    };
  }

  setLastVisit(d) {
    this.followUp.lastVisit = d;
  }

  addJoint(j) {
    this.joints.push(j);
  }

  setNeedFollowUp(nfu) {
    this.needFollowUp = nfu;
  }

  setProphylacticDrug(pd) {
    this.prophylacticDrug = pd;
  }

  setAcuteDrug(ad) {
    this.acuteDrug = ad;
  }

  setCurrentJoint(s) {
    this.currentJoint = s;
  }

  clone() {
    return new NewVisitModel();
  }

  async getJoint(obj) {
    let jointToClone = this.joints.find(
      (e) => e.jointName === obj.name && e.side === obj.side
    );
    let joint;
    if (jointToClone === undefined) {
      joint = new JointModel(
        obj.name,
        obj.side,
        false,
        false,
        false,
        undefined,
        0,
        0,
        0,
        0,
        "absent",
        null,
        false,
        false,
        undefined
      );
    } else {
      joint = await jointToClone.clone();
    }
    return joint;
  }

  jointPresence(obj) {
    let b = false;
    this.joints.forEach((e) => {
      if (e.jointName === obj.name && e.side === obj.side) {
        b = true;
      }
    });
    return b;
  }

  deleteJoint(obj) {
    this.ecographies.length > 0 &&
      this.ecographies.forEach((ecog) => {
        if (ecog.realJoint === obj.name && ecog.realSide === obj.side) {
          ecog.realJoint = undefined;
          ecog.realSide = undefined;
        }
      });
    this.joints = this.joints.filter(
      (joint) => joint.jointName !== obj.name || joint.side !== obj.side
    );
  }

  deleteJointForUpdate(obj) {
    this.joints = this.joints.filter(
      (joint) => joint.jointName !== obj.name || joint.side !== obj.side
    );
  }

  setPreviousVisitList(pvl) {
    this.previousVisitList = pvl;
  }

  setPreviousVisit(pv) {
    this.previousVisit = pv;
  }

  setIsInPresence(b) {
    this.isInPresence = b;
  }

  setSended(b) {
    this.sended = b;
  }

  toString(f) {
    switch (f) {
      case "patient":
        return this.patient;
      case "visitDate":
        return format(this.visitDate, "dd-MM-y");
      case "physicalActivity":
        if (this.physicalActivity.physicalActivity) {
          return (
            this.physicalActivity.physicalActivityDate +
            "\n" +
            this.physicalActivity.physicalActivityType
          );
        } else {
          return "nessuna";
        }
      case "traumaticEvent":
        return (
          this.traumaticEvent.traumaticEvent +
          "\n" +
          this.traumaticEvent.traumaticEventDate
        );
      case "joints":
        let s = "Joints visited:\n";
        this.joints.forEach((e) => {
          s += e.jointName + " selected images: ";
          if (e.selectedImages != undefined) {
            s += e.selectedImages.length + "\n";
          } else {
            s += 0;
          }
        });
        return s;
    }
  }

  getJointWithoutMod(jointName, side) {
    return this.joints.find(
      (e) =>
        (e.jointName === jointName || e.name === jointName) && e.side === side
    );
  }

  getIndexJoints() {
    let arr = [];
    this.joints.forEach((e) => {
      if (e.indexJoint)
        arr.push(
          JointNameChager.fromSeparateEnglishToSingleStringIta(
            e.jointName,
            e.side
          )
        );
    });
    return arr;
  }

  headUsTotalScore() {
    let total = 0;
    this.joints.forEach((j) => {
      total += j.sinovite + j.cartilagine + j.subchondral_bone;
    });
    return total;
  }
}
