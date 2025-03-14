import React from "react";
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import "./stylesheets.css";
import Popup from 'reactjs-popup';
import { useState, useEffect } from "react";

var FormSubmittedFlag = false;
var ForceRerender = 0;

function ReturnButton({rental_id, name, returnable}){
    const [data, setData] = useState([{}]);
    function returnrequest(){
        if(window.confirm(`Return Customer ${name}'s rental?`)) {
            const requestOptions = {
                method: 'PATCH',
            };
            fetch(`/returnfilm/${rental_id}`, requestOptions)
            .then(resp => resp.json())
            .then(data => setData(data))
        }
    }
    useEffect(()=>{
        if(data.message){
            alert(data.message);
            document.querySelector(".close").click();
        }},[data]);
    let isDisabled = {disabled: !returnable}
    return(
        <span style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <button {...isDisabled} title="Return Film" onClick={returnrequest}>📩</button>
        </span>
    )
}

function PaginatedRentalItems({itemsPerPage, customer_id, name}) {
    const [rentalData, setRentalData] = useState([{}]);
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [currentItems, setCurrentItems] = useState(null);

    useEffect(()=>{
        fetch(`/customerrentals/${customer_id}`)
        .then(resp => resp.json())
        .then(data => setRentalData(data))
    }, []);
    useEffect(()=>{
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems((items) ? items.slice(itemOffset, endOffset) : []);
        setPageCount(Math.ceil((items ? items.length : 0) / itemsPerPage));
        console.log(items, pageCount, items ? items.length : 0, itemsPerPage, (items ? items.length : 0) / itemsPerPage);
    }, [rentalData, itemOffset, itemsPerPage]);
    var items = rentalData.rentals?.map((rental, i)=>(
        <tr>
            <td>{rental.rental_id}</td>
            <td>{rental.inventory_id}</td>
            <td>{rental.rental_date}</td>
            <td>{((rental.return_date == null) ? "Not Returned" : rental.return_date)}</td>
            <td><ReturnButton returnable={(rental.return_date == null)} rental_id={rental.rental_id} name={name}/></td>
        </tr>
    ))
    const pageOnClick = (e) => {
        const newOffset = (e.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
    };
    return(
        <>
            <h2>Rental History:</h2>
            <table style={{width: '100%'}}>
                <tr>
                    <th>Rental ID</th>
                    <th>Inventory ID</th>
                    <th>Rental Date</th>
                    <th>Date Returned</th>
                    <th>Options</th>
                </tr>
                {currentItems}
            </table>
            <ReactPaginate 
                breakLabel="..."
                nextLabel="→"
                onPageChange={pageOnClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="←"
                containerClassName="pagination"
                activeLinkClassName="pagselected"
            />
        </>
    );
}

function CustomerDetails({customer_id, name}){
    const [customerData, setCustomerData] = useState([{}]);
    
    useEffect(()=>{
        fetch(`/getcustomer/${customer_id}`)
        .then(resp => resp.json())
        .then(data => setCustomerData(data))
    },[]);
    return (
        <>
            <h2>Customer Details: {name}</h2>
            <p><strong>Full name: </strong>{name}</p>
            <p><strong>Email address: </strong>{customerData['email']}</p>
            <p><strong>Phone number: </strong>{(customerData['phone'] != ' ') ? customerData['phone'] : "No phone number on record"}</p>
            <p><strong>Address: </strong>{customerData['address']}</p>
            <p><strong>Address 2: </strong>{(customerData['address2'] != null) ? customerData['address2'] : "None"}</p>
            <p><strong>District: </strong>{(customerData['district'] != " ") ? customerData['district'] : "None"}</p>
            <p><strong>City: </strong>{customerData['city']}</p>
            <p><strong>Country: </strong>{customerData['country']}</p>
            <p><strong>Zipcode: </strong>{customerData['postal_code']}</p>
            <p><strong>Account created: </strong>{customerData['create_date']}</p>
            <sup>(id: {customerData['customer_id']})</sup>
            <PaginatedRentalItems itemsPerPage={5} customer_id={customer_id} name={name}/>
        </>
    );
}

function ViewButton({customer_id, name}){
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    return (
        <>
            <button title="Customer Details" onClick={()=>setOpen(true)}>📃</button>
            <Popup open={open} onClose={closeModal} modal>
                <div>
                    <CustomerDetails customer_id={customer_id} name={name}/>
                    <button className="close" onClick={closeModal}><strong>X</strong></button>
                </div>
            </Popup>
        </>
    );
}

function DeleteButton({customer_id, name}){
    const [data, setData] = useState([{}]);
    function deleterequest(){
        if(window.confirm(`Delete Customer ${name} (id: ${customer_id})?\nThis CANNOT be undone.`)) {
            const requestOptions = {
                method: 'DELETE',
            };
            fetch(`/deletecustomer/${customer_id}`, requestOptions)
            .then(resp => resp.json())
            .then(data => setData(data))
        }
    }
    useEffect(()=>{
        if(data.message){
            alert(data.message);
            window.location.reload();
        }},[data]);
    return(
        <button title="Delete Customer" onClick={deleterequest}>❌</button>
    )
}

function PaginatedItems({itemsPerPage}){
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [currentItems, setCurrentItems] = useState(null);
    const [data, setData] = useState([{}]);
    const [searchTerm, setSearchTerm] = useState("");
    const [timerEvent, setTimerEvent] = useState(false);
    let timer = null;
    useEffect(()=>{
        fetch(`/customerlist?search_type=${encodeURI(document.getElementById("filter").value)}&search_term=${encodeURI(searchTerm)}`)
            .then(resp => resp.json())
            .then(data => setData(data))
    }, [FormSubmittedFlag, timerEvent]);
    useEffect(()=>{
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems((items) ? items.slice(itemOffset, endOffset) : []);
        setPageCount(Math.ceil((items ? items.length : 0) / itemsPerPage));
    }, [data, itemOffset, itemsPerPage, ForceRerender]);
    let items = data.customers?.map((customer, i) => (
        <tr>
            <td>{customer.customer_id}</td>
            <td>{customer.name}</td>
            <td>{customer.email}</td>
            <td>{(customer.phone != ' ') ? customer.phone : 'N/A'}</td>
            <td>{customer.address}</td>
            <td>{customer.city}</td>
            <td>{customer.zip_code}</td>
            <td>{customer.country}</td>
            <td style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '5pt'}}>
                <ViewButton customer_id={customer.customer_id} name={customer.name}/>
                <EditButton customer_id={customer.customer_id} name={customer.name}/>
                <DeleteButton customer_id={customer.customer_id} name={customer.name}/>
            </td>
        </tr>
    ));

    function handleChange(){
        document.getElementById("searchbar").disabled = (document.getElementById("filter").value == "0")
        setSearchTerm(document.getElementById("searchbar").value)
        timer = setTimeout(()=>{setTimerEvent(!timerEvent)}, 1500);
    }

    const pageOnClick = (e) => {
        const newOffset = (e.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
    };

    return (
        <div>
            <input id="searchbar" disabled type="text" onChange={handleChange} placeholder="Search by filter"></input>
            <label for="filter">  Filter Search:</label>
            <select id="filter" onChange={handleChange}>
                <option value="0">No Filter</option>
                <option value="1">ID</option>
                <option value="2">First Name</option>
                <option value="3">Last Name</option>
            </select> <br/><br/>
            <table id="customer-table" style={{width:'100%'}}>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Zipcode</th>
                    <th>Country</th>
                    <th>Options</th>
                </tr>
                {currentItems}   
            </table>
                <ReactPaginate 
                breakLabel="..."
                nextLabel="→"
                onPageChange={pageOnClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="←"
                containerClassName="pagination"
                activeLinkClassName="pagselected"
            />
        </div>
        
        
    );
}

function EditCustomerForm({customer_id}){
    const [data, setData] = useState([{}]);
    const [form, formSubmitted] = useState(false);
    const [countryData, setCountryData] = useState([{}]);
    const [formData, setFormData] = useState({
        country_id: '0',
        address: '',
        address2: '',
        city: '',
        district: '',
        postal_code: '',
        phone: '',
        first_name: '',
        last_name: '',
        email: '',
        customer_id: customer_id,
        address_id: '',
        city_id: ''
    });
    //get countries
    useEffect(()=>{
        fetch("/countries")
        .then(resp => resp.json())
        .then(data => setData(data))
    },[]);
    //fill in customer info
    useEffect(()=>{
        fetch(`/getcustomer/${customer_id}`)
        .then(resp => resp.json())
        .then(data => {
            document.getElementById("fname").value = data.first_name;
            document.getElementById("lname").value = data.last_name;
            document.getElementById("addr").value = data.address;
            document.getElementById("secaddr").value = data.address2;
            document.getElementById("district").value = data.district.trim();
            document.getElementById("city").value = data.city;
            document.getElementById("zip").value = data.postal_code;
            document.getElementById("email").value = data.email;
            document.getElementById("phone").value = data.phone.trim();
            document.getElementById("country").value = data.country_id;
            setFormData({
                country_id: data.country_id,
                address: data.address,
                address2: data.address2,
                city: data.city,
                district: data.district.trim(),
                postal_code: data.postal_code,
                phone: data.phone.trim(),
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                customer_id: customer_id,
                address_id: data.address_id,
                city_id: data.city_id
            });
        })
    },[])
    const [responseData, setResponseData] = useState([{}]);
    //update formdata state.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(formData);
    };
    //Submit Form state.
    const submitForm = (e) => {
        e.preventDefault()
        console.log(formData);
        if(formData.country_id == '0'){
            document.getElementById("response").textContent = "Please select a country.";
            return;
        }
        formSubmitted(true);
        ForceRerender+=1;
    };
    //send POST data.
    useEffect(()=>{
        if(form){
            const requestOptions = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            };
            fetch('/editcustomer', requestOptions)
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
            if(responseData.message && responseData.message.includes("Success")) {
                setTimeout(()=>{if(window.confirm("Refresh page to see changes?")) window.location.reload();}, 1000);
            }
            console.log(responseData)
        }
        
    }, [responseData]);
    const options = data.countries?.map((country, i)=>(
        <option value={country.id}>{country.country}</option>
    ))
    return (
        <>
            <h2>Edit Customer</h2>
            <p>Fill in new customer info here:</p>
            <form onSubmit={submitForm}>
                <input id="fname" required type="text" name="first_name" placeholder="First Name" onChange={handleChange}></input>
                <input id="lname" required style={{margin: '0 20pt'}} type="text" name="last_name" placeholder="Last Name" onChange={handleChange}></input> <br/><br/>
                <input id="addr" style={{width: '67%'}} required type="text" name="address" placeholder="Address" onChange={handleChange}></input> <br/><br/>
                <input id="secaddr" style={{width: '67%'}} type="text" name="address2" placeholder="Second Address (optional)" onChange={handleChange}></input> <br/><br/>
                <input id="district" style={{width: '67%'}} type="text" name="district" placeholder="District (optional)" onChange={handleChange}></input> <br/><br/>
                <input id="city" required type="text" name="city" placeholder="City" onChange={handleChange}></input>  
                <input id="zip" required style={{margin: '0 20pt'}} maxLength={5} type="text" pattern="[0-9]{5,5}" name="postal_code" placeholder="Zipcode" onChange={handleChange}></input> <br/><br/>
                <input id="email" required type="text" name="email" placeholder="Email Address" onChange={handleChange}></input>
                <input id="phone" style={{margin: '0 20pt'}} type="text" pattern="[0-9]{10,10}" maxLength={10} name="phone" placeholder="Phone Number (optional)" onChange={handleChange}></input> <br/><br/>
                <label for="country_id">Country: </label>
                <select id="country" placeholder="Select a country" name="country_id" onChange={handleChange}>
                    <option value="0">Select a Country</option>
                    {options}
                </select> <br/><br/>
                <button type="submit">Update Customer</button>
            </form>
            <p id="response"></p>
        </>
    )
}

