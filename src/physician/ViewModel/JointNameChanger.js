class JointNameChanger {
  fromSeparateEnglishToSingleStringIta(name, side) {
    let newName;
    let newSide;
    switch (name) {
      case "knee":
        newName = "Ginocchio";
        break;
      case "ankle":
        newName = "Caviglia";
        break;
      case "elbow":
        newName = "Gomito";
        break;
      default:
        newName = name;
        break;
    }
    switch (side) {
      case "LEFT":
        newSide = "SX";
        break;
      case "RIGHT":
        newSide = "DX";
        break;
      default:
        newSide = side;
        break;
    }
    return newName + " " + newSide;
  }

  fromItaToEnglishSide(side) {
    let newSide;
    switch (side) {
      case "SX":
        newSide = "LEFT";
        break;
      case "DX":
        newSide = "RIGHT";
        break;
      default:
        newSide = side;
        break;
    }
    return newSide;
  }

  fromItaToEnglishName(name) {
    let newName;
    switch (name) {
      case "ginocchio":
        newName = "knee";
        break;
      case "caviglia":
        newName = "ankle";
        break;
      case "gomito":
        newName = "elbow";
        break;
      default:
        newName = name;
        break;
    }
    return newName;
  }

  fromEngToItaName(name) {
    let newName;
    switch (name) {
      case "knee":
        newName = "Ginocchio";
        break;
      case "ankle":
        newName = "Caviglia";
        break;
      case "elbow":
        newName = "Gomito";
        break;
      default:
        newName = name;
        break;
    }
    return newName;
  }
}
const instance = new JointNameChanger();
export default instance;
