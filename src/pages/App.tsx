import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { APIContext } from '../Components/APIContext';
import { NavBar } from '../Components/Misc/NavBar';
import './../Components/common.scss';
import { LabSwapPage } from './LabSwapPage';
import Landing from './Landing';
import Profile from './Profile';
import Scheduling from './Scheduling';

export const App = () => {
  return (
    <div className="App">
      < APIContext test={false}>
        <Router>
          < NavBar />
          <Routes>
            <Route path='/' element={<Landing/>} />
            <Route path='/Scheduling' element={<Scheduling/>} />
            <Route path='/Profile' element={<Profile/>} />
            <Route path='/Labswap' element={<LabSwapPage/>} />
          </Routes>
        </Router>
      </APIContext>
    </div>
  );
}

export default App;

