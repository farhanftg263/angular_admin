import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { appConfig } from '../app.config';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(email: string, password: string) {
        return this.http.post<any>(appConfig.apiUrl + '/users/authenticate', { email: email, password: password })
            .map(user => {
                // login successful if there's a jwt token in the response
                if ( user.result && user.result.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    console.log("Token "+user.result.token);
                }

                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
    // Forget Password
    forgetPassword(email:string){
        return this.http.post<any>(appConfig.apiUrl+'/users/forgetpassword',{email:email});
    }
    // verify password
    verifyPassword(email:string,token:string,forget:number,utype:number)
    {
        return this.http.post<any>(appConfig.apiUrl+'/users/verifypassword',{email:email,token:token,forget:forget,utype:utype});
    }
    //reset password
    resetPassword(password:string,email:string,accessToken:string)
    {
        
        return this.http.post<any>(appConfig.apiUrl+'/users/resetpassword', {password:password, email: email,accessToken:accessToken});
    }
}