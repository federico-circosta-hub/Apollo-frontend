import { useContext, useEffect, useState } from "react";
import { NewVisitContext } from "../../Model/NewVisitContext";
import { PatientContext } from "../../Model/PatientContext";
import NoContextModal from "../Modals/NoContextModal";
import {
  FormControl,
  Switch,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import format from "date-fns/format";
import { Link } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/it";
import FollowUpHelper from "../../ViewModel/FollowUpHelper";
import { validateForm } from "../../ViewModel/Validation";
import FormModal from "../Modals/FormModal";
import { useNavigate } from "react-router-dom";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import CircularProgress from "@mui/material/CircularProgress";
import MainContainer from "../../../common/View/MainContainer";
import NoPreviousVisit from "../Modals/NoPreviousVisit";
import { RefreshButton } from "../OtherComponents/RefreshButton";
import FollowUpChooseModal from "../Modals/FollowUpChooseModal";

export default function NewVisit() {
  const nav = useNavigate();

  const { newVisit, setNewVisit } = useContext(NewVisitContext);
  const { selectedPatient } = useContext(PatientContext);

  const [activities, setActivities] = useState([{ name: "Nessuna" }]);
  const [traumaticEvents, setTraumaticEvents] = useState([{ name: "Nessuno" }]);
  const [visitDate, setVisitDate] = useState(newVisit.visitDate);
  const [isFollowUp, setIsFollowUp] = useState(newVisit.followUp.followUp);
  const [disabledLeft, setDisabledLeft] = useState(
    !newVisit.physicalActivity.physicalActivity
  );
  const [physicalActivity, setPhysicalActivity] = useState(
    newVisit.physicalActivity
  );
  const [traumaticEvent, setTraumaticEvent] = useState(newVisit.traumaticEvent);
  const [disabledRight, setDisabledRight] = useState(
    newVisit.traumaticEvent.traumaticEvent === "" ? true : false
  );
  const [formModal, setFormModal] = useState(false);
  const [formErrors, setErrors] = useState({ none: "none" });
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [previousVisit, setPreviousVisit] = useState(newVisit.previousVisit);

  useEffect(() => {
    getTraumaticEventAndActivitiesFromServer();
  }, []);

  const getTraumaticEventAndActivitiesFromServer = async () => {
    setLoadingOptions(true);
    setActivities([{ name: "Nessuna" }]);
    setTraumaticEvents([{ name: "Nessuno" }]);
    setNetworkError(null);
    try {
      const acts = await CommunicationController.get("exercise", {});
      const trauma = await CommunicationController.get("traumaEvent", {});
      setActivities((prevState) => [...prevState, ...acts]);
      setTraumaticEvents((prevState) => [...prevState, ...trauma]);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingOptions(false);
    }
  };

  const physicalActivitySwicthChange = (e) => {
    physicalActivity.physicalActivity = e.target.checked;
    setPhysicalActivity(physicalActivity);
    setDisabledLeft(!e.target.checked);
    if (!e.target.checked) {
      setPhysicalActivity({
        physicalActivity: false,
        physicalActivityDate: undefined,
        physicalActivityType: undefined,
      });
    }
  };

  const forward = () => {
    let o = {
      traumaticEvent: traumaticEvent,
      physicalActivity: physicalActivity,
      visitDate: visitDate,
    };
    let e = validateForm("newVisit", o);
    if (Object.keys(e).length == 0) {
      newVisit.setIsFollowUp(isFollowUp);
      newVisit.setVisitDate(visitDate);
      newVisit.setPhysicalActivity(physicalActivity);
      newVisit.setTraumaticEvent(traumaticEvent);
      newVisit.setPreviousVisit(previousVisit);
      previousVisit !== undefined &&
        newVisit.setLastVisit(new Date(previousVisit.date));
      setNewVisit(newVisit);
      setErrors({});
      console.log(newVisit);
      nav("/newVisit/jointSelection");
    } else {
      setErrors(e);
      setFormModal(true);
    }
  };

  const modifyDate = (date, whatDate) => {
    switch (whatDate) {
      case "physicalActivityDate":
        physicalActivity.physicalActivityDate = format(date, "y-MM-dd");
        setPhysicalActivity(physicalActivity);
        return;
      case "traumaDate":
        traumaticEvent.traumaticEventDate = format(date, "y-MM-dd");
        setTraumaticEvent(traumaticEvent);
        return;
      case "visitDate":
        date.setHours(10, 15);
        setVisitDate(date);
        return;
    }
  };

  const displayActivityItems = () => {
    return networkError === null ? (
      activities.map((element) => (
        <MenuItem key={element.name} value={element.name}>
          {element.name}
        </MenuItem>
      ))
    ) : (
      <MenuItem>
        Errore nell'ottenere le attività
        <RefreshButton onClick={getTraumaticEventAndActivitiesFromServer} />
      </MenuItem>
    );
  };
  const displayTraumaticItems = () => {
    return networkError === null ? (
      traumaticEvents.map((element) => (
        <MenuItem key={element.name} value={element.name}>
          {element.name}
        </MenuItem>
      ))
    ) : (
      <MenuItem>
        Errore nell'ottenere gli eventi traumatici
        <RefreshButton onClick={getTraumaticEventAndActivitiesFromServer} />
      </MenuItem>
    );
  };

  const handleActivity = (e) => {
    setPhysicalActivity((prevPhysicalActivity) => ({
      ...prevPhysicalActivity,
      physicalActivityType: e.target.value,
    }));
  };

  const handleTrauma = (e) => {
    let newtraumaticEvent = { ...traumaticEvent };
    if (e.target.value === "") {
      setDisabledRight(true);
      newtraumaticEvent.traumaticEventDate = undefined;
    } else {
      setDisabledRight(false);
    }
    newtraumaticEvent.traumaticEvent = e.target.value;
    setTraumaticEvent(newtraumaticEvent);
  };

  const followUp = (e) => {
    setIsFollowUp(e.target.checked);
    if (!e.target.checked) setPreviousVisit(undefined);
  };

  const datePickerResolver = (b, s) => {
    if (b) {
      return (
        <DatePicker slotProps={{ textField: { size: "small" } }} disabled />
      );
    } else {
      return (
        <DatePicker
          slotProps={{ textField: { size: "small" } }}
          onChange={(newValue) => modifyDate(newValue.$d, s)}
          label={
            s == "traumaDate"
              ? traumaticEvent.traumaticEventDate
              : physicalActivity.physicalActivityDate
          }
        />
      );
    }
  };

  const handleCancel = () => {
    setPreviousVisit(undefined);
    setIsFollowUp(false);
  };

  const saveInfo = () => {
    newVisit.setIsFollowUp(isFollowUp);
    newVisit.setPhysicalActivity(physicalActivity);
    newVisit.setTraumaticEvent(traumaticEvent);
    newVisit.setPreviousVisit(previousVisit);
    setNewVisit(newVisit);
  };

  return selectedPatient !== null ? (
    <div>
      <MainContainer style={{ paddingTop: 5 }}>
        <div style={style.monoButtons}>
          <div style={{ alignItems: "center", display: "flex" }}>
            <label style={{ fontSize: 22 }}>È una visita di follow-up?</label>
            <Switch checked={isFollowUp} onChange={followUp} />
          </div>
          <div>
            {isFollowUp &&
              previousVisit !== undefined &&
              newVisit.previousVisitList.length !== 0 && (
                <FollowUpHelper
                  onCancel={handleCancel}
                  seeVisit={saveInfo}
                  previousVisit={previousVisit}
                />
              )}
            {isFollowUp &&
              previousVisit === undefined &&
              (newVisit.previousVisitList.length === 0 ||
                newVisit.previousVisitList.filter((e) => e.physician !== null)
                  .length === 0) && (
                <NoPreviousVisit setIsFollowUp={() => setIsFollowUp(false)} />
              )}
            {isFollowUp &&
              previousVisit === undefined &&
              newVisit.previousVisitList.filter((e) => e.physician !== null)
                .length > 0 && (
                <FollowUpChooseModal
                  onCancel={handleCancel}
                  onChoose={setPreviousVisit}
                />
              )}
          </div>
        </div>

        {!newVisit.isInPresence && (
          <div style={style.monoButtons}>
            <div>
              <label style={{ fontSize: 22 }}>
                Qual è la data della visita?
              </label>
            </div>
            <div>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="it"
              >
                <DatePicker
                  disabled
                  slotProps={{ textField: { size: "small" } }}
                  label={
                    newVisit.visitDate
                      ? format(new Date(newVisit.visitDate), "dd-MM-Y")
                      : "DD-MM-YYYY"
                  }
                />
              </LocalizationProvider>
            </div>
          </div>
        )}

        <div style={style.buttons}>
          <div style={{ display: "flex" }}>
            <label style={{ fontSize: 22 }}>
              Il paziente ha svolto attività fisica?
            </label>
            <Switch
              defaultChecked={
                newVisit === null
                  ? false
                  : newVisit.physicalActivity.physicalActivity
              }
              onChange={physicalActivitySwicthChange}
            />
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
              {datePickerResolver(disabledLeft, "physicalActivityDate")}
            </LocalizationProvider>
          </div>
          <div>
            <FormControl
              fullWidth
              disabled={disabledLeft}
              style={{ minWidth: 120, fontSize: 22 }}
            >
              <InputLabel id="demo-simple-select-label">
                Attività fisica
              </InputLabel>

              <Select
                style={{ fontSize: 22 }}
                id="demo-simple-select"
                label="esercizio"
                value={physicalActivity.physicalActivityType}
                onChange={handleActivity}
              >
                {loadingOptions && (
                  <CircularProgress
                    style={{ padding: 2 }}
                    color="info"
                    size={25}
                  />
                )}
                {!loadingOptions && displayActivityItems()}
              </Select>
            </FormControl>
          </div>
        </div>

        <div style={style.buttons}>
          <div>
            <label style={{ fontSize: 22 }}>
              Indicare evento traumatico, se presente
            </label>
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" style={{ width: 160 }}>
                Evento
              </InputLabel>

              <Select
                style={{ fontSize: 22 }}
                id="demo-simple-select"
                label="event"
                value={traumaticEvent.traumaticEvent}
                onChange={handleTrauma}
              >
                {traumaticEvents.length > 0 ? (
                  displayTraumaticItems()
                ) : (
                  <CircularProgress
                    style={{ padding: 2 }}
                    color="info"
                    size={25}
                  />
                )}
              </Select>
            </FormControl>
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
              {datePickerResolver(disabledRight, "traumaDate")}
            </LocalizationProvider>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            height: "15vh",
            alignItems: "flex-end",
            justifyContent: "space-between",
            width: "95%",
          }}
        >
          <div>
            <Link
              onClick={() => setNewVisit(null)}
              to={"/searchVisit/"}
              className="btn btn-danger"
              style={{ fontSize: 24 }}
            >
              Annulla
            </Link>
          </div>
          <div>
            <button
              className="btn btn-success"
              onClick={forward}
              style={{ fontSize: 24 }}
            >
              Prosegui
            </button>
          </div>
        </div>
      </MainContainer>

      <div>
        {formModal && (
          <FormModal
            formModal={formModal}
            setFormModal={setFormModal}
            errors={formErrors}
          />
        )}
      </div>
    </div>
  ) : (
    <NoContextModal what={" un paziente "} service={" nuova visita "} />
  );
}

const style = {
  monoButtons: {
    display: "flex",
    flexDirection: "row",
    width: "70%",
    height: "10vh",
    padding: "1.5%",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #dcdcdc",
    borderRadius: "20px",
    boxShadow: "1px 2px 6px #dcdcdc",
  },

  buttons: {
    width: "70%",
    height: "27vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    border: "1px solid #dcdcdc",
    borderRadius: "20px",
    boxShadow: "1px 2px 6px #dcdcdc",
    padding: "1.5%",
  },
  verticalLine: {
    width: 1,
    backgroundColor: "grey",
    height: "60%",
    borderRadius: 15,
    margin: 0,
    marginBottom: "7%",
  },
};
