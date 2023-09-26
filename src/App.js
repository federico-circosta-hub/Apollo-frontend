import React, { useState } from "react";
import "./App.css";
import Login from "./common/View/Login";
import PhysicianHeader from "./physician/View/OtherComponents/PhysicianHeader";
import { Route, Routes, useNavigate } from "react-router-dom";
import NewPatient from "./physician/View/Panels/NewPatient";
import SearchPatient from "./physician/View/Panels/SearchPatient";
import SearchVisit from "./physician/View/Panels/SearchVisit";
import NewVisit from "./physician/View/Panels/NewVisit";
import { PatientProvider } from "./physician/Model/PatientContext";
import { VisitProvider } from "./physician/Model/VisitContext";
import SeeVisit from "./physician/View/Panels/SeeVisit";
import { NewVisitProvider } from "./physician/Model/NewVisitContext";
import JointSelection from "./physician/View/Panels/JointSelection";
import Joint from "./physician/View/Panels/Joint";
import Drug from "./physician/View/Panels/Drug";
import EndVisit from "./physician/View/Panels/EndVisit";
import { CurrentJointProvider } from "./physician/Model/CurrentJointContext";
import AdminHome from "./admin/View/AdminHome";
import Annotations from "./physician/View/Panels/Annotations";
import { UserType } from "./common/Model/User";
import theme from "./common/Theme";
import { ThemeProvider } from "@mui/material";

function App() {
    const navigate = useNavigate();
    const [name, setName] = useState(null);
    let type = "physician"; // operator / admin / physician

    return name != null ? (
        <ThemeProvider theme={theme}>
            {type === UserType.PHYSICIAN ? (
                <>
                    <PatientProvider>
                        <VisitProvider>
                            <NewVisitProvider>
                                <CurrentJointProvider>
                                    <PhysicianHeader
                                        name={name}
                                        logout={() => {
                                            setName(null);
                                            navigate("/");
                                        }}
                                    />
                                    <Routes>
                                        <Route
                                            path="/newPatient"
                                            element={<NewPatient />}
                                        />
                                        <Route
                                            index
                                            element={<SearchPatient />}
                                        />
                                        <Route
                                            path="/newVisit"
                                            element={<NewVisit />}
                                        />
                                        <Route
                                            path="/newVisit/jointSelection"
                                            element={<JointSelection />}
                                        />
                                        <Route
                                            path="/newVisit/jointSelection/joint"
                                            element={<Joint />}
                                        />
                                        <Route
                                            path="/newVisit/drug"
                                            element={<Drug />}
                                        />
                                        <Route
                                            path="/searchVisit"
                                            element={<SearchVisit />}
                                        />
                                        <Route
                                            path="/seeVisit"
                                            element={<SeeVisit />}
                                        />
                                        <Route
                                            path="/newVisit/endVisit"
                                            element={<EndVisit />}
                                        />
                                        <Route
                                            path="/annotations"
                                            element={<Annotations />}
                                        />
                                    </Routes>
                                </CurrentJointProvider>
                            </NewVisitProvider>
                        </VisitProvider>
                    </PatientProvider>
                </>
            ) : null}
            {type === UserType.ADMIN ? (
                <>
                    <Routes>
                        <Route index element={<AdminHome />} />
                    </Routes>
                </>
            ) : null}
        </ThemeProvider>
    ) : (
        <Login setName={setName} />
    );
}

export default App;
