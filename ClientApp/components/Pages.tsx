﻿import * as React from "react";
import { Link, Redirect } from 'react-router-dom';
import { RoutePaths } from '../routes';
import PageService, { IPage } from '../services/Pages';
import { RouteComponentProps } from "react-router";

import '../css/geosuggest.css';

let pageService = new PageService();

export class Pages extends React.Component<RouteComponentProps<any>, any> {
    refs: {
        query: HTMLInputElement;
    }

    state = {
        pages: [] as Array<IPage>,
        editPage: null as Object,
        isAddMode: false as boolean,
        searchQuery: '' as string
    }

    componentDidMount() {
        this.showAll();
    }

    showAll() {
        pageService.fetchAll().then((response) => {
            this.setState({ searchQuery: '', pages: response.content });
        });
    }

    handleSearchQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ searchQuery: event.target.value });
    }

    handleSeachSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        pageService.search(this.state.searchQuery).then((response) => {
            this.setState({ pages: response.content });
        });
    }

    delete(page: IPage) {
        pageService.delete(page.id).then((response) => {
            let updatedPages = this.state.pages;
            updatedPages.splice(updatedPages.indexOf(page), 1);
            this.setState({ pages: updatedPages });
        });
    }

    render() {
        return <div>
            <h1>Σελίδες</h1>
            <Link className="btn btn-success" to={RoutePaths.PagesNew}>Προσθήκη</Link>
            <form className="form-inline my-2 my-lg-0" onSubmit={(e) => this.handleSeachSubmit(e)}>
                <input className="form-control form-control form-control-md" type="text" value={this.state.searchQuery} onChange={(e) => this.handleSearchQueryChange(e)} placeholder="Αναζήτηση" />
                <button className="btn btn-outline-success btn-md" type="submit">Αναζήτηση</button>&nbsp;
            </form>
            {this.state.searchQuery && this.state.pages && this.state.pages.length == 0 &&
                <p>Κανένα απoτέλεσμα!</p>
            }
            {this.state.pages && this.state.pages.length > 0 &&
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Τίτλος</th>
                            <th>Περιγραφή</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.pages.map((page, index) =>
                            <tr key={index}>
                                <td>{page.title}</td>
                                <td>{page.description}</td>
                                <td className="action-column"><Link className="btn btn-info" to={RoutePaths.PagesEdit.replace(":id", page.id)}>Επεξεργασία</Link></td>
                                <td className="action-column"><button type="button" className="btn btn-danger" onClick={(e) => this.delete(page)}>Διαγραφή</button></td>
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
