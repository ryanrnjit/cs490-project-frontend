import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import "../pages/stylesheets.css";

function ActorRank({name, count, className, id}){
    const navigate = useNavigate();
    
    return(
        <>
        <div class="container" style={{marginTop:'10pt'}}>
            <img class="image" src={`https://placehold.co/172?text=${encodeURI(name)}`}></img>
            <span style={{padding:'10pt'}}>
                <h2>{name}</h2>
                <p><em>Featured in <strong>{count}</strong> {count > 1 ? "Films." : "Film."}</em></p>
                <button onClick={()=>{console.log(id); navigate("/actordetails", {state: {actor_id: id, actor_name: name}})}}>See more details</button>
            </span>

        </div>
            </>
    );
}
//<button onClick={()=>{console.log(id); navigate("/filmdetails", {state: {film_id: id}})}}>See details.</button>
export default ActorRank