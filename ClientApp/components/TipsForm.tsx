import 'object-assign';
import * as React from 'react';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import TipsService, { ITip } from '../services/Tips'
import { RoutePaths } from '../routes';

let tipsService = new TipsService();

export class TipsForm extends React.Component<RouteComponentProps<any>, any> {
    state = {
        tip: null as ITip,
        errors: {} as { [key: string]: string }
    }

    componentDidMount() {
        if (this.props.match.path == RoutePaths.TipsEdit) {
            tipsService.fetch(this.props.match.params.id).then((response) => {
                this.setState({ tip: response.content });
            });
        } else {
            let newTip: ITip = {
                title: ''
            };
            this.setState({ tip: newTip });
        }
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.saveTip(this.state.tip);
    }

    handleInputChange(event: React.ChangeEvent<any>) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let tipUpdates = {
            [name]: value
        }

        this.setState({
            tip: Object.assign(this.state.tip, tipUpdates)
        });
    }

    saveTip(tip: ITip) {
        this.setState({ errors: {} as { [key: string]: string } });
        tipsService.save(tip).then((response) => {
            if (!response.is_error) {
                this.props.history.push(RoutePaths.Tips);
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
        if (!this.state.tip) {
            return <div>Φορτώνεται...</div>;
        }
        else {
            return <fieldset className="form-group">
                <legend>{this.state.tip.id ? "Επεξεργασία Συμβουλής" : "Νέα Συμβουλή"}</legend>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <div className={this._formGroupClass(this.state.errors.title)}>
                        <label htmlFor="inputTitle" className="form-control-label">Τίτλος</label>
                        <input type="text" autoFocus name="title" id="inputTitle" value={this.state.tip.title} onChange={(e) => this.handleInputChange(e)} className="form-control form-control-danger" required />
                        <div className="form-control-feedback">{this.state.errors.title}</div>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Αποθήκευση</button>
                    <Link className="btn btn-lg btn-secondary btn-block" to={RoutePaths.Tips}>Ακύρωση</Link>
                </form>
            </fieldset>
        }
    }
}
