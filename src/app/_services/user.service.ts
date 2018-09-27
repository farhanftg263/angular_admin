import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/index';
import { appConfig } from '../app.config';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getAll(page : number) {
        return this.http.get<User[]>(appConfig.apiUrl+'/users/'+page);
    }

    getById(id: string) {
        return this.http.get(appConfig.apiUrl+'/users/current/' + id);
    }

    create(user: User) {
        return this.http.post(appConfig.apiUrl+'/users', user);
    }

    update(user: User) {
        return this.http.put(appConfig.apiUrl+'/users/' + user.id, user);
    }

    delete(id: string) {
        return this.http.delete(appConfig.apiUrl+'/users/' + id);
    }
    status(id: string, status:number) {
       return this.http.put(appConfig.apiUrl+'/users/status/' +id, {status:status});
    }
}