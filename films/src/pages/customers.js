import React from "react";
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import "./stylesheets.css";
import { useState, useEffect } from "react";

function changepage() {
    console.log("Page Changed");
}

function PaginatedItems({itemsPerPage}){
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [currentItems, setCurrentItems] = useState(null);
    const [data, setData] = useState([{}]);
    useEffect(()=>{
        fetch('/customerlist')
            .then(resp => resp.json())
            .then(data => setData(data))
    }, []);
    useEffect(()=>{
        
        console.log(items);
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems((items) ? items.slice(itemOffset, endOffset) : []);
        setPageCount(Math.ceil(items ? items.length : 0 / itemsPerPage));
    }, [data, itemOffset, itemsPerPage]);
    let items = data.customers?.map((customer, i) => (
        <tr>
            <td>{customer.name}</td>
            <td>{customer.email}</td>
            <td>{(customer.phone == '') ? customer.phone : 'N/A'}</td>
            <td>{customer.address}</td>
            <td>{customer.city}</td>
            <td>{customer.zip_code}</td>
            <td>{customer.country}</td>
            <td>{customer.customer_id}</td>
            <td>{customer.store_id}</td>
        </tr>
    ));

    const pageOnClick = (e) => {
        const newOffset = (e.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
    };

    return (
        <div>
            <table id="customer-table" style={{width:'100%'}}>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Zipcode</th>
                    <th>Country</th>
                    <th>Customer ID</th>
                    <th>Store ID</th>
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

const Customers = () => {
    
    return (
        <>
            <h1>Customer View</h1>
            <div id="splash">
                <PaginatedItems itemsPerPage={20} />
                
                
                
            </div>
        </>
    );
}

export default Customers