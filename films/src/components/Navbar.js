import React from "react";
import {Nav, NavLink, NavMenu} from "./NavbarElements"

const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/" activeStyle> Home </NavLink>
                    <NavLink to="/films" activeStyle> Films </NavLink>
                    <NavLink to="/customers" activeStyle> Customers </NavLink>
                </NavMenu>
            </Nav>
        </>
    )
};

export default Navbar