import React, {useState, useEffect} from "react";
import "./stylesheets.css";
import { useLocation } from "react-router-dom";

const FilmDetails = () => {
    const {state} = useLocation();
    const {film_id} = state;
    const [data, setData] = useState([{}])
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
                
                <img id="filmposter" src={`https://placehold.co/228x325?text=${encodeURI(data['title'])}`}></img>
                <span style={{padding:'10pt'}} id="details">
                    <h2>Title: {data['title']}</h2>
                    <p>Description<br/>{data['description']}</p>
                    <p><em>Rated <strong>{data['rating']}</strong></em></p>
                    <p>Runtime: {data['length']} Minutes</p>
                    <p>Released: {data['release_year']}</p>
                    <p>Rent now for {data['rental_duration']} weeks at ${data['rental_rate']}</p>
                    </span>
            </div>
        </div>
    );
}

export default FilmDetails