import React, { useContext, useState } from "react";
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
import UserContext from "./common/Model/UserContext";

function App() {
    const [user, setUser] = useState(null);

    return (
        <ThemeProvider theme={theme}>
            <UserContext.Provider value={[user, setUser]}>
                {user ? <UserRoutes /> : <Login />}
            </UserContext.Provider>
        </ThemeProvider>
    );
}

const UserRoutes = () => {
    const navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);

    if (user.type === UserType.PHYSICIAN) {
        return (
            <PatientProvider>
                <VisitProvider>
                    <NewVisitProvider>
                        <CurrentJointProvider>
                            <PhysicianHeader
                                onLogout={() => {
                                    setUser(null);
                                    navigate("/");
                                }}
                            />
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
                                <Route
                                    path="/annotations"
                                    element={<Annotations />}
                                />
                            </Routes>
                        </CurrentJointProvider>
                    </NewVisitProvider>
                </VisitProvider>
            </PatientProvider>
        );
    } else if (user.type === UserType.ADMIN) {
        return (
            <Routes>
                <Route index element={<AdminHome />} />
            </Routes>
        );
    }
};

export default App;
