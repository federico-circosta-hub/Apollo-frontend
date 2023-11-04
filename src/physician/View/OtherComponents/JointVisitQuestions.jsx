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

  const synovitisValues = [
    { value: 0, label: "Assente/bassa" },
    { value: 1, label: "Media" },
    { value: 2, label: "Grave" },
  ];
  const cartilageValues = [
    { value: 0, label: "Normale" },
    { value: 1, label: "perdita <25%" },
    { value: 2, label: "perdita <50%" },
    { value: 3, label: "perdita >50%" },
    { value: 4, label: "Perdita totale" },
  ];
  const subchondralValues = [
    { value: 0, label: "Normale" },
    { value: 1, label: "Irregolarità medie" },
    { value: 2, label: "Osteofite" },
  ];
  const distensionValues = [
    { value: 0, label: "Assente", db: "absent" },
    { value: 1, label: "Leggera", db: "minimum" },
    { value: 2, label: "Media", db: "moderate" },
    { value: 3, label: "Grave", db: "severe" },
  ];
  /*   const distensionCauseValues = [
    "Unclear",
    "Synovial Effusion",
    "Synovial Effusion + Synovial Hyperplasia",
    "Vacuum",
    "Vacuum + Synovial Hyperplasia",
    "Synovial Hyperplasia",
  ]; */

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
  const [networkErrorIndex, setNetworkErrorIndex] = useState(null);

  useEffect(() => {
    getDistensionCauseValuesFromServer();
    !props.joint.modifiedIndex && getIsIndex();
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

  const getIsIndex = async () => {
    setNetworkErrorIndex(null);
    setLoadingIndex(true);
    let params = {
      name: props.joint.jointName,
      side: props.joint.side,
      patient: selectedPatient.pid,
    };
    try {
      const i = await CommunicationController.get("joint/index", params);
      props.joint.setIndexJoint(i.index);
      props.joint.setModifiedIndex(true);
    } catch (err) {
      setNetworkErrorIndex(err || "Errore inatteso");
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
        let synovitis = synovitisValues.find(
          (element) => element.value == e.target.value
        );
        props.joint.setSynovitis(synovitis.value);
        return props.setJoint(props.joint);
      case "cartilage":
        let cartilage = cartilageValues.find(
          (element) => element.value == e.target.value
        );
        props.joint.setCartilage(cartilage.value);
        return props.setJoint(props.joint);
      case "subchondral":
        let subchondralBone = subchondralValues.find(
          (element) => element.value == e.target.value
        );
        props.joint.setSubchondralBone(subchondralBone.value);
        return props.setJoint(props.joint);
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
      case "synovitis":
        if (props.joint.sinovite) {
          let synovitis = synovitisValues.find(
            (element) => element.value == props.joint.sinovite
          );
          n = synovitis.value;
        }
        return n;
      case "cartilage":
        if (props.joint.cartilagine) {
          let cartilage = cartilageValues.find(
            (element) => element.value == props.joint.cartilagine
          );
          n = cartilage.value;
        }
        return n;
      case "subchondral":
        if (props.joint.subchondral_bone) {
          let subchondral = subchondralValues.find(
            (element) => element.value == props.joint.subchondral_bone
          );
          n = subchondral.value;
        }
        return n;
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
        <MenuItem value={element.name}>{element.name}</MenuItem>
      ))
    );
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
          }}
        >
          <label style={{ fontSize: 20, flex: "1" }}>Index Joint</label>
          <div style={{ flex: "1" }}>
            {loadingIndex ? (
              <CircularProgress />
            ) : (
              <Switch
                defaultChecked={props.joint.indexJoint}
                onChange={(e) => modifyJoint(e, "index")}
              />
            )}
          </div>
          <label style={{ fontSize: 20, flex: "2" }}>
            Difficoltà movimento
          </label>
          <div style={{ flex: "2" }}>
            <Switch
              defaultChecked={props.joint.jointDifficulty}
              onChange={(e) => modifyJoint(e, "difficulty")}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "start",
            paddingBottom: "10px",
            width: "100%",
          }}
        >
          <label style={{ fontSize: 20, flex: "1" }}>Dolore</label>
          <div style={{ flex: "1" }}>
            <Switch
              defaultChecked={props.joint.pain}
              onChange={(e) => modifyJoint(e, "pain")}
            />
          </div>

          <label style={{ fontSize: 20, flex: "2" }}>
            Ultimo sanguinamento
          </label>
          <div style={{ flex: "2" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
              <DatePicker
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
          height: "35vh",
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
              marks={synovitisValues}
              min={0}
              max={2}
              step={1}
              defaultValue={() => valueResolver("synovitis")}
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
              disabled={false}
              marks={cartilageValues}
              min={0}
              max={4}
              step={1}
              defaultValue={() => valueResolver("cartilage")}
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
              disabled={false}
              marks={subchondralValues}
              min={0}
              max={2}
              step={1}
              defaultValue={() => valueResolver("subchondral")}
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
              marks={distensionValues}
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
              Errore nell'ottenere gli eventi traumatici
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
                  props.joint.distensionCause !== null &&
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
    </div>
  );
}
