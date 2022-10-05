import React from 'react';
import {Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
/* Import Pages */
import MainPage from "./Main";
import Search from "./Search";
import Polypharm from "./Polypharm";
import Adverse from "./Adverse";
import New from "./New";
import './App.css';

function App() {
  return (
    <div className="container">
      <Routes>
        <Route exact path='/' element={<MainPage />}/>
        <Route exact path='/search' element={<Search />}/>
        <Route exact path='/poly/drug/:drugId/:snuhId' element={<Polypharm />}/>
        <Route exact path='/adverse/drug/:drugId/:snuhId' element={<Adverse />}/>
        <Route exact path='/new' element={<New />}/>
      </Routes>
    </div>
  );
}

export default App;