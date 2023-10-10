import {
  FormControl,
  Switch,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import response from "../../../img/icon/hydrotherapy.png";

import "dayjs/locale/it";

import Slider from "@mui/material/Slider";
import { NewVisitContext } from "../../../Model/NewVisitContext";
import { useContext } from "react";

export default function Treatment(props) {
  const { newVisit } = useContext(NewVisitContext);
  return (
    <div
      style={{
        width: "47vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "left",
        gap: "4vh",
        border: "0.5px solid #56AEC9",
        boxShadow: "2px 2px 4px #56AEC9",
        borderRadius: "20px",
        height: "38vh",
        padding: "4%",
        background: "#edfdff",
      }}
    >
      <div>
        <h4>
          <img src={response} width={50} alt="" />
          Risposta al trattamento
        </h4>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div>
          <label style={{ fontSize: 18 }}>Visita precedente</label>
        </div>
        <div>{props.visitButtonResolver()}</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          gap: 20,
          width: "95%",
        }}
      >
        <div>
          <label style={{ fontSize: 18 }}>Risposta al trattamento</label>
        </div>
        <Slider
          name="treatment response"
          marks={props.treatmentResponses}
          min={10}
          max={40}
          step={10}
          defaultValue={
            newVisit.followUp.treatmentResponse !== undefined
              ? newVisit.followUp.treatmentResponse
              : 10
          }
        />
      </div>
      <div>
        {/*         <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label" style={{ width: "80%" }}>
            Which <strong>was</strong> the most likely cause of the distension?
          </InputLabel>
          <Select
            style={{ fontSize: 15 }}
            id="demo-simple-select"
            label="Which was the most likely cause of the distension?..."
          >
            {props.displayDistensionCauses()}
          </Select>
        </FormControl> */}
      </div>
    </div>
  );
}
