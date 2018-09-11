﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/index';
import { appConfig } from '../app.config';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(appConfig.apiUrl+'/users');
    }

    getById(id: number) {
        return this.http.get(appConfig.apiUrl+'/users/' + id);
    }

    create(user: User) {
        return this.http.post(appConfig.apiUrl+'/users', user);
    }

    update(user: User) {
        return this.http.put(appConfig.apiUrl+'/users/' + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(appConfig.apiUrl+'/users/' + id);
    }
}