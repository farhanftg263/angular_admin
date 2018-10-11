import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
import { appConfig } from '../app.config';

@Injectable()
export class AppUserService {
    constructor(private http: HttpClient) { }

    getAll(page : number,sortFields : string, ordering : number) {
        
        return this.http.get<User[]>(appConfig.apiUrl+'/app_users/'+page+'/'+sortFields+'/'+ordering);        
    }
    getAllBySearchKey(page : number,sortFields : string, ordering : number,searchkey:any) {
        
        return this.http.get<User[]>(appConfig.apiUrl+'/app_users/search/'+page+'/'+sortFields+'/'+ordering+'/'+searchkey);        
    }

    getById(id: string) {
        return this.http.get(appConfig.apiUrl+'/app_users/current/' + id);
    }

    getUserIdByRoleId(id: string) {
        return this.http.get(appConfig.apiUrl+'/app_users/role/' + id);
    }

    create(user: User) {
        return this.http.post(appConfig.apiUrl+'/app_users', user);
    }

    update(user: User) {
        return this.http.put(appConfig.apiUrl+'/app_users/' + user.id, user);
    }

    delete(id: string) {
        return this.http.delete(appConfig.apiUrl+'/app_users/' + id);
    }
    resendEmail(id: string) {
        return this.http.get(appConfig.apiUrl+'/app_users/resend/' + id);
    }
    status(id: string, status:number) {
       return this.http.put(appConfig.apiUrl+'/app_users/status/' +id, {status:status});
    }
}