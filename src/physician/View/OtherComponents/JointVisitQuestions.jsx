import { useEffect, useState } from "react";
import { Switch } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import format from "date-fns/format";
import Slider from "@mui/material/Slider";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function JointVisitQuestions(props) {
  const synovitisValues = [
    { value: 10, label: "Assente/bassa" },
    { value: 20, label: "Media" },
    { value: 30, label: "Grave" },
  ];
  const cartilageValues = [
    { value: 10, label: "Normale" },
    { value: 20, label: "perdita <25%" },
    { value: 30, label: "perdita <50%" },
    { value: 40, label: "perdita >50%" },
    { value: 50, label: "Perdita totale" },
  ];
  const subchondralValues = [
    { value: 10, label: "Normale" },
    { value: 20, label: "Irregolarità medie" },
    { value: 30, label: "Osteofite" },
  ];
  const distensionValues = [
    { value: 10, label: "Assente" },
    { value: 20, label: "Leggera" },
    { value: 30, label: "Media" },
    { value: 40, label: "Grave" },
  ];
  const distensionCauseValues = [
    "Unclear",
    "Synovial Effusion",
    "Synovial Effusion + Synovial Hyperplasia",
    "Vacuum",
    "Vacuum + Synovial Hyperplasia",
    "Synovial Hyperplasia",
  ];

  const [disableDistensionCauses, setDisableDistensionCauses] = useState(
    props.joint.distension == "Absent" ||
      props.joint.distension == "Minor" ||
      props.joint.distension == undefined
      ? true
      : false
  );

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
        props.joint.setSynovitis(synovitis.label);
        return props.setJoint(props.joint);
      case "cartilage":
        let cartilage = cartilageValues.find(
          (element) => element.value == e.target.value
        );
        props.joint.setCartilage(cartilage.label);
        return props.setJoint(props.joint);
      case "subchondral":
        let subchondralBone = subchondralValues.find(
          (element) => element.value == e.target.value
        );
        props.joint.setSubchondralBone(subchondralBone.label);
        return props.setJoint(props.joint);
      case "distension":
        let distension = distensionValues.find(
          (element) => element.value == e.target.value
        );
        if (distension.label == "Media" || distension.label == "Grave")
          setDisableDistensionCauses(false);
        else setDisableDistensionCauses(true);
        props.joint.setDistension(distension.label);
        return props.setJoint(props.joint);
    }
  };

  const valueResolver = (s) => {
    let n = 10;
    switch (s) {
      case "synovitis":
        if (props.joint.synovitis != undefined) {
          let synovitis = synovitisValues.find(
            (element) => element.label == props.joint.synovitis
          );
          n = synovitis.value;
        }
        return n;
      case "cartilage":
        if (props.joint.cartilage != undefined) {
          let cartilage = cartilageValues.find(
            (element) => element.label == props.joint.cartilage
          );
          n = cartilage.value;
        }
        return n;
      case "subchondral":
        if (props.joint.subchondralBone != undefined) {
          let subchondral = subchondralValues.find(
            (element) => element.label == props.joint.subchondralBone
          );
          n = subchondral.value;
        }
        return n;
      case "distension":
        if (props.joint.distension != undefined) {
          let distension = distensionValues.find(
            (element) => element.label == props.joint.distension
          );
          n = distension.value;
        }
        return n;
    }
    return n;
  };

  const displayDistensionCauses = () => {
    return distensionCauseValues.map((element) => (
      <MenuItem value={element}>{element}</MenuItem>
    ));
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
          style={{ display: "flex", justifyContent: "start", width: "100%" }}
        >
          <label style={{ fontSize: 20, flex: "1" }}>Index Joint</label>
          <div style={{ flex: "1" }}>
            <Switch
              defaultChecked={props.joint.indexJoint}
              onChange={(e) => modifyJoint(e, "index")}
            />
          </div>
          <label style={{ fontSize: 20, flex: "1" }}>
            Difficoltà movimento
          </label>
          <div style={{ flex: "1" }}>
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

          <label style={{ fontSize: 20, flex: "1" }}>
            Ultimo sanguinamento
          </label>
          <div style={{ flex: "1" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
              <DatePicker
                slotProps={{ textField: { size: "small" } }}
                label={
                  props.joint.lastBleed !== undefined &&
                  props.joint.lastBleed !== "" &&
                  props.joint.lastBleed !== null
                    ? format(props.joint.lastBleed, "dd-MM-y")
                    : "DD-MM-YYYY"
                }
                onChange={(newValue) => lastBleed(newValue.$d)}
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
              min={10}
              max={30}
              step={10}
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
              min={10}
              max={50}
              step={10}
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
              min={10}
              max={30}
              step={10}
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
              min={10}
              max={40}
              step={10}
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
              defaultValue={props.joint.distensionCause}
              style={{ fontSize: 20 }}
              id="demo-simple-select"
              label="La più probabile causa di d...?"
              onChange={(e) => {
                props.joint.setDistensionCause(e.target.value);
                props.setJoint(props.joint);
              }}
            >
              {displayDistensionCauses()}
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
}
