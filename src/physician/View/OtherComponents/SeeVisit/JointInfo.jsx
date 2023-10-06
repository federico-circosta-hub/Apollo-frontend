export default function JointInfo(props) {
  const jointToDisplay = props.visit.report.joints.find(
    (item) => item.name + " " + item.side === props.selectedJoint
  );

  const valueResolver = (s) => {
    let result = "";
    switch (s) {
      case "sinovite":
        switch (jointToDisplay.sinovite) {
          case 0:
            result = "Assente/bassa";
          case 1:
            result = "Media";
          case 2:
            result = "Grave";
        }

        return result;
      case "cartilagine":
        switch (jointToDisplay.cartilagine) {
          case 0:
            result = "Normale";
          case 1:
            result = "Perdita <25%";
          case 2:
            result = "Perdita <50%";
          case 3:
            result = "Perdita <50%";
          case 4:
            result = "Perdita totale";
        }
        return result;
      case "subchondral":
        switch (jointToDisplay.subchondral_bone) {
          case 0:
            result = "Normale";
          case 1:
            result = "Irregolarità medie";
          case 2:
            result = "Osteofite";
        }
        return result;
      case "distension":
        switch (jointToDisplay.distension) {
          case "absent":
            result = "Assente";
          case "minimum":
            result = "Leggera";
          case "moderate":
            result = "Media";
          case "severe":
            result = "Grave";
        }
        return result;
    }
  };

  return (
    <>
      <h4>
        {jointToDisplay.name}
        {jointToDisplay.side}
      </h4>

      <p>Index Joint: {jointToDisplay.index_joint ? "Sì" : "No"}</p>
      <p>
        Difficoltà di movimento:{" "}
        {jointToDisplay.difficulty_moving ? "Sì" : "No"}
      </p>
      <p>Dolore: {jointToDisplay.pain ? "Sì" : "No"}</p>
      <p>Ultimo sanguinamento: {jointToDisplay.last_bleeding}</p>
      <p>Sinovite: {valueResolver("sinovite")}</p>
      <p>Cartilagine: {valueResolver("cartilagine")}</p>
      <p>Osso subcondrale: {valueResolver("subchondral")}</p>
      <p>Distension: {valueResolver("distension")}</p>
      <p>Causa distensione: {jointToDisplay.blood}</p>
      <p>Ecografie:</p>
      {/* {jointToDisplay.selectedImages.map((item, index) => (
          <img
            key={index}
            src={item.link}
            style={{ width: "100%", margin: 5 }}
          />
        ))} */}
    </>
  );
}
