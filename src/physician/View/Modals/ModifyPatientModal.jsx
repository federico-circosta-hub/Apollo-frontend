import { Modal, Button } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";
import PatientModel from "../../Model/PatientModel";
import { useState } from "react";
import "react-day-picker/dist/style.css";
import format from "date-fns/format";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/it";

export default function ModifyPatientModal(props) {
  const [patient, setPatient] = useState(
    new PatientModel(
      props.patient.name,
      props.patient.surname,
      props.patient.cf,
      props.patient.birthdate,
      props.patient.gender,
      props.patient.height,
      props.patient.weight
    )
  );
  const [disabled, setDisabled] = useState(false);
  const [sendingButton, setSendingButton] = useState("Conferma");
  const [showAlert, setShowAlert] = useState(null);
  const [networkError, setNetworkError] = useState(null);

  const modifyCF = (event) => {
    let p = patient.clone();
    p.setCF(event.target.value.toUpperCase());
    setPatient(p);
  };

  const modifyPatientName = (event) => {
    let p = patient.clone();
    if (event.target.id === "name") {
      p.setName(event.target.value);
    } else {
      p.setSurname(event.target.value);
    }
    setPatient(p);
  };

  const modifyPatientDimensions = (event) => {
    let p = patient.clone();
    if (event.target.id === "weight") {
      p.setWeight(event.target.value);
    } else if (event.target.id === "height") {
      p.setHeight(event.target.value);
    }
    setPatient(p);
  };

  const modifyPatientBirthdate = (date) => {
    if (isNaN(date.$d.getTime())) return;
    let p = patient.clone();
    p.setBirthdate(format(date.$d, "y-MM-dd"));
    setPatient(p);
  };

  const handleGender = (event) => {
    let p = patient.clone();
    p.setGender(event.target.value);
    setPatient(p);
  };

  const handleModify = async () => {
    setSendingButton("Inviando");
    setDisabled(true);
    try {
      await patient.modifyPatient(props.patient.pid);
      setShowAlert(true);
      props.setPatient(null);
      props.clear();
      props.setSearchInput("");
      props.getPatients();
    } catch (err) {
      setNetworkError(err);
      setShowAlert(false);
    } finally {
      setDisabled(false);
      setSendingButton("Conferma");
    }
  };

  return (
    <Modal show={props.patient !== null} animation={true}>
      <Alert severity="info" variant="filled" style={{ width: "100%" }}>
        <AlertTitle>Confermare modifica paziente</AlertTitle>
      </Alert>

      <Modal.Body style={{ background: "whitesmoke" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
          <div>
            <input
              className="form-control"
              style={{ fontSize: 20, background: "white" }}
              id="name"
              type="text"
              placeholder="Nome..."
              value={patient.name}
              onChange={(e) => modifyPatientName(e)}
            />
          </div>
          <div>
            <input
              className="form-control"
              style={{ fontSize: 20, background: "white" }}
              id="surname"
              type="text"
              placeholder="Cognome..."
              value={patient.surname}
              onChange={(e) => modifyPatientName(e)}
            />
          </div>
          <div>
            <input
              className="form-control"
              style={{
                fontSize: 20,
                background: props.patient.cf !== null ? "whitesmoke" : "white",
              }}
              id="cf"
              disabled={
                props.patient.cf !== null ? props.patient.cf.length > 0 : false
              }
              type="text"
              placeholder="CF..."
              value={patient.CF}
              onChange={(e) => modifyCF(e)}
            />
          </div>
          <div>
            <label style={{ fontSize: 20 }}>Data di nascita:</label>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
              <DatePicker
                openTo="year"
                views={["year", "month", "day"]}
                sx={{ background: "white" }}
                label={
                  patient.birthdate
                    ? format(new Date(patient.birthdate), "dd-MM-y")
                    : ""
                }
                slotProps={{ textField: { size: "small" } }}
                onChange={modifyPatientBirthdate}
              />
            </LocalizationProvider>
          </div>
          <div>
            <FormControl style={{ background: "white" }} fullWidth>
              <InputLabel id="demo-simple-select-label">Genere</InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={patient.gender}
                label="Sesso"
                onChange={handleGender}
              >
                <MenuItem value="M">Maschio</MenuItem>
                <MenuItem value="F">Femmina</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ display: "flex" }}>
            <span
              style={{ flex: 1.5, background: "whitesmoke" }}
              class="input-group-text"
              id="basic-addon1"
            >
              Altezza cm
            </span>
            <input
              className="form-control"
              style={{ fontSize: 20, background: "white", flex: 5 }}
              id="height"
              type="number"
              placeholder="Altezza..."
              value={patient.height}
              onChange={modifyPatientDimensions}
            />
          </div>
          <div style={{ display: "flex" }}>
            <span
              style={{ flex: 1.5, background: "whitesmoke" }}
              class="input-group-text"
              id="basic-addon1"
            >
              Peso kg
            </span>
            <input
              className="form-control"
              style={{ fontSize: 20, background: "white", flex: 5 }}
              id="weight"
              type="number"
              placeholder="Peso..."
              value={patient.weight}
              onChange={modifyPatientDimensions}
            />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer style={{ background: "whitesmoke" }}>
        {showAlert === false && (
          <Alert
            style={{ width: "100%" }}
            severity="warning"
            onClose={() => {
              props.setShowModal(false);
              props.setShowAlert(null);
            }}
            variant="filled"
          >
            <AlertTitle>Errore nella richiesta</AlertTitle>
          </Alert>
        )}
        <Button
          variant="secondary"
          onClick={(e) => {
            props.setPatient(null);
          }}
          style={{ fontSize: 24 }}
        >
          Annulla
        </Button>
        <Button
          disabled={disabled || !patient.checkFields()}
          onClick={(e) => {
            handleModify();
          }}
          variant="success"
          style={{ fontSize: 24 }}
        >
          {sendingButton}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
