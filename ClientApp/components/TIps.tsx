import * as React from "react";
import { Link, Redirect } from 'react-router-dom';
import { RoutePaths } from '../routes';
import TipService, { ITip } from '../services/Tips';
import { RouteComponentProps } from "react-router";

let tipService = new TipService();

export class Tips extends React.Component<RouteComponentProps<any>, any> {
    refs: {
        query: HTMLInputElement;
    }

    state = {
        tips: [] as Array<ITip>,
        editTip: null as Object,
        isAddMode: false as boolean,
        searchQuery: '' as string
    }

    componentDidMount() {
        this.showAll();
    }

    showAll() {
        tipService.fetchAll().then((response) => {
            this.setState({ searchQuery: '', tips: response.content });
        });
    }

    handleSearchQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ searchQuery: event.target.value });
    }

    handleSeachSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        tipService.search(this.state.searchQuery).then((response) => {
            this.setState({ tips: response.content });
        });
    }

    delete(tip: ITip) {
        tipService.delete(tip.id).then((response) => {
            let updatedTips = this.state.tips;
            updatedTips.splice(updatedTips.indexOf(tip), 1);
            this.setState({ tips: updatedTips });
        });
    }

    render() {
        return <div>
            <h1>Συμβουλές</h1>
            <Link className="btn btn-success" to={RoutePaths.TipsNew}>Προσθήκη</Link>
            <form className="form-inline my-2 my-lg-0" onSubmit={(e) => this.handleSeachSubmit(e)}>
                <input className="form-control form-control form-control-md" type="text" value={this.state.searchQuery} onChange={(e) => this.handleSearchQueryChange(e)} placeholder="Αναζήτηση" />
                <button className="btn btn-outline-success btn-md" type="submit">Αναζήτηση</button>&nbsp;
            </form>            
            {this.state.searchQuery && this.state.tips && this.state.tips.length == 0 &&
                <p>Κανένα απότελεσμα!</p>
            }
            {this.state.tips && this.state.tips.length > 0 &&
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Τίτλος</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.tips.map((tip, index) =>                        
                        <tr key={index}>
                            <td>{tip.title}</td>
                            <td className="action-column"><Link className="btn btn-info" to={RoutePaths.TipsEdit.replace(":id", tip.id)}>Επεξεργασία</Link></td>
                            <td className="action-column"><button type="button" className="btn btn-danger" onClick={(e) => this.delete(tip)}>Διαγραφή</button></td>
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
