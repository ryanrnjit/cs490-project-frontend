import React, { useState, useEffect } from 'react'
import Navbar from "./components/Navbar.js"
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import './App.css';
import Home from "./pages";
import FilmDetails from './pages/filmdetails.js';
import ActorDetails from './pages/actordetails.js';

function App() {
    return(
        <Router>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="filmdetails" element={<FilmDetails />}/>
                <Route exact path="actordetails" element={<ActorDetails />}/>
            </Routes>
        </Router>
    );
}

export default App;
