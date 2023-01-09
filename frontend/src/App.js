import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LogIn } from "./elements/login.element";
import { Register } from "./elements/register.element";
import { Protected } from "./elements/protected.element";
import { Navbar } from "./elements/navbar.element";
import { Main } from "./elements/main.element";
import { NewNote } from "./elements/newnote.element";
import { EditNote } from "./elements/editnote.element";
import { Search } from "./elements/note.element";

function App() {
  return (
    <div style={{backgroundColor: 'white'}}>
    <Router >
      <Navbar/>
      <Routes className="container">
        <Route path="/" element={<Main/>}/>
        <Route path="/search/:query" element={<Search/>}/>
        <Route path="/edit/:id" element={<EditNote/>}/>
        <Route path="/newnote" element={<NewNote/>}/>
        <Route path="/login" element={<LogIn/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/protected" element={<Protected/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
