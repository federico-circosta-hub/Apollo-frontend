import format from "date-fns/format";

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
    this.name = joint.jointName;
    this.side = joint.side;
    this.blood =
      joint.distensionCause /*  === null ? undefined : joint.distensionCause */;
    this.distension_amount = joint.distension;
    this.last_bleeding = joint.lastBleed
      ? format(joint.lastBleed, "y-MM-dd")
      : undefined;
    this.difficulty_moving = joint.jointDifficulty;
    this.index_joint = joint.indexJoint;
    this.pain = joint.pain;
    this.cartilagine = joint.cartilagine;
    this.subchondral_bone = joint.subchondral_bone;
    this.sinovite = joint.sinovite;
    this.media_ids = [];
  }

  setMediaIds(newVisit) {
    let mediaIds = [];
    newVisit.ecographies.forEach((element) => {
      console.log(
        "setMediaIds:",
        element.realJoint,
        element.realSide,
        this.name,
        this.side
      );
      if (
        element.realJoint !== undefined &&
        element.realJoint === this.name &&
        element.realSide === this.side
      ) {
        mediaIds.push(element.id);
      }
    });
    this.media_ids = mediaIds;
  }

  setName(s) {
    this.name = s;
  }

  setSide(s) {
    this.side = s;
  }
}
