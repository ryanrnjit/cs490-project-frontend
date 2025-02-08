import React, {useState, useEffect} from "react";
import "./stylesheets.css";
import FilmRentalRank from "../components/FilmRentalRank.js"


const Home = () => {
    const [data, setData] = useState([{}])
    useEffect(() => {
        fetch("/topfivefilms").then(
            resp => resp.json()
        ).then(
            data => {
                console.log(data)
                setData(data)
            }
        )
    }, []);
    var listings = data.films?.map((film, i) => (
        <FilmRentalRank className="topfiverentallisting" title={film.title} count={film.rental_count} id={film.film_id}></FilmRentalRank>
    ));
    return (
        <div id="splash">
            <h1>Sakila Hitfilms Home</h1>
            <h2>Top Five Films Today:</h2>
            {listings}
        </div>
    );
}
export default Home;