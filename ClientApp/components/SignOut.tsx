import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom';

import { RoutePaths } from '../routes';
import AuthService from '../services/Auth';
import AuthStore from '../stores/Auth';

let authService = new AuthService();

export class SignOut extends React.Component<RouteComponentProps<any>, any> {
    componentDidMount() {
        authService.signOut();
        this.props.history.push(RoutePaths.SignIn, { signedOut: true });
    }
    render() {
        return <div/>
    }
}
