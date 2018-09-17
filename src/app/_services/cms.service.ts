import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Cms } from '../_models/index';
import { appConfig } from '../app.config';

@Injectable()
export class CmsService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Cms[]>(appConfig.apiUrl+'/cms/?page=1');
    }

    getById(id: number) {
        return this.http.get(appConfig.apiUrl+'/cms/' + id);
    }

    create(cms: Cms) {
        return this.http.post(appConfig.apiUrl+'/cms', cms);
    }

    update(cms: Cms) {
        return this.http.put(appConfig.apiUrl+'/cms/' + cms.id, cms);
    }

    delete(id: number) {
        return this.http.delete(appConfig.apiUrl+'/cms/' + id);
    }
}