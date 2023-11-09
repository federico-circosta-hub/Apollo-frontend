import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import a_drugs from "../../../img/icon/a_drugs.png";
import "dayjs/locale/it";
import { RefreshButton } from "../RefreshButton";
import { useContext } from "react";
import { NewVisitContext } from "../../../Model/NewVisitContext";

export default function AcuteDrug(props) {
  const { newVisit, setNewVisit } = useContext(NewVisitContext);

  return (
    <div
      style={
        newVisit.followUp.followUp ? style.acuteButtonsFU : style.acuteButtons
      }
    >
      <div>
        <label style={{ fontSize: 22 }}>
          <img src={a_drugs} width={50} alt="" />
          Medicinale acuto
        </label>
      </div>
      <div style={{ display: "flex", gap: "2vw" }}>
        {props.networkError === null && props.drugs !== null ? (
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label"
              style={{ maxWidth: "fit-content" }}
            >
              Medicinale acuto
            </InputLabel>
            <Select
              style={{ fontSize: 15 }}
              id="demo-simple-select"
              value={
                props.acuteDrug.drug.name === ""
                  ? "Nessuno"
                  : newVisit.acuteDrug.drug.name
              }
              onChange={(e) => props.handleAcuteDrug(e)}
              label="Medicinale acuto"
            >
              <MenuItem value="Nessuno">
                <em>Nessuno</em>
              </MenuItem>

              {props.drugs.map((element) => (
                <MenuItem value={element.name}>{element.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <h6>Errore nell'ottenere la lista farmaci</h6>
            <RefreshButton
              onClick={props.getDrugsFromServer}
              loading={props.loadingOptions}
            />
          </div>
        )}

        <TextField
          value={props.acuteDrug.dose}
          name="AcuteDose"
          onChange={props.handleAcuteDrugDose}
          disabled={props.disabledAcute}
          placeholder="Dose"
          label="Dose"
          id="outlined-start-adornment"
          sx={{ width: "25ch" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {props.acuteDrug && props.acuteDrug.unit}
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
}

const style = {
  acuteButtonsFU: {
    background: `#ffe4e1`,
    width: "65vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "20px",
    padding: "1.5%",
    gap: "2vh",
    border: "0.5px solid #b22222",
    boxShadow: "2px 2px 4px #b22222",
  },
  acuteButtons: {
    background: `#ffe4e1`,
    width: "65vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "20px",
    padding: "2.5%",
    gap: "4vh",
    border: "0.5px solid #b22222",
    boxShadow: "2px 2px 4px #b22222",
  },
};
