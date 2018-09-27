import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Cms } from '../_models/index';
import { appConfig } from '../app.config';

@Injectable()
export class CmsService {
    constructor(private http: HttpClient) { }

    getAll(page : number) {
        return this.http.get<Cms[]>(appConfig.apiUrl+'/cms/'+page);        
    }

    getById(id: string) {
        console.log('services id: '+id);
        return this.http.get(appConfig.apiUrl+'/cms/edit/' + id);
    }

    create(cms: Cms) {
        return this.http.post(appConfig.apiUrl+'/cms', cms);
    }

    update(cms: Cms) {
        return this.http.put(appConfig.apiUrl+'/cms/' + cms.id, cms);
    }

    updateStatus(id: string, status:string) {
        console.log('services id: '+id);
        console.log('services status: '+status);
    return this.http.put(appConfig.apiUrl+'/cms/status/' +id, {status:status});
    }

    delete(id: string) {
        return this.http.delete(appConfig.apiUrl+'/cms/' + id);
    }
}