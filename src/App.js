import React, { useState } from "react";
import "./App.css";
import Login from "./MedicComponents/View/Panels/Login";
import Header from "./MedicComponents/View/OtherComponents/Header";
import { Route, Routes } from "react-router-dom";
import NewPatient from "./MedicComponents/View/Panels/NewPatient";
import SearchPatient from "./MedicComponents/View/Panels/SearchPatient";
import SearchVisit from "./MedicComponents/View/Panels/SearchVisit";
import NewVisit from "./MedicComponents/View/Panels/NewVisit";
import { PatientProvider } from "./MedicComponents/Model/PatientContext";
import { VisitProvider } from "./MedicComponents/Model/VisitContext";
import SeeVisit from "./MedicComponents/View/Panels/SeeVisit";
import { NewVisitProvider } from "./MedicComponents/Model/NewVisitContext";
import JointSelection from "./MedicComponents/View/Panels/JointSelection";
import Joint from "./MedicComponents/View/Panels/Joint";
import Drug from "./MedicComponents/View/Panels/Drug";
import EndVisit from "./MedicComponents/View/Panels/EndVisit";
import { CurrentJointProvider } from "./MedicComponents/Model/CurrentJointContext";
import AdminHome from "./AdminComponents/View/AdminHome";

function App() {
    const [name, setName] = useState(null);
    let type = "admin"; // operator / admin

    return name != null ? (
        <>
            {type == "physician" ? (
                <PatientProvider>
                    <VisitProvider>
                        <NewVisitProvider>
                            <CurrentJointProvider>
                                <Routes>
                                    <Route
                                        path="/newPatient"
                                        element={<NewPatient />}
                                    />
                                    <Route index element={<SearchPatient />} />
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
                                </Routes>
                            </CurrentJointProvider>
                        </NewVisitProvider>
                    </VisitProvider>
                </PatientProvider>
            ) : null}
            {type == "admin" ? (
                <>
                    <Routes>
                        <Route index element={<AdminHome />} />
                    </Routes>
                </>
            ) : null}
        </>
    ) : (
        <Login setName={setName} />
    );
}

export default App;
