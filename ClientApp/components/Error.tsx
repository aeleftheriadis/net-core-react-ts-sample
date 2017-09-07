import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom';

export class ErrorPage extends React.Component<RouteComponentProps<any>, any> {

    getErrorCode() {
        return this.props.match.params.code;
    }

    getErrorMessage() {
        let message = null;

        return 'Προέκυψε ένα άγνωστο σφάλμα.';
    }

    render() {
        let code = this.getErrorCode();
        return <div>
            <h1>Σφάλμα</h1>
            <p>{this.getErrorMessage()}</p>
            {code &&
                <p>Κωδικός σφάλματος: {code}</p>
            }

        </div>;
    }
}
