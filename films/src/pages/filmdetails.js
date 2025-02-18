import React, {useState, useEffect} from "react";
import "./stylesheets.css";
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";

const FilmDetails = () => {
    const {state} = useLocation();
    const {film_id} = state;
    const [data, setData] = useState([{}])
    const navigate = useNavigate();
    console.log(film_id);
    useEffect(()=>{
        fetch(`/filmdetails?film_id=${film_id}`)
        .then(response => response.json())
        .then(data => setData(data))
    }, []); 
    return (
        <div>
            <h1 id="titleHeader">Film Details: {data['title']}</h1>
            <div id="splash" class="container">
                
                <img id="filmposter" src={`https://placehold.co/285x406?text=${encodeURI((data['title']) ? data['title'] : "Loading...")}`}></img>
                <span style={{padding:'10pt'}} id="details">
                    <strong style={{fontSize:'x-large'}}>Title: {data['title']}</strong><br/>
                    <p>Description<br/>{data['description']}</p>
                    <p><em>Rated <strong>{data['rating']}</strong></em></p>
                    <p>Genre: <em>{data['genre']}</em></p>
                    <p>Runtime: {data['length']} Minutes</p>
                    <p>Released: {data['release_year']}</p>
                    <p>Includes special features: {data['special_features']?.replaceAll(',', ', ')}</p>
                    <p>Rental rate: ${data['rental_rate']} a week for {data['rental_duration']} weeks.</p>
                    <p>Replacement charges for lost items: ${data['replacement_cost']}</p>
                    <sup>(id: {data['film_id']})</sup><br/>
                    <button onClick={()=>{navigate("/")}}>← Go Home</button>
                    </span>
            </div>
        </div>
    );
}

export default FilmDetails