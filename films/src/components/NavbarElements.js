import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
    background: #004ba8;
    height: 40px;
    display: flex;
    user-select: none;
    justify-content: space-between;
    padding: 1vh calc((100vw - 350px) / 2);
    z-index: 12;
`;

export const NavLink = styled(Link)`
    color: white;
    display: flex;
    background-color:rgb(93, 130, 252);
    border-radius: 15pt;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    margin: 10pt;
    cursor: pointer;
    &.active {
        background-color:cornflowerblue;
    }
`;

export const Bars = styled(FaBars)`
    display: none;
    color: #98a6d4;
    @media screen and (max-width: 768px) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 75%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`;

export const NavMenu = styled.div`
    display: flex;
    align-items: center;
    margin-right: -24px;
    /* Second Nav */
    /* margin-right: 24px; */
    /* Third Nav */
    /* width: 100vw;
white-space: nowrap; */
    @media screen and (max-width: 768px) {
        display: none;
    }
`;