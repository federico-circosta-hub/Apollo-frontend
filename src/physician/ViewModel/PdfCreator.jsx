import { React, forwardRef } from "react";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import format from "date-fns/format";

const MyDocument = forwardRef((props, ref) => {
  const visit = props.visit;
  const patient = props.patient;

  const getResult = (field, fieldValue, joint, side) => {
    switch (field) {
      case "sinovite":
        return visit.getJointWithoutMod(joint, side)
          ? visit.getJointWithoutMod(joint, side).synovitis === fieldValue
            ? fieldValue
            : "-"
          : "-";
      case "cartilagine":
        return visit.getJointWithoutMod(joint, side)
          ? visit.getJointWithoutMod(joint, side).cartilage === fieldValue
            ? fieldValue
            : "-"
          : "-";
      case "subchondral":
        return visit.getJointWithoutMod(joint, side)
          ? visit.getJointWithoutMod(joint, side).subchondralBone === fieldValue
            ? fieldValue
            : "-"
          : "-";
      case "totalScore":
        return visit.getJointWithoutMod(joint, side)
          ? visit.getJointWithoutMod(joint, side).subchondralBone +
              visit.getJointWithoutMod(joint, side).cartilage +
              visit.getJointWithoutMod(joint, side).synovitis
          : "N/A";
      default:
        return "N/A";
    }
  };

  return (
    <div style={styles.container} ref={ref}>
      <h2>HEAD-US protocol</h2>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                border: "0.5px solid lightgray",
                borderRadius: 10,
                width: "8cm",
                padding: 2,
                marginBottom: 5,
              }}
            >
              <p style={styles.text}>
                Paziente: {patient.name} {patient.surname}
              </p>
              <p style={styles.text}>
                Data di nascita:{" "}
                {format(new Date(patient.birthdate), "dd-MM-y")}
              </p>
            </div>
            <div>
              <h5>Data della visita: {format(visit.visitDate, "dd-MM-y")}</h5>
            </div>
          </div>
          <p style={styles.text}>
            Valutazione ecografica osteoarticolare di gomiti, ginocchia e
            caviglie nell'artropatia emofilica, protoccolo HEAD-US (Martinoli C
            et al 2013)
          </p>
          <p style={styles.text}>
            Indagine eseguita mediante Philips Affiniti 50, sonda lineare 5-12
            MHz
          </p>
          <p style={styles.text}>Diagnosi:</p>
          <p style={styles.text}>
            Index joint(s):{visit.getIndexJoints().toString()}
          </p>
        </div>
      </div>
      <div>
        <table
          style={{
            tableLayout: "fixed",
            width: "19cm",
            fontSize: 12,
            border: "1px solid lightgray",
            height: "20cm",
            borderRadius: 5,
            padding: 3,
          }}
        >
          <colgroup>
            <col style={{ width: "7cm" }} />
            <col style={{ width: "1.7cm" }} />
            <col style={{ width: "1.7cm" }} />
            <col style={{ width: "1.7cm" }} />
            <col style={{ width: "1.7cm" }} />
            <col style={{ width: "1.7cm" }} />
            <col style={{ width: "1.7cm" }} />
            <col style={{ width: "1.7cm" }} />
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th colspan="2" style={styles.th}>
                Gomito
              </th>
              <th colspan="2" style={styles.th}>
                Ginocchio
              </th>
              <th colspan="2" style={styles.th}>
                Caviglia
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td style={styles.th}>Valore </td>
              <td style={styles.th}>DX</td>
              <td style={styles.th}>SX</td>
              <td style={styles.th}>DX</td>
              <td style={styles.th}>SX</td>
              <td style={styles.th}>DX</td>
              <td style={styles.th}>SX</td>
            </tr>
            <tr>
              <td style={styles.th}>Sinovite</td>
              <td></td>
              <td colspan="2"></td>
              <td colspan="2"></td>
              <td colspan="2"></td>
            </tr>
            <tr>
              <td style={styles.keys}>Assente / minima</td>
              <td style={styles.values}>0</td>
              <td style={styles.result}>
                {getResult("sinovite", 0, "elbow", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 0, "elbow", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 0, "knee", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 0, "knee", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 0, "ankle", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 0, "ankle", "LEFT")}
              </td>
            </tr>
            <tr>
              <td style={styles.keys}>Media / moderata</td>
              <td style={styles.values}>1</td>
              <td style={styles.result}>
                {getResult("sinovite", 1, "elbow", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 1, "elbow", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 1, "knee", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 1, "knee", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 1, "ankle", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 1, "ankle", "LEFT")}
              </td>
            </tr>
            <tr>
              <td style={styles.keys}>Grave</td>
              <td style={styles.values}>2</td>
              <td style={styles.result}>
                {getResult("sinovite", 2, "elbow", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 2, "elbow", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 2, "knee", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 2, "knee", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 2, "ankle", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("sinovite", 2, "ankle", "LEFT")}
              </td>
            </tr>
            <tr>
              <td style={styles.th}>Cartilagine articolare</td>
              <td></td>
              <td colspan="2" style={styles.descriptions}>
                Aspetto anteriore
                <br />
                epifisi omerale distale
              </td>
              <td colspan="2" style={styles.descriptions}>
                Troclea femorale,
                <br />
                osteofiti mediali
              </td>
              <td colspan="2" style={styles.descriptions}>
                Aspetto anteriore troclea astargica
              </td>
            </tr>
            <tr>
              <td style={styles.keys}>Normale</td>
              <td style={styles.values}>0</td>
              <td style={styles.result}>
                {getResult("cartilagine", 0, "elbow", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 0, "elbow", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 0, "knee", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 0, "knee", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 0, "ankle", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 0, "ankle", "LEFT")}
              </td>
            </tr>
            <tr>
              <td style={styles.keys}>
                Perdita focale parziale/completa che coinvolge &lt;25% della
                superficie target
              </td>
              <td style={styles.values}>1</td>
              <td style={styles.result}>
                {getResult("cartilagine", 1, "elbow", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 1, "elbow", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 1, "knee", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 1, "knee", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 1, "ankle", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 1, "ankle", "LEFT")}
              </td>
            </tr>
            <tr>
              <td style={styles.keys}>
                Perdita focale parziale/completa che coinvolge ≤50% della
                superficie target
              </td>
              <td style={styles.values}>2</td>
              <td style={styles.result}>
                {getResult("cartilagine", 2, "elbow", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 2, "elbow", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 2, "knee", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 2, "knee", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 2, "ankle", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 2, "ankle", "LEFT")}
              </td>
            </tr>
            <tr>
              <td style={styles.keys}>
                Perdita focale parziale/completa che coinvolge &gt;50%% della
                superficie target
              </td>
              <td style={styles.values}>3</td>
              <td style={styles.result}>
                {getResult("cartilagine", 3, "elbow", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 3, "elbow", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 3, "knee", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 3, "knee", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 3, "ankle", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 3, "ankle", "LEFT")}
              </td>
            </tr>
            <tr>
              <td style={styles.keys}>
                Completa distruzione o assente visualizzazione sulla superficie
                ossea target
              </td>
              <td style={styles.values}>4</td>
              <td style={styles.result}>
                {getResult("cartilagine", 4, "elbow", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 4, "elbow", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 4, "knee", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 4, "knee", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 4, "ankle", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("cartilagine", 4, "ankle", "LEFT")}
              </td>
            </tr>
            <tr>
              <td style={styles.th}>Osso subcondrale</td>
              <td></td>
              <td colspan="2"></td>
              <td colspan="2"></td>
              <td colspan="2"></td>
            </tr>
            <tr>
              <td style={styles.keys}>Normale</td>
              <td style={styles.values}>0</td>
              <td style={styles.result}>
                {getResult("subchondral", 0, "elbow", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 0, "elbow", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 0, "knee", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 0, "knee", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 0, "ankle", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 0, "ankle", "LEFT")}
              </td>
            </tr>
            <tr>
              <td style={styles.keys}>
                Irregolarità lievi con o senza iniziali osteofiti attorno
                all'articolazione
              </td>
              <td style={styles.values}>1</td>
              <td style={styles.result}>
                {getResult("subchondral", 1, "elbow", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 1, "elbow", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 1, "knee", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 1, "knee", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 1, "ankle", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 1, "ankle", "LEFT")}
              </td>
            </tr>
            <tr>
              <td style={styles.keys}>
                Sovvertito con o senza erosioni e presenza di osteofiti
                prominenti attorno all'articolazione
              </td>
              <td style={styles.values}>2</td>
              <td style={styles.result}>
                {getResult("subchondral", 2, "elbow", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 2, "elbow", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 2, "knee", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 2, "knee", "LEFT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 2, "ankle", "RIGHT")}
              </td>
              <td style={styles.result}>
                {getResult("subchondral", 2, "ankle", "LEFT")}
              </td>
            </tr>
            <tr>
              <td style={styles.th}>Total score</td>
              <td style={styles.values}>0</td>
              <td style={styles.totalScore}>
                {getResult("totalScore", 0, "elbow", "RIGHT")}
              </td>
              <td style={styles.totalScore}>
                {getResult("totalScore", 0, "elbow", "LEFT")}
              </td>
              <td style={styles.totalScore}>
                {getResult("totalScore", 0, "knee", "RIGHT")}
              </td>
              <td style={styles.totalScore}>
                {getResult("totalScore", 0, "knee", "LEFT")}
              </td>
              <td style={styles.totalScore}>
                {getResult("totalScore", 0, "ankle", "RIGHT")}
              </td>
              <td style={styles.totalScore}>
                {getResult("totalScore", 0, "ankle", "LEFT")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});

const styles = StyleSheet.create({
  container: {
    maxWidth: "21cm",
    padding: "0.5cm",
    height: "29.6cm",
    display: "flex",
    flexDirection: "column",
    background: "white",
    overflowX: "scroll",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 20,
  },
  text: {
    fontSize: 12,
  },
  link: {
    fontSize: 12,
  },

  th: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: 600,
    border: "0.1cm solid lightgray",
  },

  keys: {
    fontSize: 12,
    textAlign: "left",
    border: "1px solid lightgray",
  },

  descriptions: {
    fontSize: 12,
    textAlign: "center",
    border: "1px solid lightgray",
  },
  values: {
    fontSize: 12,
    textAlign: "center",
    border: "1px solid lightgray",
  },
  result: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: 550,
    border: "1px solid lightgray",
  },
  totalScore: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: 600,
    border: "1px solid lightgray",
  },
});

export default MyDocument;
