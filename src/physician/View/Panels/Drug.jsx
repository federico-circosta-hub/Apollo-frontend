import { useContext, useEffect, useState } from "react";
import { NewVisitContext } from "../../Model/NewVisitContext";
import { CircularProgress, MenuItem, Skeleton } from "@mui/material";
import format from "date-fns/format";
import eye from "../../img/icon/view.png";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/it";
import { validateForm } from "../../ViewModel/Validation";
import FormModal from "../Modals/FormModal";
import MainContainer from "../../../common/View/MainContainer";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import NewVisitToSend from "../../ViewModel/NewVisitToSend";
import EndingVisitModal from "../Modals/EndingVisitModal";
import { PatientContext } from "../../Model/PatientContext";
import AcuteDrug from "../OtherComponents/Drug/AcuteDrug";
import Treatment from "../OtherComponents/Drug/Treatment";
import ProphylacticDrug from "../OtherComponents/Drug/ProphylacticDrug";
import FollowUpNeeded from "../OtherComponents/Drug/FollowUpNeeded";
import { VisitContext } from "../../Model/VisitContext";
import { RefreshButton } from "../OtherComponents/RefreshButton";

export default function Drug() {
  const { newVisit, setNewVisit } = useContext(NewVisitContext);
  const { selectedPatient } = useContext(PatientContext);
  const { selectedVisit, setSelectedVisit } = useContext(VisitContext);
  const [treatmentResponses, setTreatmentResponses] = useState(null);
  const distensionCauseValues = [
    "Unclear",
    "Synovial Effusion",
    "Synovial Effusion + Synovial Hyperplasia",
    "Vacuum",
    "Vacuum + Synovial Hyperplasia",
    "Synovial Hyperplasia",
  ];

  const [drugs, setDrugs] = useState(null);
  const [disabledProphylactic, setDisabledProphylactic] = useState(
    newVisit.prophylacticDrug.drug.name == "" ? true : false
  );
  const [disabledAcute, setDisabledAcute] = useState(
    newVisit.acuteDrug.drug.name == "" ? true : false
  );
  const [needFollowUp, setNeedFollowUp] = useState(
    newVisit.needFollowUp == undefined
      ? { needFollowUp: false, followUpDate: "" }
      : newVisit.needFollowUp
  );
  const [prophylacticDrug, setProphylacticDrug] = useState(
    newVisit.prophylacticDrug
  );
  const [frequencies, setFrequencies] = useState();
  const [acuteDrug, setAcuteDrug] = useState(newVisit.acuteDrug);
  const [formModal, setFormModal] = useState(false);
  const [errors, setErrors] = useState({ none: "none" });
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingFreq, setLoadingFreq] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [networkErrorT, setNetworkErrorT] = useState(null);
  const [networkErrorF, setNetworkErrorF] = useState(null);
  const [endingVisitModal, setEndingVisitModal] = useState(false);
  const [showFinishAlert, setShowFinishAlert] = useState(null);
  const [sending, setSending] = useState(false);
  const [treatment, setTreatment] = useState(
    newVisit.followUp.treatmentResponse
      ? newVisit.followUp.treatmentResponse
      : 1
  );

  const navigate = useNavigate();

  useEffect(() => {
    getDrugsFromServer();
    getFrequenciesFromServer();
    if (newVisit.followUp.followUp) getTreatmentFromServer();
  }, []);

  const getDrugsFromServer = async () => {
    setLoadingOptions(true);
    setNetworkError(null);
    try {
      const d = await CommunicationController.get("drug", {});
      setDrugs(d);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingOptions(false);
    }
  };

  const getTreatmentFromServer = async () => {
    setNetworkErrorT(null);
    try {
      const t = await CommunicationController.get("treatment", {});
      let newT = t.map((obj) => {
        return {
          value: obj.code,
          label: obj.name,
        };
      });
      setTreatmentResponses(newT);
    } catch (err) {
      setNetworkErrorT(err || "Errore inatteso");
    }
  };

  const getFrequenciesFromServer = async () => {
    setLoadingFreq(true);
    setNetworkErrorF(null);
    try {
      const f = await CommunicationController.get("drug/frequency", {});
      console.log(f);
      setFrequencies(f);
    } catch (err) {
      setNetworkErrorF(err || "Errore inatteso");
    } finally {
      setLoadingFreq(false);
    }
  };

  const datePickerResolver = (b, s) => {
    if (b) {
      return (
        <DatePicker
          slotProps={{ textField: { size: "small" } }}
          value={"DD-MM-YYYY"}
          disabled
        />
      );
    } else {
      return (
        <DatePicker
          slotProps={{ textField: { size: "small" } }}
          onChange={(newValue) => modifyDate(newValue.$d, s)}
        />
      );
    }
  };

  const modifyDate = (date) => {
    needFollowUp.followUpDate = format(date, "y-MM-dd");
    setNeedFollowUp(needFollowUp);
  };

  const handleChange = (e) => {
    let nfu = { ...needFollowUp };
    nfu.needFollowUp = e.target.checked;
    setNeedFollowUp(nfu);
  };

  const handleProphylacticDrug = (e) => {
    let pd = { ...prophylacticDrug };
    pd.drug.name = e.target.value;
    if (e.target.value === "Nessuno") {
      pd.dose = "";
      pd.unit = "";
      pd.frequency = "";
      setDisabledProphylactic(true);
    } else {
      pd.unit = drugs.find((element) => element.name === e.target.value).unit;
      setDisabledProphylactic(false);
    }
    setProphylacticDrug(pd);
  };

  const handleProphylacticDrugDose = (e) => {
    let pd = { ...prophylacticDrug };
    pd.dose = Number(e.target.value);
    setProphylacticDrug(pd);
  };

  const handleProphylacticDrugFrequency = (e) => {
    let pd = { ...prophylacticDrug };
    pd.frequency = frequencies.find((f) => f.frequency === e.target.value).id;
    setProphylacticDrug(pd);
  };

  const handleAcuteDrug = (e) => {
    console.log(e.target);
    let ad = { ...acuteDrug };
    ad.drug.name = e.target.value;
    if (e.target.value === "Nessuno") {
      ad.dose = "";
      ad.unit = "";
      setDisabledAcute(true);
    } else {
      ad.unit = drugs.find((element) => element.name === e.target.value).unit;
      setDisabledAcute(false);
    }
    setAcuteDrug(ad);
    console.log(ad);
  };

  const handleAcuteDrugDose = (e) => {
    let ad = { ...acuteDrug };
    ad.dose = Number(e.target.value);
    setAcuteDrug(ad);
  };

  const handleTreatment = (e) => {
    setTreatment(e.target.value);
  };

  const sendsAllAndFinish = async () => {
    setSending(true);
    console.log("newVisit:", newVisit);
    let newVisitToSend = new NewVisitToSend(newVisit);
    newVisitToSend.setJoints(newVisit);
    console.log("newVisitToSend:", newVisitToSend);
    try {
      /* const sendedVisit = await CommunicationController.post(
        "visit",
        newVisitToSend
      );
      console.log("sendedVisit:", sendedVisit); */

      setShowFinishAlert(true);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
      console.error("sendsAllAndFinish", err);
      setShowFinishAlert(false);
    } finally {
      setSending(false);
    }
  };

  const forward = () => {
    let o = {};
    o.needFollowUp = needFollowUp;
    o.prophylacticDrug = prophylacticDrug;
    o.acuteDrug = acuteDrug;
    console.log(o);
    let e = validateForm("drugs", o);
    console.log(Object.keys(e));
    if (Object.keys(e).length == 0) {
      newVisit.setNeedFollowUp(needFollowUp);
      newVisit.setProphylacticDrug(prophylacticDrug);
      newVisit.setAcuteDrug(acuteDrug);
      newVisit.setTreatment(treatment);
      setNewVisit(newVisit);
      setErrors({});
      setEndingVisitModal(true);
    } else {
      setErrors(e);
      setFormModal(true);
    }
  };

  const visitButtonResolver = () => {
    if (newVisit.followUp.followUp) {
      return (
        <Link
          onClick={() => setSelectedVisit(newVisit.previousVisit)}
          className="btn btn-info"
          to={"/seeVisit"}
        >
          <img width={22} src={eye} alt="" />{" "}
          {format(newVisit.followUp.lastVisit, "dd-MM-y")}
        </Link>
      );
    } else {
      return (
        <button disabled className="btn btn-info">
          <img width={22} src={eye} alt="" /> Visita precedente
        </button>
      );
    }
  };

  const displayDistensionCauses = () => {
    return distensionCauseValues.map((element) => (
      <MenuItem value={element}>{element}</MenuItem>
    ));
  };

  const back = () => {
    newVisit.setNeedFollowUp(needFollowUp);
    newVisit.setProphylacticDrug(prophylacticDrug);
    newVisit.setAcuteDrug(acuteDrug);
    newVisit.setTreatment(treatment);
    setNewVisit(newVisit);
    navigate(-1);
  };

  return newVisit.followUp.followUp ? (
    <div>
      <MainContainer
        style={{
          width: "98vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexDirection: "space-around",
          padding: "1.5vw",
          paddingTop: "6vh",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3vh",
            }}
          >
            <FollowUpNeeded
              needFollowUp={needFollowUp}
              handleChange={handleChange}
              datePickerResolver={datePickerResolver}
            />
            {treatmentResponses ? (
              <Treatment
                visitButtonResolver={visitButtonResolver}
                treatmentResponses={treatmentResponses}
                displayDistensionCauses={displayDistensionCauses}
                onTreatmentChange={handleTreatment}
                treatment={treatment}
              />
            ) : networkErrorT ? (
              <RefreshButton onClick={getTreatmentFromServer} />
            ) : (
              <Skeleton variant="rectangular" width={"47vw"} height={"38vh"} />
            )}
          </div>
          {/* <div style={style.verticalLine}></div> */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3vh",
            }}
          >
            <ProphylacticDrug
              prophylacticDrug={prophylacticDrug}
              handleProphylacticDrug={handleProphylacticDrug}
              networkError={networkError}
              drugs={drugs}
              getDrugsFromServer={getDrugsFromServer}
              loadingOptions={loadingOptions}
              handleProphylacticDrugDose={handleProphylacticDrugDose}
              disabledProphylactic={disabledProphylactic}
              handleProphylacticDrugFrequency={handleProphylacticDrugFrequency}
              networkErrorF={networkErrorF}
              frequencies={frequencies}
              loadingFreq={loadingFreq}
              getFrequenciesFromServer={getFrequenciesFromServer}
            />

            <AcuteDrug
              acuteDrug={acuteDrug}
              newVisit={newVisit}
              handleAcuteDrug={handleAcuteDrug}
              networkError={networkError}
              drugs={drugs}
              getDrugsFromServer={getDrugsFromServer}
              loadingOptions={loadingOptions}
              handleAcuteDrugDose={handleAcuteDrugDose}
              disabledAcute={disabledAcute}
            />
          </div>
        </div>
        <div
          style={{
            marginTop: "6vh",
            display: "flex",
            justifyContent: "space-between",
            width: "97.5%",
          }}
        >
          <div>
            <button
              onClick={() => back()}
              className="btn btn-primary"
              style={{ fontSize: 24 }}
            >
              Indietro
            </button>
          </div>
          <div>
            <button
              className="btn btn-success"
              onClick={forward}
              style={{ fontSize: 24 }}
            >
              Termina visita
            </button>
          </div>
        </div>
      </MainContainer>
      <div>
        {formModal && (
          <FormModal
            formModal={formModal}
            setFormModal={setFormModal}
            errors={errors}
          />
        )}
        {endingVisitModal && (
          <EndingVisitModal
            showAlert={showFinishAlert}
            setShowAlert={setShowFinishAlert}
            navigate={navigate}
            showModal={endingVisitModal}
            setShowModal={setEndingVisitModal}
            sends={sendsAllAndFinish}
            patient={selectedPatient}
            visit={newVisit}
            sending={sending}
          />
        )}
      </div>
    </div>
  ) : (
    <div>
      <MainContainer
        style={{
          width: "98vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "1.5vw",
          //paddingTop: "6vh",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1%",
            }}
          >
            <FollowUpNeeded
              needFollowUp={needFollowUp}
              handleChange={handleChange}
              datePickerResolver={datePickerResolver}
            />

            <ProphylacticDrug
              prophylacticDrug={prophylacticDrug}
              handleProphylacticDrug={handleProphylacticDrug}
              networkError={networkError}
              drugs={drugs}
              getDrugsFromServer={getDrugsFromServer}
              loadingOptions={loadingOptions}
              handleProphylacticDrugDose={handleProphylacticDrugDose}
              disabledProphylactic={disabledProphylactic}
              handleProphylacticDrugFrequency={handleProphylacticDrugFrequency}
              networkErrorF={networkErrorF}
              frequencies={frequencies}
              loadingFreq={loadingFreq}
              getFrequenciesFromServer={getFrequenciesFromServer}
            />

            <AcuteDrug
              acuteDrug={acuteDrug}
              newVisit={newVisit}
              handleAcuteDrug={handleAcuteDrug}
              networkError={networkError}
              drugs={drugs}
              getDrugsFromServer={getDrugsFromServer}
              loadingOptions={loadingOptions}
              handleAcuteDrugDose={handleAcuteDrugDose}
              disabledAcute={disabledAcute}
            />
          </div>
        </div>
        <div
          style={{
            marginTop: "1.5vh",
            display: "flex",
            justifyContent: "space-between",
            width: "97.5%",
          }}
        >
          <div>
            <button
              onClick={() => back()}
              className="btn btn-primary"
              style={{ fontSize: 24 }}
            >
              Indietro
            </button>
          </div>
          <div>
            <button
              className="btn btn-success"
              onClick={forward}
              style={{ fontSize: 24 }}
            >
              Termina visita
            </button>
          </div>
        </div>
      </MainContainer>
      <div>
        {formModal && (
          <FormModal
            formModal={formModal}
            setFormModal={setFormModal}
            errors={errors}
          />
        )}
        {endingVisitModal && (
          <EndingVisitModal
            showAlert={showFinishAlert}
            setShowAlert={setShowFinishAlert}
            navigate={navigate}
            showModal={endingVisitModal}
            setShowModal={setEndingVisitModal}
            sends={sendsAllAndFinish}
            patient={selectedPatient}
            visit={newVisit}
            sending={sending}
          />
        )}
      </div>
    </div>
  );
}
