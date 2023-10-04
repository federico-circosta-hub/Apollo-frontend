import "./App.css";
import React, { useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./common/View/Login";
import PhysicianHeader from "./physician/View/OtherComponents/PhysicianHeader";
import AdminHeader from "./admin/View/AdminHeader";
import theme from "./common/Theme";
import { ThemeProvider } from "@mui/material";
import UserContext from "./common/Model/UserContext";

import { PatientProvider } from "./physician/Model/PatientContext";
import { VisitProvider } from "./physician/Model/VisitContext";
import { NewVisitProvider } from "./physician/Model/NewVisitContext";
import { CurrentJointProvider } from "./physician/Model/CurrentJointContext";
import { UserType } from "./common/Model/User";
import UsersProvider from "./admin/ViewModel/UsersProvider";
import DatasetsProvider from "./admin/ViewModel/DatasetsProvider";
import AnnotationToolsProvider from "./admin/ViewModel/AnnotationToolsProvider";
import FunctionsProvider from "./admin/ViewModel/FunctionsProvider";

const NewPatient = React.lazy(() =>
    import("./physician/View/Panels/NewPatient")
);
const SearchPatient = React.lazy(() =>
    import("./physician/View/Panels/SearchPatient")
);
const SearchVisit = React.lazy(() =>
    import("./physician/View/Panels/SearchVisit")
);
const NewVisit = React.lazy(() => import("./physician/View/Panels/NewVisit"));
const SeeVisit = React.lazy(() => import("./physician/View/Panels/SeeVisit"));
const JointSelection = React.lazy(() =>
    import("./physician/View/Panels/JointSelection")
);
const Joint = React.lazy(() => import("./physician/View/Panels/Joint"));
const Drug = React.lazy(() => import("./physician/View/Panels/Drug"));
const EndVisit = React.lazy(() => import("./physician/View/Panels/EndVisit"));
const Annotations = React.lazy(() =>
    import("./physician/View/Panels/Annotations")
);

const AdminHome = React.lazy(() => import("./admin/View/AdminHome"));
const AdminUsers = React.lazy(() => import("./admin/View/Users/AdminUsers"));
const AdminDatasets = React.lazy(() =>
    import("./admin/View/Datasets/AdminDatasets")
);
const AdminAddDataset = React.lazy(() =>
    import("./admin/View/Datasets/AdminAddDataset")
);
const AdminTasks = React.lazy(() => import("./admin/View/AdminTasks"));
const AdminTools = React.lazy(() =>
    import("./admin/View/AnnotationTools/AdminTools")
);

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
    const [user] = useContext(UserContext);

    if (user.type === UserType.PHYSICIAN) {
        return (
            <PatientProvider>
                <VisitProvider>
                    <NewVisitProvider>
                        <CurrentJointProvider>
                            <PhysicianHeader />
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
            <AdminHeader>
                <UsersProvider>
                    <DatasetsProvider>
                        <AnnotationToolsProvider>
                            <FunctionsProvider>
                                <Routes>
                                    <Route index element={<AdminHome />} />
                                    <Route
                                        path="/users"
                                        element={<AdminUsers />}
                                    />
                                    <Route
                                        path="/datasets"
                                        element={<AdminDatasets />}
                                    />
                                    <Route
                                        path="/tools"
                                        element={<AdminTools />}
                                    />
                                    <Route
                                        path="/tasks"
                                        element={<AdminTasks />}
                                    />
                                    <Route
                                        path="/datasets/add"
                                        element={<AdminAddDataset />}
                                    />
                                </Routes>
                            </FunctionsProvider>
                        </AnnotationToolsProvider>
                    </DatasetsProvider>
                </UsersProvider>
            </AdminHeader>
        );
    }
};

export default App;
