import 'object-assign';
import * as React from 'react';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import PagesService, { IPage } from '../services/Pages'
import { RoutePaths } from '../routes';

let pagesService = new PagesService();

export class PageForm extends React.Component<RouteComponentProps<any>, any> {
    state = {
        page: null as IPage,
        errors: {} as { [key: string]: string }
    }

    componentDidMount() {
        if (this.props.match.path == RoutePaths.PagesEdit) {
            pagesService.fetch(this.props.match.params.id).then((response) => {
                this.setState({ page: response.content });
            });
        } else {
            let newPage: IPage = {
                title: '', description: ''
            };
            this.setState({ page: newPage });
        }
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.savePage(this.state.page);
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let pageUpdates = {
            [name]: value
        }

        this.setState({
            page: Object.assign(this.state.page, pageUpdates)
        });
    }

    savePage(page: IPage) {
        this.setState({ errors: {} as { [key: string]: string } });
        pagesService.save(page).then((response) => {
            if (!response.is_error) {
                this.props.history.push(RoutePaths.Pages);
            } else {
                this.setState({ errors: response.error_content });
            }
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
        if (!this.state.page) {
            return <div>Φορτώνεται...</div>;
        }
        else {
            return <fieldset className="form-group">
                <legend>{this.state.page.id ? "Επεξεργασία Σελίδας" : "Νέα Σελίδα"}</legend>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <div className={this._formGroupClass(this.state.errors.title)}>
                        <label htmlFor="inputTitle" className="form-control-label">Τίτλος</label>
                        <input type="text" autoFocus name="title" id="inputTitle" value={this.state.page.title} onChange={(e) => this.handleInputChange(e)} className="form-control form-control-danger" required />
                        <div className="form-control-feedback">{this.state.errors.title}</div>
                    </div>
                    <div className={this._formGroupClass(this.state.errors.description)}>
                        <label htmlFor="inputDescription" className="form-control-label">Περιγραφή</label>
                        <textarea name="description" id="inputDescription" value={this.state.page.description} onChange={(e) => this.handleInputChange(e)} className="form-control form-control-danger textarea-lg" required />
                        <div className="form-control-feedback">{this.state.errors.description}</div>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Αποθήκευση</button>
                    <Link className="btn btn-lg btn-secondary btn-block" to={RoutePaths.Pages}>Ακύρωση</Link>
                </form>
            </fieldset>
        }
    }
}
