import question from "./../../../img/icon/question.png";

import response from "../../../img/icon/hydrotherapy.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "dayjs/locale/it";
import Slider from "@mui/material/Slider";
import { NewVisitContext } from "../../../Model/NewVisitContext";
import { useContext } from "react";
import { useState } from "react";
import { format } from "date-fns";

export default function Treatment(props) {
  const [showDialog, setShowDialog] = useState(false);
  const { newVisit } = useContext(NewVisitContext);
  return (
    <div
      style={{
        width: "65vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "0.5px solid #56AEC9",
        boxShadow: "2px 2px 4px #56AEC9",
        borderRadius: "20px",
        gap: "1vh",
        padding: "1%",
        background: "#edfdff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label style={{ fontSize: 20 }}>
          <img src={response} width={45} alt="" />
          Risposta al trattamento
        </label>
        <button className="btn btn-info" onClick={() => setShowDialog(true)}>
          <img
            src={question}
            alt="question mark"
            width={25}
            style={{ filter: "invert(100%" }}
          />
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          gap: 10,
          alignItems: "center",
        }}
      >
        <div>
          {newVisit.previousVisit.id === -1 ? (
            <label style={{ fontSize: 18 }}>
              Visita precedente impostata manualmente del:{" "}
              {format(newVisit.previousVisit.date, "dd-MM-y")}
            </label>
          ) : (
            <label style={{ fontSize: 18 }}>Visita precedente:</label>
          )}
        </div>
        {newVisit.previousVisit.id !== -1 && (
          <div>{props.visitButtonResolver()}</div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          gap: "2vw",
          width: "95%",
        }}
      >
        <div>
          <label style={{ fontSize: 18 }}>Risposta al trattamento</label>
        </div>
        <Slider
          style={{ width: "70%" }}
          name="treatment response"
          marks={props.treatmentResponses}
          min={1}
          max={props.treatmentResponses.length}
          step={1}
          value={props.treatment}
          onChange={props.onTreatmentChange}
        />
      </div>
      {showDialog && (
        <Dialog
          open={showDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <img src={question} width={20} />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {props.treatmentResponses.map((e) => (
                <p>
                  <strong>{e.label}:</strong> {e.description}
                </p>
              ))}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-primary"
              onClick={() => setShowDialog(false)}
              autoFocus
            >
              Capito
            </button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
