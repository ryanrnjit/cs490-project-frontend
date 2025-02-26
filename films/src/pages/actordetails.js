import React, {useState, useEffect} from "react";
import "./stylesheets.css";
import {useNavigate} from "react-router-dom";
import { useLocation } from "react-router-dom";

const ActorDetails = () => {
    const {state} = useLocation();
    const {actor_id, actor_name} = state;
    const [data, setData] = useState([{}]);
    const navigate = useNavigate();
    console.log(actor_id);
    useEffect(()=>{
        fetch(`/actordetails?actor_id=${actor_id}`)
        .then(response => response.json())
        .then(data => setData(data))
    }, []); 
    return (
        <div>
            <h1 id="titleHeader">Actor Details: {actor_name}</h1>
            <div id="splash" class="container">
                
                <img class="image" id="actorpicture" src={`https://placehold.co/325?text=${encodeURI(actor_name)}`}></img>
                <span style={{padding:'10pt'}} id="details">
                    <strong>{actor_name} Top 5 Movies:</strong>
                    <ol>
                        {data.films?.map((film, i) => (
                            <li> <button class="linkbutton" onClick={()=>{navigate("/filmdetails", {state: {film_id: film.film_id}})}}><em>{film.title}</em></button></li>
                        ))}
                    </ol>
                    <sup>(id: {actor_id})</sup><br/>
                    <button onClick={()=>{navigate("/")}}>← Go Home</button>
                </span>
            </div>
        </div>
    );
}

export default ActorDetails