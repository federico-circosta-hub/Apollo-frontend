import { useContext, useEffect, useState } from "react";
import { CircularProgress, Switch } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import format from "date-fns/format";
import Slider from "@mui/material/Slider";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import { RefreshButton } from "./RefreshButton";
import { PatientContext } from "../../Model/PatientContext";
import dayjs from "dayjs";
import { NewVisitContext } from "../../Model/NewVisitContext";

export default function JointVisitQuestions(props) {
  const { selectedPatient } = useContext(PatientContext);
  const { newVisit } = useContext(NewVisitContext);

  const distensionValues = [
    { value: 0, label: "Assente", db: "absent" },
    { value: 1, label: "Leggera", db: "minimum" },
    { value: 2, label: "Media", db: "moderate" },
    { value: 3, label: "Grave", db: "severe" },
  ];

  const [disableDistensionCauses, setDisableDistensionCauses] = useState(
    props.joint.distension == "absent" ||
      props.joint.distension == "minimum" ||
      props.joint.distension == undefined
      ? true
      : false
  );
  const [distensionCauseValues, setDistensionCauseValues] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(false);
  const [networkError, setNetworkError] = useState(null);

  const [prothesisDisabled, setProthesisDisabled] = useState(false);
  const [PTstatus, setPTstatus] = useState(props.joint.prothesis);

  useEffect(() => {
    getDistensionCauseValuesFromServer();
    !props.joint.modifiedIndex && getLastReport();
  }, []);

  const getDistensionCauseValuesFromServer = async () => {
    setLoadingOptions(true);
    setDistensionCauseValues([]);
    setNetworkError(null);
    try {
      const dcv = await CommunicationController.get("distensionReason", {});
      setDistensionCauseValues(dcv);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingOptions(false);
    }
  };

  const getLastReport = async () => {
    props.setNetworkErrorIndex(null);
    setLoadingIndex(true);
    let params = {
      name: props.joint.jointName,
      side: props.joint.side,
      patient: selectedPatient.pid,
      date: format(newVisit.visitDate, "y-MM-d"),
    };
    try {
      const j = await CommunicationController.get("joint/lastReport", params);
      props.joint.setIndexJoint(j.index_joint);
      props.joint.setProthesis(j.prothesis);
      setProthesisDisabled(j.prothesis);
      props.joint.setModifiedIndex(true);
      props.joint.setLastReport(j);
      props.joint.setSynovitis(j.sinovite);
      props.joint.setPowerDoppler(j.power_doppler);
      props.joint.setCartilage(j.cartilagine);
      props.joint.setSubchondralBone(j.subchondral_bone);
    } catch (err) {
      if (!(err.response && err.response.status === 404))
        props.setNetworkErrorIndex(err || "Errore inatteso");
      console.log(err);
    } finally {
      setLoadingIndex(false);
    }
  };

  const modifyJoint = (e, field) => {
    let b = e.target.checked;
    switch (field) {
      case "index":
        return props.joint.setIndexJoint(b);
      case "difficulty":
        return props.joint.setJointDiffuculty(b);
      case "pain":
        return props.joint.setPain(b);
      case "prothesis":
        props.joint.setProthesis(b);
        setPTstatus(b);
        return;
    }
    props.setJoint(props.joint);
  };

  const lastBleed = (d) => {
    props.joint.setLastBleed(d);
    props.setJoint(props.joint);
  };

  const modifyPatientSliders = (e) => {
    switch (e.target.name) {
      case "synovitis":
        props.joint.setSynovitis(e.target.value);
        return props.setJoint(props.joint.clone());
      case "power":
        props.joint.setPowerDoppler(e.target.value);
        return props.setJoint(props.joint.clone());
      case "cartilage":
        props.joint.setCartilage(e.target.value);
        return props.setJoint(props.joint.clone());
      case "subchondral":
        props.joint.setSubchondralBone(e.target.value);
        return props.setJoint(props.joint.clone());
      case "distension":
        let distension = distensionValues.find(
          (element) => element.value == e.target.value
        );
        if (distension.label == "Media" || distension.label == "Grave") {
          setDisableDistensionCauses(false);
        } else {
          setDisableDistensionCauses(true);
          props.joint.setDistensionCause(null);
        }
        props.joint.setDistension(distension.db);
        return props.setJoint(props.joint.clone());
    }
  };

  const valueResolver = (s) => {
    let n = 0;
    switch (s) {
      case "distension":
        if (props.joint.distension) {
          let distension = distensionValues.find(
            (element) => element.db == props.joint.distension
          );
          n = distension.value;
        }
        return n;
    }
    return n;
  };

  const displayDistensionCauses = () => {
    return (
      distensionCauseValues &&
      distensionCauseValues.map((element) => (
        <MenuItem value={element.name}>
          {props.joint.lastReport &&
          props.joint.lastReport.blood === element.id ? (
            <>(*) {element.name}</>
          ) : (
            element.name
          )}
        </MenuItem>
      ))
    );
  };

  const displayText = (value) => {
    return value === 1 ? "ciao" : "addio";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        paddingLeft: "1%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          width: "100%",
          border: "1px solid #dcdcdc",
          boxShadow: "1px 2px 6px #dcdcdc",
          borderRadius: "15px",
          padding: 10,
          height: "16vh",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            width: "100%",
            alignItems: "center",
          }}
        >
          <label style={{ fontSize: 20, flex: 1 }}>Index Joint</label>
          <div style={{ flex: 1 }}>
            {loadingIndex ? (
              <CircularProgress />
            ) : (
              <Switch
                defaultChecked={props.joint.indexJoint}
                onChange={(e) => modifyJoint(e, "index")}
              />
            )}
          </div>
          <label style={{ fontSize: 20, flex: 2 }}>Difficoltà movimento</label>
          <div style={{ flex: 1.25 }}>
            <Switch
              defaultChecked={props.joint.jointDifficulty}
              onChange={(e) => modifyJoint(e, "difficulty")}
            />
          </div>
          <label style={{ fontSize: 20, flex: 0.5 }}>Protesi</label>
          <div style={{ flex: 1 }}>
            {loadingIndex ? (
              <CircularProgress />
            ) : props.networkErrorIndex ? (
              <RefreshButton onClick={getLastReport} />
            ) : (
              <Switch
                disabled={prothesisDisabled}
                defaultChecked={props.joint.prothesis}
                onChange={(e) => modifyJoint(e, "prothesis")}
              />
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "start",
            paddingBottom: "10px",
            width: "100%",
            alignItems: "center",
          }}
        >
          <label style={{ fontSize: 20, flex: 1 }}>Dolore</label>
          <div style={{ flex: 1 }}>
            <Switch
              defaultChecked={props.joint.pain}
              onChange={(e) => modifyJoint(e, "pain")}
            />
          </div>

          <label style={{ fontSize: 20, flex: 2 }}>Ultimo sanguinamento</label>
          <div style={{ flex: 1.5 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
              <DatePicker
                openTo="year"
                views={["year", "month", "day"]}
                maxDate={dayjs(newVisit.visitDate)}
                slotProps={{ textField: { size: "small" } }}
                label={
                  props.joint.lastBleed
                    ? format(props.joint.lastBleed, "dd-MM-y")
                    : "DD-MM-YYYY"
                }
                onChange={(newValue) =>
                  !isNaN(newValue.$d.getTime()) && lastBleed(newValue.$d)
                }
              />
            </LocalizationProvider>
          </div>
          <div style={{ flex: 1.25 }}></div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          width: "100%",
          border: "1px solid #dcdcdc",
          boxShadow: "1px 2px 6px #dcdcdc",
          borderRadius: "15px",
          padding: 10,
          height: "43vh",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            width: "96%",
            paddingRight: "1vw",
          }}
        >
          <label style={{ fontSize: 20, flex: "1" }}>Sinovite</label>

          <div style={{ flex: "2.5" }}>
            <Slider
              name="synovitis"
              disabled={false}
              marks={[
                {
                  value: 0,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.sinovite === 0
                      ? "(*) Assente/bassa"
                      : "Assente/bassa",
                },
                {
                  value: 1,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.sinovite === 1
                      ? "(*) Media"
                      : "Media",
                },
                {
                  value: 2,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.sinovite === 2
                      ? "(*) Grave"
                      : "Grave",
                },
              ]}
              min={0}
              max={2}
              step={1}
              value={props.joint.sinovite}
              className="MuiSlider-markLabel"
              onChange={(e) => modifyPatientSliders(e)}
              valueLabelDisplay="auto"
              getAriaValueText={displayText}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            width: "96%",
            paddingRight: "1vw",
          }}
        >
          <label style={{ fontSize: 20, flex: "1" }}>Power doppler</label>

          <div style={{ flex: "2.5" }}>
            <Slider
              name="power"
              disabled={false}
              marks={[
                {
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.power_doppler === 0
                      ? "(*) Grado 0"
                      : "Grado 0",
                  value: 0,
                },
                {
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.power_doppler === 1
                      ? "(*) Grado I"
                      : "Grado I",
                  value: 1,
                },
                {
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.power_doppler === 2
                      ? "(*) Grado II"
                      : "Grado II",
                  value: 2,
                },
              ]}
              min={0}
              max={2}
              step={1}
              value={props.joint.powerDoppler}
              className="MuiSlider-markLabel"
              onChange={(e) => modifyPatientSliders(e)}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            width: "96%",
            paddingRight: "1vw",
          }}
        >
          <label style={{ fontSize: 20, flex: "1" }}>Cartilagine</label>

          <div style={{ flex: "2.5" }}>
            <Slider
              name="cartilage"
              disabled={PTstatus || prothesisDisabled}
              marks={[
                {
                  value: 0,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.cartilagine === 0
                      ? "(*) Normale"
                      : "Normale",
                },
                {
                  value: 1,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.cartilagine === 1
                      ? "(*) Perdita <25%"
                      : "Perdita <25%",
                },
                {
                  value: 2,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.cartilagine === 2
                      ? "(*) Perdita <50%"
                      : "Perdita <50%",
                },
                {
                  value: 3,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.cartilagine === 3
                      ? "(*) Perdita >50%"
                      : "Perdita >50%",
                },
                {
                  value: 4,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.cartilagine === 4
                      ? "(*) Perdita totale"
                      : "Perdita totale",
                },
              ]}
              min={0}
              max={4}
              step={1}
              value={props.joint.cartilagine}
              onChange={(e) => modifyPatientSliders(e)}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            width: "96%",
            paddingRight: "1vw",
          }}
        >
          <label style={{ fontSize: 20, flex: "1" }}>Osso subcondrale</label>

          <div style={{ flex: "2.5" }}>
            <Slider
              name="subchondral"
              disabled={PTstatus || prothesisDisabled}
              marks={[
                {
                  value: 0,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.subchondral_bone === 0
                      ? "(*) Normale"
                      : "Normale",
                },
                {
                  value: 1,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.subchondral_bone === 1
                      ? "(*) Irregolarità medie"
                      : "Irregolarità medie",
                },
                {
                  value: 2,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.subchondral_bone === 2
                      ? "(*) Osteofite"
                      : "Osteofite",
                },
              ]}
              min={0}
              max={2}
              step={1}
              value={props.joint.subchondral_bone}
              onChange={(e) => modifyPatientSliders(e)}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          width: "100%",
          border: "1px solid #dcdcdc",
          boxShadow: "1px 2px 6px #dcdcdc",
          borderRadius: "15px",
          padding: 10,
          height: "20vh",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            width: "96%",
            paddingRight: "1vw",
          }}
        >
          <label style={{ fontSize: 20, flex: "1" }}>Livello distensione</label>

          <div style={{ flex: "2.5" }}>
            <Slider
              name="distension"
              disabled={false}
              marks={[
                {
                  value: 0,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.distension_amount === "absent"
                      ? "(*) Assente"
                      : "Assente",
                  db: "absent",
                },
                {
                  value: 1,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.distension_amount === "minimum"
                      ? "(*) Leggera"
                      : "Leggera",
                  db: "minimum",
                },
                {
                  value: 2,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.distension_amount === "moderate"
                      ? "(*) Media"
                      : "Media",
                  db: "moderate",
                },
                {
                  value: 3,
                  label:
                    props.joint.lastReport &&
                    props.joint.lastReport.distension_amount === "severe"
                      ? "(*) Grave"
                      : "Grave",
                  db: "severe",
                },
              ]}
              min={0}
              max={3}
              step={1}
              defaultValue={() => valueResolver("distension")}
              onChange={(e) => modifyPatientSliders(e)}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "68%",
          }}
        >
          {networkError ? (
            <>
              Errore nell'ottenere le cause di distensione
              <RefreshButton
                onClick={getDistensionCauseValuesFromServer}
                loading={loadingOptions}
              />
            </>
          ) : (
            <FormControl
              fullWidth
              disabled={disableDistensionCauses}
              size="small"
            >
              <InputLabel
                id="demo-simple-select-label"
                style={{ width: "100%" }}
                size="small"
              >
                La più probabile causa di distensione?
              </InputLabel>
              <Select
                value={
                  props.joint.distensionCause &&
                  distensionCauseValues.length !== 0
                    ? distensionCauseValues.filter(
                        (d) => d.id === props.joint.distensionCause
                      )[0].name
                    : ""
                }
                style={{ fontSize: 20 }}
                id="demo-simple-select"
                label="La più probabile causa di d...?"
                onChange={(e) => {
                  props.joint.setDistensionCause(
                    distensionCauseValues.filter(
                      (d) => d.name === e.target.value
                    )[0].id
                  );
                  props.setJoint(props.joint.clone());
                }}
              >
                {displayDistensionCauses()}
              </Select>
            </FormControl>
          )}
        </div>
      </div>

      {props.joint.lastReport && (
        <div
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <p>
            (*) Valore di riferimento dell'ultima visita (
            {format(new Date(props.joint.lastReport.visit_date), "dd-MM-y")})
          </p>
        </div>
      )}
    </div>
  );
}
