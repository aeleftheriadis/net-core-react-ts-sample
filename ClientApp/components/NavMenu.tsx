import * as React from 'react';
import { Link, NavLink, Redirect } from 'react-router-dom';
import { RouteComponentProps } from "react-router";
import { RoutePaths } from '../routes';
import AuthService from '../services/Auth';
import AuthStore from '../stores/Auth';
import * as FontAwesome from "react-fontawesome";

let authService = new AuthService();

export class NavMenu extends React.Component<{}, {}> {

    signOut() {
        authService.signOut();
    }
    public render() {
        return <div className='main-nav'>
                <nav className='navbar navbar-inverse bg-inverse'>       
                <Link className='navbar-brand' to={ '/' }>admin</Link>
                <div className='clearfix'></div>
                <div className='navbar-collapse'>
                    <ul className='navbar-nav mr-auto'>
                        <li>
                            <NavLink to={RoutePaths.Pages} activeClassName='active'>
                                <FontAwesome name="book"/> Σελίδες
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={RoutePaths.Tips} activeClassName='active'>
                                <FontAwesome name="tags" />  Συμβουλές
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={RoutePaths.Places} activeClassName='active'>
                                <FontAwesome name="map" />  Σημεία ενδιαφέροντος
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={RoutePaths.Users} activeClassName='active'>
                                <FontAwesome name="users" />  Χρήστες
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={RoutePaths.SignOut} activeClassName='active'>
                                <FontAwesome name="sign-out" /> Αποσύνδεση
                            </NavLink>
                        </li>
                    </ul>                    
                </div>
            </nav>
        </div>;
    }
}
