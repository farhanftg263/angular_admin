import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Role } from '../_models/index';
import { appConfig } from '../app.config';

@Injectable()
export class RoleService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Role[]>(appConfig.apiUrl+'/users/?page=1');
    }

    getById(id: number) {
        return this.http.get(appConfig.apiUrl+'/roles/' + id);
    }

    create(role: Role) {
        return this.http.post(appConfig.apiUrl+'/roles', role);
    }

    update(role: Role) {
        return this.http.put(appConfig.apiUrl+'/roles/' + role.id, role);
    }

    delete(id: number) {
        return this.http.delete(appConfig.apiUrl+'/roles/' + id);
    }
}