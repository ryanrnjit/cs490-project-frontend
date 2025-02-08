import React, { useState } from "react";
import {Navigate, useNavigate} from "react-router-dom"
import FilmDetails from "../pages/filmdetails";

function FilmRentalRank({title, count, className, id}){
    //const [gotoDetails, setgotoDetails] = React.useState(false);
    //const [film_id, setFilm_id] = useState("");
    const navigate = useNavigate();
    
    return(
            <div class={className}>
                <h2>{title}</h2>
                <p>Rental Count: {count}</p>
                <button onClick={()=>{console.log(id); navigate("/filmdetails", {state: {film_id: id}})}}>See details.</button>
            </div>
    );
}

export default FilmRentalRank