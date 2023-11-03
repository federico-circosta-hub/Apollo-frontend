import React from "react";
import { Button, Modal } from "react-bootstrap/";
import question from "./../../img/icon/question.png";
import { Alert, AlertTitle, Backdrop, TextField } from "@mui/material";
import VisitLine from "../OtherComponents/VisitLine";
import { useContext, useState } from "react";
import { NewVisitContext } from "../../Model/NewVisitContext";
import DeanonymizedCC from "../../../common/Model/Communication/DeanonymizedCommunicationController";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import { RefreshButton } from "../OtherComponents/RefreshButton";
import { SkeletonsList } from "../OtherComponents/SkeletonsList";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/it";
import dayjs from "dayjs";
import format from "date-fns/format";

export default function FollowUpChooseModal(props) {
  const { newVisit } = useContext(NewVisitContext);
  const MAX_DATE = dayjs(newVisit.visitDate);
  const VISITS_AT_TIME = 20;
  const [visitList, setVisitList] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [chooseError, setChooseError] = useState(false);
  const [offset, setOffset] = useState(0);
  const [endReached, setEndReached] = useState(false);
  const [otherVisit, setOtherVisit] = useState(false);
  const [otherVisitDate, setOtherVisitDate] = useState(
    newVisit.previousVisit && !newVisit.previousVisit.physician
      ? newVisit.previousVisit.date
      : null
  );
  const [otherVisitDescription, setOtherVisitDescription] = useState(
    newVisit.previousVisit && !newVisit.previousVisit.physician
      ? newVisit.previousVisit.description
      : ""
  );

  const throttledScroll = React.useRef(null);

  React.useEffect(() => {
    getVisits(0);
  }, []);

  const getVisits = async (offsetParam) => {
    let params = {
      patient: newVisit.patient,
      cnt: VISITS_AT_TIME,
      offset: offsetParam,
    };
    setLoadingVisits(true);
    setNetworkError(null);
    console.log(params);
    try {
      const visitsArray = await CommunicationController.get("visit", params);
      setOffset(offsetParam);
      if (visitsArray.length === 0 || visitsArray.length < VISITS_AT_TIME)
        if (visitsArray.length > 0) {
          setEndReached(true);
          for (let v of visitsArray) {
            const u = await DeanonymizedCC.get("user", {
              id: v.physician,
            });
            v.physicianName = u.name;
            v.physicianSurname = u.surname;
          }
          setVisitList((prevState) => [...prevState, ...visitsArray]);
        }
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingVisits(false);
    }
  };

  const handleSelect = (v) => {
    if (new Date(v.date) > newVisit.visitDate) {
      setChooseError(true);
      return;
    }
    props.onChoose(v);
    setShowModal(false);
  };

  const handleAdd = () => {
    let v = {
      date: otherVisitDate,
      description: otherVisitDescription,
      id: -1,
    };
    props.onChoose(v);
    setShowModal(false);
  };

  const handleScroll = React.useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (!endReached && (scrollTop + clientHeight) / scrollHeight >= 0.95) {
      if (!throttledScroll.current) {
        throttledScroll.current = setTimeout(() => {
          getVisits(offset + VISITS_AT_TIME);
          throttledScroll.current = null;
        }, 750);
      }
    }
  });

  return (
    <Modal show={showModal} animation={true} size={"lg"} scrollable={true}>
      <Alert severity="info" variant="filled" style={{ width: "100%" }}>
        <AlertTitle>Scegliere la visita</AlertTitle>
      </Alert>

      <Modal.Body style={{ background: "whitesmoke" }} onScroll={handleScroll}>
        {otherVisit ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              gap: "1.5vh",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5vh",
              }}
            >
              <label style={{ fontSize: 18 }}>Data della visita:</label>

              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="it"
              >
                <DatePicker
                  maxDate={MAX_DATE}
                  sx={{ background: "white" }}
                  slotProps={{ textField: { size: "small" } }}
                  onChange={(newValue) => setOtherVisitDate(newValue.$d)}
                  label={
                    otherVisitDate ? format(otherVisitDate, "dd-MM-y") : ""
                  }
                />
              </LocalizationProvider>
            </div>

            <TextField
              style={{ width: "45%", background: "white" }}
              id="outlined-multiline-static"
              label="Descrizione"
              value={otherVisitDescription}
              onChange={(e) => setOtherVisitDescription(e.target.value)}
              placeholder="Descrizione...
              Luogo visita?
              Tipologia di visita?
              Evento traumatico?"
              rows={4}
              multiline
            />
          </div>
        ) : loadingVisits ? (
          <SkeletonsList />
        ) : networkError ? (
          <RefreshButton onClick={getVisits} />
        ) : (
          <>
            <table className="table table-primary table-striped table-hover">
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  height: "6vh",
                }}
              >
                <tr>
                  {/* <th style={{ background: "white", width: "15%" }}>Id visita</th> */}
                  <th style={{ background: "white", width: "30%" }}>Data</th>
                  <th style={{ background: "white", width: "35%" }}>Medico</th>
                  <th style={{ background: "white", width: "15%" }}>
                    Id medico
                  </th>
                  <th style={{ background: "white", width: "20%" }}>
                    Tipo visita
                  </th>
                </tr>
              </thead>

              <tbody>
                {visitList
                  .filter((e) => e.physician !== null)
                  .map((visit, index) => (
                    <VisitLine
                      key={index}
                      visit={visit}
                      onSelectVisit={() => {
                        handleSelect(visit);
                      }}
                    />
                  ))}
              </tbody>
            </table>
            {visitList.length === 0 && (
              <p style={{ textAlign: "center", fontSize: 20 }}>
                <em>Non sono presenti visite</em>
              </p>
            )}
            {endReached && (
              <p>
                <em>Non sono presenti altre visite</em>
              </p>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "center",
          background: "whitesmoke",
        }}
      >
        {otherVisit ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setOtherVisit(false)}
            >
              Indietro
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => props.onCancel()}
            >
              Annulla
            </button>
            <button
              disabled={!(otherVisitDate && otherVisitDescription)}
              className="btn btn-success btn-lg"
              onClick={() => handleAdd()}
            >
              Conferma
            </button>
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
            }}
          >
            <div style={{ flex: 1 }}></div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => props.onCancel()}
              >
                Annulla
              </button>
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "right" }}>
              <button
                className="btn btn-warning"
                onClick={() => setOtherVisit(true)}
              >
                Non presente{" "}
                <img src={question} alt="question mark" width={25} />
              </button>
            </div>
          </div>
        )}
      </Modal.Footer>
      {chooseError && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={chooseError}
          onClick={() => setChooseError(false)}
        >
          <Alert
            severity="warning"
            variant="filled"
            style={{ width: "80%", justifyContent: "center", fontSize: 22 }}
          >
            <AlertTitle style={{ fontSize: 22 }}>
              Non è consentito selezionare una data di follow-up successiva alla
              data della visita che si sta compilando
            </AlertTitle>
          </Alert>
        </Backdrop>
      )}
    </Modal>
  );
}
