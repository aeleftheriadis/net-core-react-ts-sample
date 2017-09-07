import * as React from "react";
import { Link, Redirect } from 'react-router-dom';
import { RoutePaths } from '../routes';
import PlaceService, { IPlace, PlaceType } from '../services/Places';
import { RouteComponentProps } from "react-router";

let placeService = new PlaceService();

export class Places extends React.Component<RouteComponentProps<any>, any> {
    refs: {
        query: HTMLInputElement;
    }

    state = {
        places: [] as Array<IPlace>,
        editPlace: null as Object,
        isAddMode: false as boolean,
        searchQuery: '' as string
    }

    componentDidMount() {
        this.showAll();
    }

    showAll() {
        placeService.fetchAll().then((response) => {
            this.setState({ searchQuery: '', places: response.content });
        });
    }

    handleSearchQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ searchQuery: event.target.value });
    }

    handleSeachSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        placeService.search(this.state.searchQuery).then((response) => {
            this.setState({ places: response.content });
        });
    }

    delete(place: IPlace) {
        placeService.delete(place.id).then((response) => {
            let updatedPlaces = this.state.places;
            updatedPlaces.splice(updatedPlaces.indexOf(place), 1);
            this.setState({ places: updatedPlaces });
        });
    }

    render() {
        return <div>
            <h1>Σημεία ενδιαφέροντος</h1>
            <Link className="btn btn-success" to={RoutePaths.PlacesNew}>Προσθήκη</Link>
            <form className="form-inline my-2 my-lg-0" onSubmit={(e) => this.handleSeachSubmit(e)}>
                <input className="form-control form-control form-control-md" type="text" value={this.state.searchQuery} onChange={(e) => this.handleSearchQueryChange(e)} placeholder="Αναζήτηση" />
                <button className="btn btn-outline-success btn-md" type="submit">Αναζήτηση</button>&nbsp;
            </form>
            {this.state.searchQuery && this.state.places && this.state.places.length == 0 &&
                <p>Κανένα απότελεσμα!</p>
            }
            {this.state.places && this.state.places.length > 0 &&
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Τίτλος</th>
                            <th>Περιγραφή</th>
                            <th>Διεύθυνση</th>
                            <th>Πόλη</th>
                            <th>Τ.Κ.</th>
                            <th>Τύπος</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.places.map((place, index) =>
                            <tr key={index}>
                                <td>{place.title}</td>
                                <td>{place.description}</td>
                                <td>{place.address}</td>
                                <td>{place.city}</td>
                                <td>{place.postCode}</td>
                                <td>{PlaceType[place.placeType]}</td>
                                <td className="action-column"><Link className="btn btn-info" to={RoutePaths.PlacesEdit.replace(":id", place.id)}>Επεξεργασία</Link></td>
                                <td className="action-column"><button type="button" className="btn btn-danger" onClick={(e) => this.delete(place)}>Διαγραφή</button></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            }
            {this.state.searchQuery &&
                <button type="button" className="btn btn-primary" onClick={(e) => this.showAll()}>Καθαρισμός αναζήτησης</button>
            }


        </div>
    };
}
