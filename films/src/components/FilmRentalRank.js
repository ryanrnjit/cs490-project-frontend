import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import FilmDetails from "../pages/filmdetails";

function FilmRentalRank({title, count, className, id}){
    //const [gotoDetails, setgotoDetails] = React.useState(false);
    //const [film_id, setFilm_id] = useState("");
    const navigate = useNavigate();
    
    return(
            <div class="container" style={{marginTop:'10pt'}}>
                <img src={`https://placehold.co/171x244?text=${encodeURI(title)}`}></img>
                <span style={{padding: '10pt'}}>
                    <h2>{title}</h2>
                    <p>Rental Count: {count}</p>
                    <button onClick={()=>{console.log(id); navigate("/filmdetails", {state: {film_id: id}})}}>See details.</button>
                </span>
            </div>
    );
}

export default FilmRentalRank