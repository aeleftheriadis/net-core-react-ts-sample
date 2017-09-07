import RestUtilities from './RestUtilities';
import AuthStore from '../stores/Auth';

interface IAuthResponse {
    access_token: string;
}

export default class Auth {
    static isSignedInIn(): boolean {
        return !!AuthStore.getToken();
    }

    signInOrRegister(email: string, password: string) {
        return RestUtilities.post<IAuthResponse>(`/token`,
            `username=${email}&password=${password}`)
            
            .then((response) => {
                if (!response.is_error) {
                    AuthStore.setToken(response.content.access_token);
                }
                return response;
            });
    }

    signIn(email: string, password: string) {
        return this.signInOrRegister(email, password);
    }

    signOut(): void {
        AuthStore.removeToken();
    }
}
