export default class JointModel {
  jointName;
  side;
  indexJoint;
  jointDifficulty;
  pain;
  lastBleed;
  synovitis;
  cartilage;
  subchondralBone;
  distension;
  distensionCause;

  constructor(
    jointName,
    side,
    indexJoint,
    jointDifficulty,
    pain,
    lastBleed,
    synovitis,
    cartilage,
    subchondralBone,
    distension,
    distensionCause
  ) {
    this.jointName = jointName;
    this.side = side;
    this.indexJoint = indexJoint;
    this.jointDifficulty = jointDifficulty;
    this.pain = pain;
    this.lastBleed = lastBleed;
    this.synovitis = synovitis;
    this.cartilage = cartilage;
    this.subchondralBone = subchondralBone;
    this.distension = distension;
    this.distensionCause = distensionCause;
  }

  clone() {
    return new JointModel(
      this.jointName,
      this.side,
      this.indexJoint,
      this.jointDifficulty,
      this.pain,
      this.lastBleed,
      this.synovitis,
      this.cartilage,
      this.subchondralBone,
      this.distension,
      this.distensionCause
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
    this.synovitis = s;
  }

  setCartilage(s) {
    this.cartilage = s;
  }

  setSubchondralBone(s) {
    this.subchondralBone = s;
  }

  setDistension(s) {
    this.distension = s;
  }

  setDistensionCause(s) {
    this.distensionCause = s;
  }
}
