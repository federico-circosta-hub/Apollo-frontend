import { useContext, useEffect, useState } from "react";
import { NewVisitContext } from "../../Model/NewVisitContext";
import notification from "../../img/icon/notification.png";
import {
    FormControl,
    Switch,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import format from "date-fns/format";
import a_drugs from "../../img/icon/a_drugs.png";
import p_drugs from "../../img/icon/p_drugs.png";
import eye from "../../img/icon/view.png";
import response from "../../img/icon/hydrotherapy.png";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/it";
import { validateForm } from "../../ViewModel/Validation";
import FormModal from "../Modals/FormModal";
import Slider from "@mui/material/Slider";
import MainContainer from "../../../common/View/MainContainer";
import Communication from '../../../common/Model/Communication'

export default function Drug() {
    const { newVisit, setNewVisit } = useContext(NewVisitContext);

    const treatmentResponses = [
        { value: 10, label: "Low/absent" },
        { value: 20, label: "Discrete" },
        { value: 30, label: "Good" },
        { value: 40, label: "Excellent" },
    ];
    const distensionCauseValues = [
        "Unclear",
        "Synovial Effusion",
        "Synovial Effusion + Synovial Hyperplasia",
        "Vacuum",
        "Vacuum + Synovial Hyperplasia",
        "Synovial Hyperplasia",
    ];

    const [drugs, setDrugs] = useState([{ name: "", unit: "" }])
    const [disabledProphylactic, setDisabledProphylactic] = useState(
        newVisit.prophylacticDrug.drug == "" ? true : false
    );
    const [disabledAcute, setDisabledAcute] = useState(
        newVisit.acuteDrug.drug == "" ? true : false
    );
    const [needFollowUp, setNeedFollowUp] = useState(
        newVisit.needFollowUp == undefined
            ? { needFollowUp: false, followUpDate: "" }
            : newVisit.needFollowUp
    );
    const [prophylacticDrug, setProphylacticDrug] = useState(
        newVisit.prophylacticDrug
    );
    const [acuteDrug, setAcuteDrug] = useState(newVisit.acuteDrug);
    const [formModal, setFormModal] = useState(false);
    const [errors, setErrors] = useState({ none: "none" });

    const navigate = useNavigate();

    useEffect(() => {
        getDrugsFromServer()
    }, [])

    const getDrugsFromServer = async () => {
        setDrugs([{ name: "", unit: "" }])
        let d = await Communication.get('drug', {})
        setDrugs(prevState => [...prevState, ...d])
    }

    const datePickerResolver = (b, s) => {
        if (b) {
            return <DatePicker value={"DD-MM-YYYY"} disabled />;
        } else {
            return (
                <DatePicker
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
        pd.drug = e.target.value.name;
        pd.unit = e.target.value.unit;
        if (pd.drug == "") {
            pd.dose = "";
            pd.unit = "";
            pd.frequency = "";
            setDisabledProphylactic(true);
        } else {
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
        pd.frequency = Number(e.target.value);
        setProphylacticDrug(pd);
    };

    const handleAcuteDrug = (e) => {
        console.log(e.target)
        let ad = { ...acuteDrug };
        ad.drug = e.target.value.name;
        ad.unit = e.target.value.unit;
        if (ad.drug == "") {
            ad.dose = "";
            ad.unit = "";
            setDisabledAcute(true);
        } else {
            setDisabledAcute(false);
        }
        setAcuteDrug(ad);
    };

    const handleAcuteDrugDose = (e) => {
        let ad = { ...acuteDrug };
        ad.dose = Number(e.target.value);
        setAcuteDrug(ad);
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
            setNewVisit(newVisit);
            setErrors({});
            console.log(newVisit);
            navigate("/newVisit/endVisit");
        } else {
            setErrors(e);
            setFormModal(true);
        }
    };

    const visitButtonResolver = () => {
        if (newVisit.followUp.followUp) {
            return (
                <button className="btn btn-info">
                    <img width={22} src={eye} alt="" />{" "}
                    {format(newVisit.previousVisit, "dd-MM-y")}
                </button>
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

    return (
        <div>
            <MainContainer>
                <div
                    style={{
                        display: "flex",
                        width: "95%",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "2vw"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "40vw",
                                display: newVisit.followUp.followUp
                                    ? "flex"
                                    : "none",
                                flexDirection: "column",
                                justifyContent: "left",
                                gap: "4vh",
                                border: "1px solid black",
                                borderRadius: "20px",
                                padding: "4%",
                                height: "45vh",
                                margin: "1%",
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
                                    <label style={{ fontSize: 15 }}>
                                        Visita precedente
                                    </label>
                                </div>
                                <div>{visitButtonResolver()}</div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "start",
                                    gap: 20,
                                    width: "80%",
                                }}
                            >
                                <div>
                                    <label style={{ fontSize: 15 }}>
                                        Risposta al trattamento
                                    </label>
                                </div>
                                <Slider
                                    name="treatment response"
                                    disabled={!newVisit.followUp.followUp}
                                    marks={treatmentResponses}
                                    min={10}
                                    max={40}
                                    step={10}
                                    defaultValue={
                                        newVisit.followUp.treatmentResponse !=
                                            ""
                                            ? newVisit.followUp
                                                .treatmentResponse
                                            : 10
                                    }
                                />
                            </div>
                            <div>
                                <FormControl
                                    fullWidth
                                    disabled={!newVisit.followUp.followUp}
                                >
                                    <InputLabel
                                        id="demo-simple-select-label"
                                        style={{ width: "80%" }}
                                    >
                                        Which <strong>was</strong> the most
                                        likely cause of the distension?
                                    </InputLabel>
                                    <Select
                                        style={{ fontSize: 15 }}
                                        id="demo-simple-select"
                                        label="Which was the most likely cause of the distension?..."
                                    >
                                        {displayDistensionCauses()}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        {newVisit.followUp.followup && (
                            <div style={style.needFollowUpButtons}>
                                <div
                                    style={{
                                        display: "flex",
                                        width: "70%",
                                        alignItems: "center",
                                    }}
                                >
                                    <label style={{ fontSize: 22 }}>
                                        <img src={notification} width={50} alt="" />
                                        Ha bisogno di follow up?
                                    </label>
                                    <Switch
                                        checked={
                                            needFollowUp == null
                                                ? false
                                                : needFollowUp.needFollowUp
                                        }
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                        adapterLocale="it"
                                    >
                                        {datePickerResolver(
                                            !needFollowUp.needFollowUp,
                                            "followUpDate"
                                        )}
                                    </LocalizationProvider>
                                </div>
                            </div>
                        )}
                    </div>
                    {newVisit.followUp.followup && (
                        <div style={style.verticalLine}></div>
                    )}

                    <div
                        style={{
                            width: "45%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {!newVisit.followUp.followup && (
                            <div style={style.needFollowUpButtonsOnTop}>
                                <div
                                    style={{
                                        display: "flex",
                                        width: "95%",
                                        alignItems: "center",
                                        gap: "3vw"
                                    }}
                                >
                                    <div>
                                        <label style={{ fontSize: 22 }}>
                                            <img src={notification} width={50} alt="" />
                                            Ha bisogno di follow up?
                                        </label>
                                    </div>
                                    <div>
                                        <Switch
                                            checked={needFollowUp == null ? false : needFollowUp.needFollowUp}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it" >
                                            {datePickerResolver(!needFollowUp.needFollowUp, "followUpDate")}
                                        </LocalizationProvider>
                                    </div>

                                </div>
                            </div>
                        )}
                        <div style={style.prophylacticButtons}>
                            <div>
                                <label style={{ fontSize: 22 }}>
                                    <img src={p_drugs} width={50} alt="" />
                                    Medicinale di profilassi
                                </label>
                            </div>
                            <div>
                                <FormControl fullWidth>
                                    <InputLabel
                                        id="demo-simple-select-label"
                                        style={{ width: 'fit-content' }}
                                    >
                                        Medicinale di profilassi
                                    </InputLabel>
                                    <Select
                                        style={{ fontSize: 15 }}
                                        id="demo-simple-select"
                                        defaultValue={
                                            newVisit.prophylacticDrug.drug
                                        }
                                        onChange={(e) =>
                                            handleProphylacticDrug(e)
                                        }
                                        label="Medicinale di profilassi "
                                    >
                                        {drugs.map((element) => (
                                            <MenuItem value={element}>
                                                {element.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{ display: "flex" }}>
                                <input disabled placeholder={prophylacticDrug.unit !== '' ? prophylacticDrug.unit : "Unità"} style={{ background: `#fffacd` }} />
                                <input
                                    placeholder="Dose"
                                    defaultValue={
                                        newVisit.prophylacticDrug.dose
                                    }
                                    onChange={handleProphylacticDrugDose}
                                    style={{ background: `#fffacd` }}
                                    name="prophylacticDose"
                                    type="number"
                                    disabled={disabledProphylactic}
                                />
                            </div>
                            <div>
                                <input
                                    placeholder="Frequenza"
                                    defaultValue={
                                        newVisit.prophylacticDrug.frequency
                                    }
                                    onChange={handleProphylacticDrugFrequency}
                                    style={{ background: `#fffacd` }}
                                    name="prophylacticFrequency"
                                    type="number"
                                    disabled={disabledProphylactic}
                                />
                            </div>
                        </div>

                        <div style={style.acuteButtons}>
                            <div>
                                <label style={{ fontSize: 22 }}>
                                    <img src={a_drugs} width={50} alt="" />
                                    Medicinale acuto
                                </label>
                            </div>
                            <div>
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
                                        defaultValue={newVisit.acuteDrug.drug}
                                        onChange={(e) => handleAcuteDrug(e)}
                                        label="Medicinale acuto"
                                    >
                                        {drugs.map((element) => (
                                            <MenuItem value={element}>
                                                {element.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{ display: "flex" }}>
                                <input disabled placeholder={acuteDrug.unit !== '' ? acuteDrug.unit : "Unità"} style={{ background: `#ffe4e1` }} />
                                <input
                                    placeholder="Dose"
                                    style={{ background: `#ffe4e1` }}
                                    value={acuteDrug.dose}
                                    name="AcuteDose"
                                    type="number"
                                    onChange={handleAcuteDrugDose}
                                    disabled={disabledAcute}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "75%",
                    }}
                >
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-primary btn-lg"
                        >
                            Indietro
                        </button>
                    </div>
                    <div>
                        <button
                            style={style.forwardButton}
                            className="btn btn-success btn-lg"
                            onClick={forward}
                        >
                            Invia visita
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
            </div>
        </div>
    );
}

const style = {
    needFollowUpButtonsOnTop: {
        width: "40vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "20px",
        padding: "4%",
        height: "9vh",
        margin: "1%",
        border: "0.5px solid #56AEC9",
        boxShadow: "2px 2px 4px #56AEC9"
    },
    needFollowUpButtons: {
        width: "40vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "1px solid black",
        borderRadius: "20px",
        padding: "4%",
        height: "22vh",
        margin: "1%",
        border: "0.5px solid #56AEC9",
        boxShadow: "2px 2px 4px #56AEC9"
    },

    prophylacticButtons: {
        background: `#fffacd`,
        width: "40vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "20px",
        padding: "4%",
        height: "32vh",
        margin: "1%",
        border: "0.5px solid #daa520",
        boxShadow: "2px 2px 4px #daa520"
    },

    acuteButtons: {
        background: `#ffe4e1`,
        width: "40vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "20px",
        padding: "4%",
        height: "30vh",
        margin: "1%",
        border: "1px solid #b22222",
        boxShadow: "2px 2px 4px #b22222"
    },

    verticalLine: {
        width: 1,
        backgroundColor: "black",
        height: "85%",
        borderRadius: 15,
    },
};
