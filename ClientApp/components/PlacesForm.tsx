import 'object-assign';
import * as React from 'react';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import PlacesService, { IPlace, PlaceType } from '../services/Places'
import { RoutePaths } from '../routes';
import Geosuggest from 'react-geosuggest';

let placesService = new PlacesService();

export class PlacesForm extends React.Component<RouteComponentProps<any>, any> {
    constructor() {
        super(RouteComponentProps);
        this.onSuggestSelect = this.onSuggestSelect.bind(this);
    }
    
    state = {
        place: null as IPlace,
        errors: {} as { [key: string]: string }
    }

    componentDidMount() {
        if (this.props.match.path == RoutePaths.PlacesEdit) {
            placesService.fetch(this.props.match.params.id).then((response) => {
                this.setState({ place: response.content });
            });
        } else {
            let newPlace: IPlace = {
                title: '', description: '', lat: 37.983810, long: 23.727539, address: '', city: '', postCode: '', placeType: PlaceType.Bridgestone
            };
            this.setState({ place: newPlace });
        }
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.savePage(this.state.place);
    }

    handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let placeUpdates = {
            [name]: value
        }
        this.setState({
            place: Object.assign(this.state.place, placeUpdates)
        });
    }

    onSuggestSelect(suggest) {
        let placeUpdates = {
            title: suggest.label,
            description: suggest.description,
            lat: suggest.location.lat,
            long: suggest.location.lng,
        }


        this.setState({
            place: Object.assign(this.state.place, placeUpdates)
        });
    }

    savePage(place: IPlace) {
        debugger;
        this.setState({ errors: {} as { [key: string]: string } });
        placesService.save(place).then((response) => {
            if (!response.is_error) {
                this.props.history.push(RoutePaths.Places);
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
        if (!this.state.place) {
            return <div>Φορτώνεται...</div>;
        }
        else {
            return <fieldset className="form-group">
                <legend>{this.state.place.id ? "Επεξεργασία Σημείου Ενδιαφέροντος" : "Νέα Σημείο Ενδιαφέροντος"}</legend>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <Geosuggest
                        placeholder="Αναζήτηση Σημείου Ενδιαφέροντος"
                        inputClassName="form-control form-control-danger"
                        country="gr"
                        initialValue={this.state.place.title}
                        onSuggestSelect={this.onSuggestSelect}
                    />

                    <div className={this._formGroupClass(this.state.errors.placeType)}>
                        <label htmlFor="selectPlaceType" className="form-control-label">Τύπος</label>

                        <select name="placeType" id="selectPlaceType" value={this.state.place.placeType} onChange={(e) => this.handleSelectChange(e)} className="form-control form-control-danger" required>
                            <option value={PlaceType.Bridgestone}>Bridgestone</option>
                            <option value={PlaceType.Avis}>Avis</option>
                        </select>                        
                        <div className="form-control-feedback">{this.state.errors.placeType}</div>
                    </div>


                    <button className="btn btn-lg btn-primary btn-block" type="submit">Αποθήκευση</button>
                    <Link className="btn btn-lg btn-secondary btn-block" to={RoutePaths.Places}>Ακύρωση</Link>
                </form>
            </fieldset>
        }
    }
}
