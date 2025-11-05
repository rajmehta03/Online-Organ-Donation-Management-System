import React from 'react';
import {
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Nav,
    Collapse,
    Button
} from 'reactstrap';
import NavigationLink from '../NavigationLink/NavigationLink';
import classes from './TopNavigation.module.css';
import {NavLink as RouterNavLink} from 'react-router-dom';
class TopNavigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isLoggedIn: false,
            hospitalName: ''
        }
    }

    componentDidMount() {
        this.checkLoginStatus();
    }

    checkLoginStatus = () => {
        const hospital = localStorage.getItem('hospital');
        if (hospital) {
            const hospitalData = JSON.parse(hospital);
            this.setState({ 
                isLoggedIn: true,
                hospitalName: hospitalData.hospitalName 
            });
        }
    }

    handleLogout = () => {
        localStorage.removeItem('hospital');
        localStorage.removeItem('token');
        this.setState({ isLoggedIn: false, hospitalName: '' });
        window.location.href = '/';
    }

    toggle = () => {
        this.setState(prevState => (
            {
                isOpen: !prevState.isOpen
            }
        ))
    }
    render() {
        const { isLoggedIn, hospitalName } = this.state;
        return (
            <div>
                <Navbar className={classes.navbar} fixed="top" expand="md">
                    <NavbarBrand tag={RouterNavLink} to="/" className={classes.navbarBrand}>Online Organ Donation Management System</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavigationLink iconName="home" linkTitle="Home" url="/"/>
                            <NavigationLink iconName="users" linkTitle="About" url="/about-us"/>
                            {isLoggedIn ? (
                                <>
                                    <NavigationLink iconName="bed" linkTitle="Organ Inventory" url="/organ-inventory"/>
                                    <NavigationLink iconName="bed" linkTitle="My Organ Requests" url="/my-requests"/>
                                    <NavigationLink iconName="envelope" linkTitle="Contact us" url="/contact-us"/>
                                    <li className="nav-item">
                                        <span className="navbar-text mr-3" style={{color: '#fff'}}>Welcome, {hospitalName}</span>
                                    </li>
                                    <li className="nav-item">
                                        <Button color="danger" size="sm" onClick={this.handleLogout}>Logout</Button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <NavigationLink iconName="bed" linkTitle="My Organ Requests" url="/my-requests"/>
                                    <NavigationLink iconName="envelope" linkTitle="Contact us" url="/contact-us"/>
                                    <NavigationLink iconName="user" linkTitle="Login" url="/hospital-login"/>
                                    <NavigationLink iconName="user-plus" linkTitle="Signup" url="/hospital-signup"/>
                                </>
                            )}
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default TopNavigation;