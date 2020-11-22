import { IAuthResponse } from "../Interfaces/Interfaces";
import { User } from '../Services/User.service';


export class AuthenticateClass{
    public async authenticate(user: User, login?: boolean): Promise<boolean>{
        return new Promise((resolve, reject) => {
            try {
                const data: { [prop in string]: string } = JSON.parse(localStorage.getItem('auth'));
                let url = "http://127.0.0.1:8000/api/login";

                if (!login) {
                    url = "http://127.0.0.1:8000/api/signup";
                }

                const formdata = new URLSearchParams();

                for (const [key, value] of Object.entries(data)) {
                    if (value) {
                        formdata.append(key, value);
                    }
                }

                const http = new XMLHttpRequest();

                http.responseType = "json";

                http.open("POST", url);

                http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                http.send(formdata.toString());

                http.onload = () => {
                    if (http.status === 200) {
                        const response: IAuthResponse = http.response;

                        if (response.status === 'user') {
                            user.login(data);
                            resolve();
                        } else {
                            throw new Error();
                            reject();
                        }
                    }
                };

                http.onerror = () => {
                   reject();
                }
            } catch (e) {
                localStorage.removeItem("auth");
            }
            return user.is_auth;
        })
    }
}

