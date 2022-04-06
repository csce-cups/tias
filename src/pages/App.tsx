import React from 'react';
import { NavBar } from '../Components/Misc/NavBar';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Profile from './Profile';
import Scheduling from './Scheduling';
import Landing from './Landing';
import './../Components/common.scss';
import { APIContext } from '../Components/APIContext';
import { LabSwapPage } from './LabSwapPage';
import { Admin } from './Admin';

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
            <Route path='/Admin' element={<Admin/>} />
          </Routes>
        </Router>
      </APIContext>
    </div>
  );
}

export default App;

