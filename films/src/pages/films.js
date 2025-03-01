import React, {useState, useEffect} from "react";
import "./stylesheets.css";
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';


function RentalForm({film_id, title}) {
    const [data, setData] = useState([{}]);
    const [form, formSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        customer_id: '',
        staff_id: '',
        inventory_id: ''
    });
    const [responseData, setResponseData] = useState([{}]);
    const RentFilmButton = ()=>{
        if(data.count){
            return (<button type="submit"> Rent Film</button>)
        } else {
            return (<button type="submit" disabled> Rent Film</button>)
        }
    }
    //update formdata state.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    //Submit Form state.
    const submitForm = (e) => {
        e.preventDefault()
        formData.inventory_id = data.in_stock[0].inventory_id;
        console.log(formData);
        formSubmitted(true);
    };
    //send POST data.
    useEffect(()=>{
        if(form){
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            };
            fetch('/rentfilm', requestOptions)
            .then(response => {
                formSubmitted(false);
                return response.json();
            })
            .then(data => setResponseData(data));
        }
    }, [form]);
    //process Endpoint result message.
    useEffect(()=>{
        if(responseData){
            document.getElementById("response").textContent = responseData.message;
            console.log(responseData.message)
        }
        
    }, [responseData]);
    //Check if inventory in stock
    useEffect(()=>{
        fetch(`/instock?film_id=${film_id}`)
            .then(response => response.json())
            .then(data => {setData(data)});
    }, [form])

    return (
    <>
        <h2>Renting Film: {title}</h2>
        <p>{(data.count) ? `Currently In Stock: ${data.count}` : 'Out of Stock'}</p>
        <form onSubmit={submitForm}>
            <label for="customer_id">Fill in the Customer ID to rent this film to.</label><br/>
            <input required name="customer_id" type="number" onChange={handleChange} placeholder="Customer ID"></input> <br/> <br/>
            <label for="staff_id">Fill in your Staff ID.</label><br/>
            <input required name="staff_id" type="number" onChange={handleChange} placeholder="Your Staff ID"></input> <br/> <br/>
            <RentFilmButton/>
        </form>
        <p id="response" style={{fontWeight: 'bold'}}></p>
    </>
    );
}

function FilmListing({actor, genre, film_id, title}) {
    let navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    return(
        <tr>
            <td>{title}</td>
            <td>{actor}</td>
            <td>{genre}</td>
            <td><button style={{width:'100%', height:'100%'}} onClick={()=>{navigate("/filmdetails", {state: {film_id: film_id}})}}>Details</button></td>
            <td>
                <button style={{width:'100%', height:'100%'}} onClick={()=>setOpen(true)}>Rent</button>
                <Popup open={open} onClose={closeModal} modal>
                <div>
                    <RentalForm title={title} film_id={film_id}/>
                    <button className="close" onClick={closeModal}><strong>X</strong></button>
                </div>
                </Popup>
            </td>
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
        timer = setTimeout(()=>{setTimerEvent(!timerEvent)}, 1500);
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
            <p>{(data.result_count) ? `Found ${data.result_count} Results` : 'No results. Enter a film title, actor name, or genre to make a search.'}</p>
            <table style={{width: '100%'}}>
                <tr>
                    <th>Title</th>
                    <th>Actors</th>
                    <th>Genre</th>
                    <th>View Details</th>
                    <th>Rent</th>
                </tr>
                {results}
            </table>
            </div>
        </>
    );
}

export default Films