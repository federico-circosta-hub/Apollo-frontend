import notification from "../../../img/icon/notification.png";
import { Switch } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/it";
import { NewVisitContext } from "../../../Model/NewVisitContext";
import { useContext } from "react";

export default function FollowUpNeeded(props) {
  const { newVisit } = useContext(NewVisitContext);

  return (
    <div
      style={
        !newVisit.followUp.followUp
          ? style.needFollowUpButtonsOnTop
          : style.needFollowUpButtons
      }
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "99%",
          alignItems: "center",
        }}
      >
        <div>
          <label style={{ fontSize: 22 }}>
            <img src={notification} width={50} alt="" />
            Necessita follow up?
          </label>
        </div>
        <div>
          <Switch
            checked={
              props.needFollowUp == null
                ? false
                : props.needFollowUp.needFollowUp
            }
            onChange={props.handleChange}
          />
        </div>
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
            {props.datePickerResolver(
              !props.needFollowUp.needFollowUp,
              "followUpDate"
            )}
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
}

const style = {
  needFollowUpButtonsOnTop: {
    width: "55vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "20px",
    height: "10vh",
    marginBottom: "1%",
    paddingLeft: "4%",
    paddingRight: "4%",
    border: "0.5px solid #56AEC9",
    boxShadow: "2px 2px 4px #56AEC9",
  },
  needFollowUpButtons: {
    background: "#fffafa",
    width: "47vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: "20px",
    padding: "1.5%",
    height: "22vh",
    margin: "1%",
    border: "0.5px solid #c0c0c0",
    boxShadow: "2px 2px 4px #c0c0c0",
  },
};
