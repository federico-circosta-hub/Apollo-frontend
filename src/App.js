import React, { useState } from 'react';
import './App.css';
import Login from './Components/View/Panels/Login';
import Header from './Components/View/OtherComponents/Header';
import { Route, Routes } from 'react-router-dom';
import NewPatient from './Components/View/Panels/NewPatient';
import SearchPatient from './Components/View/Panels/SearchPatient';
import SearchVisit from './Components/View/Panels/SearchVisit';
import NewVisit from './Components/View/Panels/NewVisit'
import { PatientProvider } from './Components/Model/PatientContext';
import { VisitProvider } from './Components/Model/VisitContext';
import SeeVisit from './Components/View/Panels/SeeVisit';
import { NewVisitProvider } from './Components/Model/NewVisitContext';
import JointSelection from './Components/View/Panels/JointSelection';
import Joint from './Components/View/Panels/Joint';
import Drug from './Components/View/Panels/Drug';
import EndVisit from './Components/View/Panels/EndVisit';
import { CurrentJointProvider } from './Components/Model/CurrentJointContext';
import Annotations from './Annotations_Components/View/Annotations';

function App() {

  const [name, setName] = useState(null)

  return (name != null) ?
    (
      <>
        <PatientProvider>
          <VisitProvider>
            <NewVisitProvider>
              <CurrentJointProvider>
                <Header data={name} logout={() => setName(null)} />

                <Routes>
                  <Route path='/newPatient' element={<NewPatient />} />
                  <Route index element={<SearchPatient />} />
                  <Route path='/newVisit' element={<NewVisit />} />
                  <Route path='/newVisit/jointSelection' element={<JointSelection />} />
                  <Route path='/newVisit/jointSelection/joint' element={<Joint />} />
                  <Route path='/newVisit/drug' element={<Drug />} />
                  <Route path='/searchVisit' element={<SearchVisit />} />
                  <Route path='/seeVisit' element={<SeeVisit />} />
                  <Route path='/newVisit/endVisit' element={<EndVisit />} />


                  <Route path='/annotations' element={<Annotations />} />

                </Routes >
              </CurrentJointProvider>
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
