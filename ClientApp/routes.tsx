import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Layout } from './components/Layout';
import AuthService from './services/Auth';
import { SignIn } from './components/Auth';
import { ErrorPage } from './components/Error';
import { Pages } from './components/Pages';
import { PageForm } from './components/PageForm'
import { Tips } from './components/Tips';
import { TipsForm } from './components/TipsForm';
import { Places } from './components/Places';
import { PlacesForm } from './components/PlacesForm';
import { Users } from './components/Users';

import { SignOut } from './components/SignOut';

export class RoutePaths {

    public static Pages: string = "/pages";
    public static PagesEdit: string = "/pages/edit/:id";
    public static PagesNew: string = "/pages/new";
    public static Tips: string = "/tips";
    public static TipsEdit: string = "/tips/edit/:id";
    public static TipsNew: string = "/tips/new";
    public static Places: string = "/places";
    public static PlacesEdit: string = "/places/edit/:id";
    public static PlacesNew: string = "/places/new";
    public static Users: string = "/users";
    public static SignIn: string = "/";
    public static SignOut: string = "/signout";
}

const DefaultLayout = ({ component: Component, ...rest }: { component: any, path: string, exact?: boolean }) => (
    <Route {...rest} render={props => (
        AuthService.isSignedInIn() ? (
            <Component {...props} />
        ) : (
                <Redirect to={{
                    pathname: RoutePaths.SignIn,
                    state: { from: props.location }
                }} />
            )
    )} />
);

export const routes = <Layout>
    <Switch>
        <Route exact path={RoutePaths.SignIn} component={SignIn} />
        <DefaultLayout exact path={RoutePaths.Pages} component={Pages} />
        <DefaultLayout path={RoutePaths.PagesNew} component={PageForm} />
        <DefaultLayout path={RoutePaths.PagesEdit} component={PageForm} />
        <DefaultLayout exact path={RoutePaths.Tips} component={Tips} />
        <DefaultLayout path={RoutePaths.TipsNew} component={TipsForm} />
        <DefaultLayout path={RoutePaths.TipsEdit} component={TipsForm} />
        <DefaultLayout exact path={RoutePaths.Places} component={Places} />
        <DefaultLayout path={RoutePaths.PlacesNew} component={PlacesForm} />
        <DefaultLayout path={RoutePaths.PlacesEdit} component={PlacesForm} />
        <DefaultLayout exact path={RoutePaths.Users} component={Users} />
        <Route path={RoutePaths.SignOut} component={SignOut} />
        <Route path='/error/:code?' component={ErrorPage} />
        <Route component={ErrorPage} />
    </Switch>
</Layout>;
