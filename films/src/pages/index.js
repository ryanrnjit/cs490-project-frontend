import React, {useState, useEffect} from "react";
import "./stylesheets.css";
import FilmRentalRank from "../components/FilmRentalRank.js"
import ActorRank from "../components/ActorRank.js";


const Home = () => {
    const [filmData, setFilmData] = useState([{}])
    const [data, setData] = useState([{}])
    useEffect(() => {
        fetch("/topfivefilms").then(
            resp => resp.json()
        ).then(
            data => {
                console.log(data);
                setFilmData(data);
            }
        )
    }, []);
    var listings = filmData.films?.map((film, i) => (
        <FilmRentalRank className="topfiverentallisting" title={film.title} count={film.rental_count} id={film.film_id}></FilmRentalRank>
    ));
    useEffect(() => {
        fetch("/topfiveactors").then(
            resp => resp.json()
        ).then(
            data => {
                console.log(data);
                setData(data);
            }
        )
    }, []);
    var actors = data.actors?.map((actor, i) => (
        <ActorRank className="topfiveactorlisting" name={actor.actor_name} count={actor.film_count} id={actor.actor_id}></ActorRank>
    ))
    return (
        <>
        <div id="splash">
            <h1>Sakila Film Rental Home</h1>
        </div>
        <div id="splash">
            <h2>Top Five Films Of All Time:</h2>
            {listings}
        </div>
        
        <div id="splash">
            <h2>Top Five Actors Of All Time</h2>
            {actors}
        </div>
        </>
    );
}
export default Home;