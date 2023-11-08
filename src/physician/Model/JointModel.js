export default class JointModel {
  jointName;
  side;
  indexJoint;
  jointDifficulty;
  pain;
  lastBleed;
  sinovite;
  powerDoppler;
  cartilagine;
  subchondral_bone;
  distension;
  distensionCause;
  modifiedIndex;
  prothesis;
  lastReport;

  constructor(
    jointName,
    side,
    indexJoint,
    jointDifficulty,
    pain,
    lastBleed,
    sinovite,
    powerDoppler,
    cartilagine,
    subchondral_bone,
    distension,
    distensionCause,
    modifiedIndex,
    prothesis,
    lastReport
  ) {
    this.jointName = jointName;
    this.side = side;
    this.indexJoint = indexJoint;
    this.jointDifficulty = jointDifficulty;
    this.pain = pain;
    this.lastBleed = lastBleed;
    this.sinovite = sinovite;
    this.powerDoppler = powerDoppler;
    this.cartilagine = cartilagine;
    this.subchondral_bone = subchondral_bone;
    this.distension = distension;
    this.distensionCause = distensionCause;
    this.modifiedIndex = modifiedIndex;
    this.prothesis = prothesis;
    this.lastReport = lastReport;
  }

  clone() {
    return new JointModel(
      this.jointName,
      this.side,
      this.indexJoint,
      this.jointDifficulty,
      this.pain,
      this.lastBleed,
      this.sinovite,
      this.powerDoppler,
      this.cartilagine,
      this.subchondral_bone,
      this.distension,
      this.distensionCause,
      this.modifiedIndex,
      this.prothesis,
      this.lastReport
    );
  }

  setName(s) {
    this.jointName = s;
  }

  setName(s) {
    this.side = s;
  }

  setImages(a) {
    this.images = a;
  }

  setSelectedImages(a) {
    this.selectedImages = a;
  }

  setIndexJoint(b) {
    this.indexJoint = b;
  }

  setJointDiffuculty(b) {
    this.jointDifficulty = b;
  }

  setPain(b) {
    this.pain = b;
  }

  setLastBleed(d) {
    this.lastBleed = d;
  }

  setSynovitis(s) {
    this.sinovite = s;
  }

  setCartilage(s) {
    this.cartilagine = s;
  }

  setSubchondralBone(s) {
    this.subchondral_bone = s;
  }

  setDistension(s) {
    this.distension = s;
  }

  setDistensionCause(s) {
    this.distensionCause = s;
  }

  setModifiedIndex(b) {
    this.modifiedIndex = b;
  }

  setProthesis(b) {
    this.prothesis = b;
  }

  setPowerDoppler(n) {
    this.powerDoppler = n;
  }

  setLastReport(lr) {
    this.lastReport = lr;
  }
}
