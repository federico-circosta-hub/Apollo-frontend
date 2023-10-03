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

  return (
    <div style={styles.container} ref={ref}>
      <h1>HEAD-US score</h1>
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
              border: "0.5px solid lightgray",
              alignSelf: "flex-start",
              padding: 5,
            }}
          >
            <p style={styles.text}>
              Patient: {patient.name} {patient.surname}
            </p>
            <p style={styles.text}>
              Birthdate: {format(patient.birthdate, "dd - MM - y")}
            </p>
            <p style={styles.text}>
              Age: {new Date().getFullYear() - patient.birthdate.getFullYear()}
            </p>
            <p style={styles.text}>Gender: {patient.gender}</p>
            <p style={styles.text}>Weight: {patient.weight}</p>
            <p style={styles.text}>Height: {patient.height}</p>
            <p style={styles.text}>
              Prothesis:{" "}
              {patient.prothesis !== null
                ? patient.prothesis.toString()
                : "Nessuna"}
            </p>
          </div>
        </div>
        <div>
          <h5>Visit date: {format(visit.visitDate, "dd-MM-y")}</h5>
        </div>
      </div>
      <div>
        <p style={styles.link}>coming soon... </p>
      </div>
    </div>
  );
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: "5%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    background: "white",
    overflowX: "scroll",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 24,
  },
  text: {
    fontSize: 12,
  },
  link: {
    fontSize: 12,
  },
});

export default MyDocument;
