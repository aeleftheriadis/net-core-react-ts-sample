import * as React from "react";
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import { RoutePaths } from '../routes';
import AuthService from '../services/Auth';
import '../css/Auth.css';
import AuthStore from '../stores/Auth';

let authService = new AuthService();

export class SignIn extends React.Component<RouteComponentProps<any>, any> {
    refs: {
        username: HTMLInputElement;
        password: HTMLInputElement;
    }

    state = {
        initialLoad: true,
        error: null as string
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        this.setState({ errors: null, initialLoad: false });
        authService.signIn(this.refs.username.value, this.refs.password.value).then(response => {
            if (!response.is_error) {
                this.props.history.push(RoutePaths.Pages);
            } else {
                this.setState({ error: response.error_content });
            }
        });
    }

    render() {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);

        let initialLoadContent = null;
        if (this.state.initialLoad) {

            if (params.get('expired')) {
                initialLoadContent = <div className="alert alert-info" role="alert">
                    <strong>Η σύνδεσή σας έληξε</strong> Συνδεθείτε ξανά.
                    </div>
            }

            if (this.props.history.location.state && this.props.history.location.state.signedOut) {
                initialLoadContent = <div className="alert alert-info" role="alert">
                    <strong>Αποσυνδεθήκατε</strong>
                </div>
            }
        }
        if (AuthStore.getToken() !== null) {
            this.props.history.push(RoutePaths.Pages);
        }
        return <div className="auth">
            <form className="formAuth" onSubmit={(e) => this.handleSubmit(e)}>
                <h2 className="form-signin-heading">Παρακαλώ συνδεθείτε</h2>
                {initialLoadContent}
                {this.state.error &&
                    <div className="alert alert-danger" role="alert">
                        {this.state.error}
                    </div>
                }
                <label htmlFor="inputUserName" className="form-control-label sr-only">Όνομα χρήστη</label>
                <input type="text" id="inputUserName" ref="username" defaultValue="user" className="form-control form-control-danger" placeholder="Όνομα χρήστη"/>
                <label htmlFor="inputPassword" className="form-control-label sr-only">Κωδικός πρόσβασης</label>
                <input type="password" id="inputPassword" ref="password" defaultValue="P2ssw0rd!" className="form-control" placeholder="Κωδικός πρόσβασης" />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Σύνδεση</button>
            </form>
        </div>;
    }
}