function EditButton({customer_id, name}){
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    return(
        <>
        <button title="Edit Customer" onClick={()=>setOpen(true)}>✍</button>
        <Popup open={open} onClose={closeModal} modal>
            <div>
                <EditCustomerForm customer_id={customer_id}/>
                <button className="close" onClick={closeModal}><strong>X</strong></button>
            </div>
        </Popup>
        </>
    )
}

function CreateCustomerForm() {
    const [data, setData] = useState([{}]);
    const [form, formSubmitted] = useState(false);
    const [countryData, setCountryData] = useState([{}]);
    const [formData, setFormData] = useState({
        country_id: '0',
        address: '',
        address2: '',
        city: '',
        district: '',
        postal_code: '',
        phone: '',
        first_name: '',
        last_name: '',
        email: ''
    });
    //get countries
    useEffect(()=>{
        fetch("/countries")
        .then(resp => resp.json())
        .then(data => setData(data))
    },[]);
    const [responseData, setResponseData] = useState([{}]);
    //update formdata state.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(formData);
    };
    //Submit Form state.
    const submitForm = (e) => {
        e.preventDefault()
        console.log(formData);
        if(formData.country_id == '0'){
            document.getElementById("response").textContent = "Please select a country.";
            return;
        }
        formSubmitted(true);
        FormSubmittedFlag = !FormSubmittedFlag;
    };
    //send POST data.
    useEffect(()=>{
        if(form){
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            };
            fetch('/createcustomer', requestOptions)
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
            if(responseData.message && responseData.message.includes("Success")) {
                setTimeout(()=>{if(window.confirm("Refresh page to see changes?")) window.location.reload();}, 1000);
            }
        }
        
    }, [responseData]);
    const options = data.countries?.map((country, i)=>(
        <option value={country.id}>{country.country}</option>
    ))
    return (
        <>
            <h2>Create Customer</h2>
            <p>Fill in new customer info here:</p>
            <form onSubmit={submitForm}>
                <input required type="text" name="first_name" placeholder="First Name" onChange={handleChange}></input>
                <input required style={{margin: '0 20pt'}} type="text" name="last_name" placeholder="Last Name" onChange={handleChange}></input> <br/><br/>
                <input style={{width: '67%'}} required type="text" name="address" placeholder="Address" onChange={handleChange}></input> <br/><br/>
                <input style={{width: '67%'}} type="text" name="address2" placeholder="Second Address (optional)" onChange={handleChange}></input> <br/><br/>
                <input style={{width: '67%'}} type="text" name="district" placeholder="District (optional)" onChange={handleChange}></input> <br/><br/>
                <input required type="text" name="city" placeholder="City" onChange={handleChange}></input>  
                <input required style={{margin: '0 20pt'}} maxLength={5} type="text" pattern="[0-9]{5,5}" name="postal_code" placeholder="Zipcode" onChange={handleChange}></input> <br/><br/>
                <input required type="text" name="email" placeholder="Email Address" onChange={handleChange}></input>
                <input style={{margin: '0 20pt'}} type="text" pattern="[0-9]{10,10}" maxLength={10} name="phone" placeholder="Phone Number (optional)" onChange={handleChange}></input> <br/><br/>
                <label for="country_id">Country: </label>
                <select placeholder="Select a country" name="country_id" onChange={handleChange}>
                    <option value="0">Select a Country</option>
                    {options}
                </select> <br/><br/>
                <button type="submit">Create Customer</button>
            </form>
            <p id="response"></p>
        </>
    )
}

const Customers = () => {
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    return (
        <>
            <h1>Customer View</h1>
            <div id="splash">
                <div id="customer_controlbuttons" style={{padding: '10pt 0pt'}}>
                    <button onClick={()=>setOpen(true)}>Create Customer</button>
                    <Popup open={open} onClose={closeModal} modal>
                        <div>
                            <CreateCustomerForm/>
                            <button className="close" onClick={closeModal}><strong>X</strong></button>
                        </div>
                    </Popup>
                </div>
                <PaginatedItems itemsPerPage={20} />
            </div>
        </>
    );
}

export default Customers