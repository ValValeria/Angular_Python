import { URL_PATH } from '../app.component';
import { IUser } from '../Interfaces/Interfaces';
import { UserService } from '../Services/User.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthenticateHelper {
    constructor(private user: UserService) {}

    public async authenticate(user: UserService, login?: boolean): Promise<boolean>{
        return new Promise((resolve, reject) => {
            try {
                const data: { [prop in string]: string } = JSON.parse(localStorage.getItem('auth'));
                let url = `${URL_PATH}api/login`;

                if (!login) {
                    url = `${URL_PATH}api/signup`;
                }

                const searchParams = new URLSearchParams();

                for (const [key, value] of Object.entries(data)) {
                    if (value && key) {
                        searchParams.append(key, value);
                    }
                }

                const http = new XMLHttpRequest();

                http.responseType = 'json';

                http.open('POST', url);

                http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                http.send(searchParams.toString());

                http.onload = () => {
                    if (http.status === 200) {
                        const response: {data: {user: IUser}} = http.response;
                        const role = response.data?.user?.role;
                        const roles = ['admin', 'user'];

                        if (roles.includes(role)) {
                            this.user ? this.user.login({...response.data.user}) : user.login({...response.data.user})  ;
                            resolve();
                        } else {
                            reject('Guest');
                        }
                    }
                };

                http.onerror = () => {
                   reject('Error');
                };
            } catch (e) {
                localStorage.removeItem('auth');
            }
            return user.is_auth;
        });
    }
}

