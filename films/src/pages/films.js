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
            <td><button style={{width:'100%', height:'100%'}} onClick={()=>{navigate("/filmdetails", {state: {film_id: film_id}})}}>Details</button></td>
        </tr>
    );
}

const Films = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [timerEvent, setTimerEvent] = useState(false);
    const [data, setData] = useState([{}]);
    let timer = null;
    const updateQuery = (e) => {
        setSearchTerm(e.currentTarget.value);
        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(()=>{setTimerEvent(!timerEvent)}, 2000);
    }
    useEffect(()=>{
        fetch(`/search?search=${encodeURI(searchTerm)}`).then(
            resp => resp.json()
        ).then(
            data => setData(data)
        );
    }, [timerEvent]);
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
            <input id="searchbox" placeholder="example: Documentary" onChange={(e)=>{updateQuery(e)}}></input>
            <p>{(data.result_count) ? `Found ${data.result_count} Results` : 'Enter film title, actor name, or genre to make a search.'}</p>
            <table style={{width: '100%'}}>
                <tr>
                    <th>Title</th>
                    <th>Actors</th>
                    <th>Genre</th>
                    <th>View Details</th>
                </tr>
                {results}
            </table>
            </div>
        </>
    );
}

export default Films