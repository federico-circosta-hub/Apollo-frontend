import "./App.css";
import React, { useContext, useState, useRef } from "react";
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
import PhysiciansProvider from "./admin/ViewModel/UsersProvider";
import DatasetsProvider from "./admin/ViewModel/DatasetsProvider";
import AnnotationToolsProvider from "./admin/ViewModel/AnnotationToolsProvider";
import AnnotationTasksProvider from "./admin/ViewModel/AnnotationTasksProvider";
import FunctionsProvider from "./admin/ViewModel/FunctionsProvider";
import { StepProvider } from "./physician/Model/StepContext";

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
const AdminAddUser = React.lazy(() =>
  import("./admin/View/Users/AdminAddUser")
);
const AdminDatasets = React.lazy(() =>
  import("./admin/View/Datasets/AdminDatasets")
);
const AdminAddDataset = React.lazy(() =>
  import("./admin/View/Datasets/AdminAddDataset")
);
const AdminTasks = React.lazy(() =>
  import("./admin/View/AnnotationTasks/AdminTasks")
);
const AdminAddTask = React.lazy(() =>
  import("./admin/View/AnnotationTasks/AdminAddTask")
);
const AdminTools = React.lazy(() =>
  import("./admin/View/AnnotationTools/AdminTools")
);
const AdminAddTool = React.lazy(() =>
  import("./admin/View/AnnotationTools/AdminAddTool")
);
const AdminMediaStats = React.lazy(() =>
  import("./admin/View/MediaStats/AdminMediaStats")
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
  const [isCancelButtonActive, setCancelButtonActive] = useState(false);
  const [isForwardButtonActive, setForwardButtonActive] = useState(false);

  const activateButton = (buttonNumber) => {
    if (buttonNumber === 1) {
      setCancelButtonActive(true);
      setForwardButtonActive(false);
    } else if (buttonNumber === 2) {
      setCancelButtonActive(false);
      setForwardButtonActive(true);
    }
  };

  if (user.type === UserType.PHYSICIAN) {
    return (
      <PatientProvider>
        <VisitProvider>
          <NewVisitProvider>
            <CurrentJointProvider>
              <StepProvider>
                <PhysicianHeader activateButton={activateButton} />
                <Routes>
                  <Route path="/newPatient" element={<NewPatient />} />
                  <Route index element={<SearchPatient />} />
                  <Route path="/newVisit" element={<NewVisit />} />
                  <Route
                    path="/newVisit/jointSelection"
                    element={<JointSelection />}
                  />
                  <Route
                    path="/newVisit/jointSelection/joint"
                    element={
                      <Joint
                        isCancelButtonActive={isCancelButtonActive}
                        isForwardButtonActive={isForwardButtonActive}
                        setCancelButtonActive={setCancelButtonActive}
                        setForwardButtonActive={setForwardButtonActive}
                      />
                    }
                  />
                  <Route path="/newVisit/drug" element={<Drug />} />
                  <Route
                    path="/searchVisit"
                    element={<SearchVisit id={user.id} />}
                  />
                  <Route path="/seeVisit" element={<SeeVisit />} />
                  <Route path="/newVisit/endVisit" element={<EndVisit />} />
                  <Route path="/annotations" element={<Annotations />} />
                </Routes>
              </StepProvider>
            </CurrentJointProvider>
          </NewVisitProvider>
        </VisitProvider>
      </PatientProvider>
    );
  } else if (user.type === UserType.ADMIN) {
    return (
      <AdminHeader>
        <PhysiciansProvider>
          <DatasetsProvider>
            <AnnotationToolsProvider>
              <AnnotationTasksProvider>
                <FunctionsProvider>
                  <Routes>
                    <Route index element={<AdminHome />} />
                    <Route path="/users" element={<AdminUsers />} />
                    <Route path="/users/add" element={<AdminAddUser />} />
                    <Route path="/datasets" element={<AdminDatasets />} />
                    <Route path="/datasets/add" element={<AdminAddDataset />} />
                    <Route path="/tools" element={<AdminTools />} />
                    <Route path="/tools/add" element={<AdminAddTool />} />
                    <Route path="/tasks" element={<AdminTasks />} />
                    <Route path="/tasks/add" element={<AdminAddTask />} />
                    <Route path="/mediaStats" element={<AdminMediaStats />} />
                  </Routes>
                </FunctionsProvider>
              </AnnotationTasksProvider>
            </AnnotationToolsProvider>
          </DatasetsProvider>
        </PhysiciansProvider>
      </AdminHeader>
    );
  }
};

export default App;
