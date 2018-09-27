import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GlobalSetting } from '../_models';
import { appConfig } from '../app.config';

@Injectable()
export class GlobalSettingService {
    constructor(private http: HttpClient) { }

    getAll() {
        console.log('qqqqqqqqq');
        return this.http.get<GlobalSetting[]>(appConfig.apiUrl+'/global_setting?page=1');
    }

    getById(id: string) {
        return this.http.get(appConfig.apiUrl+'/global_setting/' + id);
    }

    create(globalSetting: GlobalSetting) {
        return this.http.post(appConfig.apiUrl+'/global_setting', globalSetting);
    }

    update(globalSetting: GlobalSetting) {
        return this.http.put(appConfig.apiUrl+'/global_setting/' + globalSetting.id, globalSetting);
    }    

    updateStatus(id: string, status:string) {
        console.log('services id: '+id);
        console.log('services status: '+status);
        return this.http.put(appConfig.apiUrl+'/global_setting/status/' +id, {status:status});
    }
}