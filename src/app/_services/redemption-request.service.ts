import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RedemptionRequest } from '../_models';
import { appConfig } from '../app.config';

@Injectable()
export class RedemptionRequestService {
    constructor(private http: HttpClient) { }

    getAll(page : number,sortFields : string, ordering : number) {
        
        return this.http.get<RedemptionRequest[]>(appConfig.apiUrl+'/redemption_request/'+page+'/'+sortFields+'/'+ordering);        
    }
    getAllBySearchKey(page : number,sortFields : string, ordering : number,searchkey:any) {
        
        return this.http.get<RedemptionRequest[]>(appConfig.apiUrl+'/redemption_request/search/'+page+'/'+sortFields+'/'+ordering+'/'+searchkey);        
    }

    getById(id: string) {
        return this.http.get(appConfig.apiUrl+'/redemption_request/current/' + id);
    }

    getUserIdByRoleId(id: string) {
        return this.http.get(appConfig.apiUrl+'/redemption_request/role/' + id);
    }

    create(user: RedemptionRequest) {
        return this.http.post(appConfig.apiUrl+'/redemption_request', user);
    }

    update(user: RedemptionRequest) {
        return this.http.put(appConfig.apiUrl+'/redemption_request/' + user.id, user);
    }  
   
    changeStatus(id: string, status:number) {
       return this.http.put(appConfig.apiUrl+'/redemption_request/status/' +id, {status:status});
    }
}