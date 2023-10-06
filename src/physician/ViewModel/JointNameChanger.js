export default class JointNameChanger {
  fromSeparateEnglishToSingleStringIta(name, side) {
    let newName;
    let newSide;
    switch (name) {
      case "knee":
        newName = "Ginocchio";
        return;
      case "ankle":
        newName = "Caviglia";
        return;
      case "elebow":
        newName = "Gomito";
        return;
      default:
        newName = name;
        return;
    }
    switch (side) {
      case "LX":
        newSide = "SX";
        return;
      case "RX":
        newName = "DX";
        return;
      default:
        newSide = side;
        return;
    }
    return newName + " " + newSide;
  }
}
