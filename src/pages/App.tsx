import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { APIContext } from '../Components/APIContext';
import { NavBar } from '../Components/Misc/NavBar';
import './../Components/common.scss';
import { LabSwapPage } from './LabSwapPage';
import Landing from './Landing';
import Profile from './Profile';
import Scheduling from './Scheduling';
import { AdminPage } from './AdminPage';

export const App = () => {
  return (
    <div className="App">
      < APIContext test={false}>
        <Router>
          < NavBar />
          <Routes>
            <Route path='/' element={<Landing/>} />
            <Route path='/scheduling' element={<Scheduling/>} />
            <Route path='/profile' element={<Profile/>} />
            <Route path='/labswap' element={<LabSwapPage/>} />
            <Route path='/admin' element={<AdminPage/>} />
          </Routes>
        </Router>
      </APIContext>
    </div>
  );
}

export default App;

