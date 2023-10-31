import { useContext } from "react";
import { NewVisitContext } from "../../../Model/NewVisitContext";
import {
  FormControl,
  Switch,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import p_drugs from "../../../img/icon/p_drugs.png";
import "dayjs/locale/it";
import { RefreshButton } from "../RefreshButton";

export default function ProphylacticDrug(props) {
  const { newVisit } = useContext(NewVisitContext);

  return (
    <div
      style={
        newVisit.followUp.followUp
          ? style.prophylacticButtonsFU
          : style.prophylacticButtons
      }
    >
      <div>
        <label style={{ fontSize: 22 }}>
          <img src={p_drugs} width={50} alt="" />
          Medicinale di profilassi
        </label>
      </div>
      <div>
        {!props.networkError && props.drugs ? (
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label"
              style={{ width: "fit-content" }}
            >
              Medicinale di profilassi
            </InputLabel>
            <Select
              style={{ fontSize: 15 }}
              id="demo-simple-select"
              value={
                props.prophylacticDrug.drug.name === ""
                  ? "Nessuno"
                  : newVisit.prophylacticDrug.drug.name
              }
              onChange={(e) => props.handleProphylacticDrug(e)}
              label="Medicinale di profilassi "
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
            Errore nell'ottenere la lista farmaci
            <RefreshButton
              onClick={props.getDrugsFromServer}
              loading={props.loadingOptions}
            />
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        <input
          placeholder="Dose"
          value={props.prophylacticDrug.dose}
          onChange={props.handleProphylacticDrugDose}
          style={{ background: `#fffacd`, flex: 1.5 }}
          name="prophylacticDose"
          type="number"
          disabled={props.disabledProphylactic}
        />

        <label style={{ flex: 1 }}>
          {props.prophylacticDrug.unit && (
            <> Unità: {props.prophylacticDrug.unit}</>
          )}
        </label>
      </div>
      <div>
        {!props.networkErrorF && props.frequencies ? (
          <FormControl fullWidth disabled={props.disabledProphylactic}>
            <InputLabel
              id="demo-simple-select-label"
              style={{ width: "fit-content" }}
            >
              Frequenza
            </InputLabel>
            <Select
              style={{ fontSize: 15 }}
              id="demo-simple-select"
              value={
                props.prophylacticDrug.frequency
                  ? props.frequencies.find(
                      (f) => f.id === props.prophylacticDrug.frequency
                    ).frequency
                  : ""
              }
              onChange={props.handleProphylacticDrugFrequency}
              label="Frequenza"
            >
              {props.frequencies.map((element) => (
                <MenuItem value={element.frequency}>
                  {element.frequency}
                </MenuItem>
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
            Errore nell'ottenere la lista frequenze
            <RefreshButton
              onClick={props.getFrequenciesFromServer}
              loading={props.loadingFreq}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const style = {
  prophylacticButtons: {
    background: `#fffacd`,
    width: "55vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "20px",
    padding: "4%",
    height: "32vh",
    margin: "1%",
    border: "0.5px solid #daa520",
    boxShadow: "2px 2px 4px #daa520",
  },
  prophylacticButtonsFU: {
    background: `#fffacd`,
    width: "47vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "20px",
    padding: "4%",
    height: "32vh",
    margin: "1%",
    border: "0.5px solid #daa520",
    boxShadow: "2px 2px 4px #daa520",
  },
};
