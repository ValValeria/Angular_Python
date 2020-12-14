import { URL_PATH } from "../app.component";
import { IUser } from "../Interfaces/Interfaces";
import { User } from '../Services/User.service';


export class AuthenticateClass{
    public async authenticate(user: User, login?: boolean): Promise<boolean>{
        return new Promise((resolve, reject) => {
            try {
                const data: { [prop in string]: string } = JSON.parse(localStorage.getItem('auth'));
                let url = `${URL_PATH}api/login`;

                if (!login) {
                    url = `${URL_PATH}api/signup`;
                }

                const formdata = new URLSearchParams();

                for (const [key, value] of Object.entries(data)) {
                    if (value && key) {
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
                        const response: {data: {user:IUser},status:"user"} = http.response;

                        if (response.status === 'user') {
                            user.login({...response.data.user});
                            resolve();
                        } else {
                            reject("Guest");
                        }
                    }
                };

                http.onerror = () => {
                   reject("Error");
                }
            } catch (e) {
                localStorage.removeItem("auth");
            }
            return user.is_auth;
        })
    }
}

