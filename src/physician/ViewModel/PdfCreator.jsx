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
import nameChecker from "./NameChecker";

const MyDocument = forwardRef((props, ref) => {
  const visit = props.visit;
  const patient = props.patient;

  const getResult = (field, fieldValue, joint, side) => {
    switch (field) {
      case "sinovite":
        return visit.getJointWithoutMod(joint, side)
          ? visit.getJointWithoutMod(joint, side).sinovite === fieldValue
            ? fieldValue
            : "0"
          : "0";
      case "cartilagine":
        return visit.getJointWithoutMod(joint, side)
          ? visit.getJointWithoutMod(joint, side).cartilagine === fieldValue
            ? fieldValue
            : "0"
          : "0";
      case "subchondral":
        return visit.getJointWithoutMod(joint, side)
          ? visit.getJointWithoutMod(joint, side).subchondral_bone ===
            fieldValue
            ? fieldValue
            : "0"
          : "0";
      case "totalJointScore":
        return visit.getJointWithoutMod(joint, side)
          ? visit.getJointWithoutMod(joint, side).subchondral_bone +
              visit.getJointWithoutMod(joint, side).cartilagine +
              visit.getJointWithoutMod(joint, side).sinovite
          : "0";
      default:
        return "0";
    }
  };

  return (
    <div style={styles.container} ref={ref}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* <p style={styles.text}>HEAD-US protocol</p> */}
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <p style={styles.text}>
              Paziente: {nameChecker(patient.name)}{" "}
              {nameChecker(patient.surname)} (
              {format(new Date(patient.birthdate), "dd-MM-y")}){", "}
              Data della visita: {format(visit.visitDate, "dd-MM-y")}
            </p>
          </div>
          <p style={styles.text}>
            Valutazione ecografica osteoarticolare di gomiti, ginocchia e
            caviglie nell'artropatia emofilica, protocollo HEAD-US (Martinoli C
            et al 2013). Indagine eseguita mediante Philips Affiniti 50, sonda
            lineare 5-12 MHz
          </p>
          <p style={styles.text}>
            Diagnosi:{" "}
            {patient.hemophilia ? (
              <>
                {" "}
                emofilia: {patient.hemophilia}, gravità:{" "}
                {[0, 1, 2].includes(patient.hemophilia_gravity)
                  ? patient.hemophilia_gravity === 0
                    ? "Lieve"
                    : patient.hemophilia_gravity === 1
                    ? "Moderata"
                    : patient.hemophilia_gravity === 2
                    ? "Grave"
                    : "N/A"
                  : "N/A"}
              </>
            ) : (
              ""
            )}
          </p>
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
          <tbody>
            <tr>
              <td></td>
              <td style={styles.th}>Valore </td>
              <td style={styles.th}>Gom DX</td>
              <td style={styles.th}>Gin SX</td>
              <td style={styles.th}>Gin DX</td>
              <td style={styles.th}>Gin SX</td>
              <td style={styles.th}>Cav DX</td>
              <td style={styles.th}>Cav SX</td>
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
              <td style={styles.totalScore}>{visit.headUsTotalScore()}</td>
              <td style={styles.totalJointScore}>
                {getResult("totalJointScore", 0, "elbow", "RIGHT")}
              </td>
              <td style={styles.totalJointScore}>
                {getResult("totalJointScore", 0, "elbow", "LEFT")}
              </td>
              <td style={styles.totalJointScore}>
                {getResult("totalJointScore", 0, "knee", "RIGHT")}
              </td>
              <td style={styles.totalJointScore}>
                {getResult("totalJointScore", 0, "knee", "LEFT")}
              </td>
              <td style={styles.totalJointScore}>
                {getResult("totalJointScore", 0, "ankle", "RIGHT")}
              </td>
              <td style={styles.totalJointScore}>
                {getResult("totalJointScore", 0, "ankle", "LEFT")}
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
    maxWidth: "20cm",
    padding: "0.5cm",
    height: "28cm",
    display: "flex",
    flexDirection: "column",
    background: "white",
    overflowX: "scroll",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 14,
  },
  text: {
    fontSize: 10,
  },
  link: {
    fontSize: 10,
  },

  th: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: 600,
    border: "0.1cm solid lightgray",
  },

  keys: {
    fontSize: 10,
    textAlign: "left",
    border: "1px solid lightgray",
  },

  descriptions: {
    fontSize: 10,
    textAlign: "center",
    border: "1px solid lightgray",
  },
  values: {
    fontSize: 10,
    textAlign: "center",
    border: "1px solid lightgray",
  },
  result: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: 550,
    border: "1px solid lightgray",
  },
  totalJointScore: {
    fontSize: 13,
    textAlign: "center",
    fontWeight: 600,
    border: "1px solid lightgray",
  },
  totalScore: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: 700,
    border: "1px solid lightgray",
  },
});

export default MyDocument;
