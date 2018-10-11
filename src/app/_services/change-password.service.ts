import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/index';
import { appConfig } from '../app.config';

@Injectable()
export class ChangePasswordService {
    constructor(private http: HttpClient) { }

    update(user: User) {
        return this.http.put(appConfig.apiUrl+'/users/change_password/' + user.id, user);
    }
}