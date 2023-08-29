import React, { useState } from 'react';
import './App.css';
import Login from './Components/View/Login';
import Header from './Components/View/Header';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/View/Home';
import NewPatient from './Components/View/NewPatient';
import SearchPatient from './Components/View/SearchPatient';
import Visit from './Components/View/Visit';
import SearchVisit from './Components/View/SearchVisit';
import NewVisit from './Components/View/NewVisit'
import { PatientProvider } from './Components/Model/PatientContext';
import { VisitProvider } from './Components/Model/VisitContext';
import NewVisitPast from './Components/View/NewVisitPast';
import SeeVisit from './Components/View/SeeVisit';
import { NewVisitProvider } from './Components/Model/NewVisitContext';
import JointSelection from './Components/View/JointSelection';
import Joint from './Components/View/Joint';
import Drug from './Components/View/Drug';
import FollowUp from './Components/View/FollowUp';
import JointPage2 from './Components/View/JointPage2';

function App() {

  const [name, setName] = useState(null)

  return (name != null) ?
    (
      <>
        <Header data={name} logout={() => setName(null)} />
        <PatientProvider>
          <VisitProvider>
            <NewVisitProvider>
              <Routes>
                <Route index element={<Home />} />
                <Route path='/newPatient' element={<NewPatient />} />
                <Route path='/searchPatient' element={<SearchPatient />} />

                <Route path='/visit' element={<Visit />} />
                <Route path='/visit/newVisitInPresence' element={<NewVisit />} />
                <Route path='/visit/newVisitInPresence/jointSelection' element={<JointSelection />} />
                <Route path='/visit/newVisitInPresence/jointSelection/joint' element={<Joint />} />
                <Route path='/visit/newVisitInPresence/jointSelection/jointPage2' element={<JointPage2 />} />
                <Route path='/visit/newVisitInPresence/drug' element={<Drug />} />
                <Route path='/visit/newVisitInPresence/followUp' element={<FollowUp />} />
                <Route path='/visit/newVisitPast' element={<NewVisitPast />} />
                <Route path='/visit/searchVisit' element={<SearchVisit />} />
                <Route path='/visit/seeVisit' element={<SeeVisit />} />


              </Routes >
            </NewVisitProvider>
          </VisitProvider>
        </PatientProvider>
      </>
    )
    :
    (
      <Login setName={setName} />
    )

}

export default App;
