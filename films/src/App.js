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

function App() {
    return(
        <Router>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="filmdetails" element={<FilmDetails />}/>
            </Routes>
        </Router>
    );
  /*const [data, setData] = useState([{}])
  useEffect(() => {
    fetch("/films").then(
        resp => resp.json()
    ).then(
        data => {
            console.log(data)
            setData(data)
        }
    )
  }, [])
  return (
    <table>
        <tr>
            <th>Film ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Release Date</th>
            <th>Language ID</th>
            <th>Rental Duration</th>
            <th>Rental Rate</th>
            <th>Length</th>
            <th>Replacement Cost</th>
            <th>Rating</th>
            <th>Special Features</th>
        </tr>
        {(typeof data.films === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        data.films.map((film, i) => (
          <tr key={i}>
            <td>{film.id}</td>
            <td>{film.title}</td>
            <td>{film.description}</td>
            <td>{film.release_year}</td>
            <td>{film.language_id}</td>
            <td>{film.rental_duration}</td>
            <td>{film.rental_rate}</td>
            <td>{film.length}</td>
            <td>{film.replacement_cost}</td>
            <td>{film.rating}</td>
            <td>{film.special_features}</td>
          </tr>
        ))
      )}
    </table>
  );*/
}

export default App;
