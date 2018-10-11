import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Roles } from '../_models';
import { appConfig } from '../app.config';

@Injectable()
export class RolesService {
    constructor(private http: HttpClient) { }

    getAll(page : number,sortFields : string, ordering : number) {
        
        return this.http.get<Roles[]>(appConfig.apiUrl+'/roles/'+page+'/'+sortFields+'/'+ordering);        
    }

    getAllByRoleName(page : number,sortFields : string, ordering : number,searchkey:any) {
        
        return this.http.get<Roles[]>(appConfig.apiUrl+'/roles/search/'+page+'/'+sortFields+'/'+ordering+'/'+searchkey);        
    }

    getAllActiveRoles(status:number) {
        
        return this.http.get<Roles[]>(appConfig.apiUrl+'/roles/status/'+status);        
    }

    getById(id: string) {
        return this.http.get(appConfig.apiUrl+'/roles/' + id);
    }

    create(role: Roles) {
        return this.http.post(appConfig.apiUrl+'/roles', role);
    }

    update(role: Roles) {
        return this.http.put(appConfig.apiUrl+'/roles/' + role.id, role);
    }
    updatePermission(id: string, privilege:string) {
        console.log('services id: '+id);
        console.log('services privilege: '+privilege);
    return this.http.put(appConfig.apiUrl+'/roles/permission/' +id, {privilege:privilege});
    }

    updateStatus(id: string, status:string) {
        console.log('services id: '+id);
        console.log('services status: '+status);
    return this.http.put(appConfig.apiUrl+'/roles/status/' +id, {status:status});
    }

    delete(id: string) {
        return this.http.delete(appConfig.apiUrl+'/roles/' + id);
    }
}