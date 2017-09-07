import 'object-assign';
import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import UsersService from '../services/Users';
import { RoutePaths } from '../routes';
import { RouteComponentProps } from "react-router";

let usersService = new UsersService();

export class Users extends React.Component<RouteComponentProps<any>, any> {
    state = {
        files: null as File,
        errors: {} as { [key: string]: string },
        success: null as string        
    }    

    handleSubmit(event: React.FormEvent<any>) {
        event.preventDefault();
        this.saveFiles(this.state.files);
    }

    saveFiles(files) {
        this.setState({ errors: {} as { [key: string]: string } });
        usersService.uploadFiles(files).then((response) => {
            debugger;
            if (!response.is_error) {
                this.setState({ success: "Οι χρήστες αναβαθμίστηκαν"});
            } else {
                this.setState({ errors: response.error_content });
            }
        });
    }

    handleFileUpload(event) {
        console.log(event.target.files[0]);
        const target = event.target;
        const value = event.target.files;
       
        this.setState({
            files: value[0]
        });
    }

    _formGroupClass(field: string) {
        var className = "form-group ";
        if (field) {
            className += " has-danger"
        }
        return className;
    }

    render() {
        return <fieldset className="form-group">
            <legend>Ανέβασμα αρχείου χρηστών</legend>
            <form onSubmit={(e) => this.handleSubmit(e)}>
                {this.state.success  &&
                    <div className="alert alert-success" role="alert">
                        {this.state.success}
                    </div>
                }
                <div className={this._formGroupClass(this.state.errors.files)}>  
                    <label htmlFor="inputFiles" className="custom-file">
                        <input autoFocus type="file" name="files" id="inputFiles" onChange={(e) => this.handleFileUpload(e)} className="custom-file-input" accept=".xlsx,.xls" required/>
                        <span className="custom-file-control"></span>
                    </label>
                    <div className="form-control-feedback">{this.state.errors.files}</div>
                    <div className="form-control-feedback">{this.state.files ? this.state.files.name : ""}</div>
                </div>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Ανέβασμα</button>
            </form>
        </fieldset>
    }
}
