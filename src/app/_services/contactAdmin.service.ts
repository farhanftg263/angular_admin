import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ContactAdmin } from '../_models/index';
import { appConfig } from '../app.config';

@Injectable()
export class ContactAdminService {
    constructor(private http: HttpClient) { }

    getAll(page : number,sortFields : string, ordering : number) {
        
        return this.http.get<ContactAdmin[]>(appConfig.apiUrl+'/contact-admin/'+page+'/'+sortFields+'/'+ordering);        
    }
    getAllBySearchKey(page : number,sortFields : string, ordering : number,searchkey:any) {
        
        return this.http.get<ContactAdmin[]>(appConfig.apiUrl+'/contact-admin/search/'+page+'/'+sortFields+'/'+ordering+'/'+searchkey);        
    }
    delete(id: string) {
        return this.http.delete(appConfig.apiUrl+'/contact-admin/' + id);
    }
}