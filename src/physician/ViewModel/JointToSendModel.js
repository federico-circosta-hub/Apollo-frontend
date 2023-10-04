export default class JointToSendModel {
  id; //: number
  name; //: string
  side; //: DX | SX
  blood; //: yes | no | not clear	(non sono certo che i valori siano corretti, potrebbe cambiare)
  distension_amount; //: string
  last_bleeding; //: string | undefined	(data)
  difficulty_moving; //: boolean
  index_joint; //: boolean
  pain; //: boolean
  cartilagine; //: 0 | 1 | 2 | 3 | 4
  subchondral_bone; //: 0 | 1 | 2
  sinovite; //: 0 | 1 | 2
  media_ids; //: lista dei media id associati alla diagnosi dell'articolazione

  constructor(joint) {
    this.id = 1;
    this.name = joint.jointName.substring(0, joint.jointName.length - 3);
    this.side = joint.jointName
      .substring(joint.jointName.length - 2, joint.jointName.length)
      .toUpperCase();
    this.blood = "not clear";
    this.distension_amount = joint.distension;
    this.last_bleeding = joint.lastBleed;
    this.difficulty_moving = joint.jointDifficulty;
    this.index_joint = joint.indexJoint;
    this.pain = joint.pain;
    this.cartilagine = joint.cartilage;
    this.subchondral_bone = joint.subchondralBone;
    this.sinovite = joint.synovitis;
    this.media_ids = [];
  }

  setMediaIds(newVisit) {
    let mediaIds = [];

    /*     newVisit.ecographies.forEach((element) => {
      if (
        element.jointRef !== undefined &&
        element.jointRef.substring(0, 5) === this.name.substring(0, 5) &&
        element.jointRef.substring(
          element.jointRef.length - 2,
          element.jointRef.length
        ) === this.side.toLowerCase()
      ) {
        mediaIds.push(element.link);
      }
    }); */
    this.media_ids = mediaIds;
  }

  setName(s) {
    this.name = s;
  }
}
