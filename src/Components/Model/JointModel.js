

export default class JointModel {

    jointName
    images
    indexJoint
    jointDifficulty
    pain
    lastBleed
    synovitis
    articularCartilage
    subchondralBone
    distension
    distensionCause

    constructor(jointName, images, indexJoint, jointDifficulty, pain, lastBleed, synovitis, articularCartilage, subchondralBone, distension, distensionCause) {
        this.jointName = jointName
        this.images = images
        this.indexJoint = indexJoint
        this.jointDifficulty = jointDifficulty
        this.pain = pain
        this.lastBleed = lastBleed
        this.synovitis = synovitis
        this.articularCartilage = articularCartilage
        this.subchondralBone = subchondralBone
        this.distension = distension
        this.distensionCause = distensionCause
    }

    setName(s) {
        this.jointName = s
    }

    setImages(a) {
        this.images = a
    }
}