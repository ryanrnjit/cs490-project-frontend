import React, {useState, useEffect} from "react";
import "./stylesheets.css";
import { useNavigate } from "react-router-dom";

function FilmListing({actor, genre, film_id, title}) {
    let navigate = useNavigate()
    return(
        <tr>
            <td>{title}</td>
            <td>{actor}</td>
            <td>{genre}</td>
            <td><button onClick={()=>{navigate("/filmdetails", {state: {film_id: film_id}})}}>Details</button></td>
        </tr>
    );
}

const Films = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([{}]);
    useEffect(()=>{
        fetch(`/search?search=${encodeURI(searchTerm)}`).then(
            resp => resp.json()
        ).then(
            data => setData(data)
        );
    }, [searchTerm]);
    let results = data.films?.map((film, i) => (
        <FilmListing actor={film.actor_names} genre={film.category_name} film_id={film.film_id} title={film.title}/>
    ))
    let resultcount = data.result_count;
    return (
        <>
            <div id="splash">
            <h1>Sakila Film Search</h1>
            </div>
            <div id="splash">
            <input id="searchbox" onChange={(e)=>{setSearchTerm(e.currentTarget.value)}}></input>
            <p>{(data.result_count) ? `Found ${data.result_count} Results` : 'Enter film title, actor name, or genre to make a search.'}</p>
            <table>
                {results}
            </table>
            </div>
        </>
    );
}

export default Films