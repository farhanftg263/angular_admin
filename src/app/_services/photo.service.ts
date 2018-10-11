import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Photo } from '../_models/index';
import { appConfig } from '../app.config';

@Injectable()
export class PhotoService {
    constructor(private http: HttpClient) { }

    getAll(page : number,sortFields : string, ordering : number) {
        
        return this.http.get<Photo[]>(appConfig.apiUrl+'/photo/'+page+'/'+sortFields+'/'+ordering);        
    }
    getAllBySearchKey(page : number,sortFields : string, ordering : number,searchkey:any) {
        
        return this.http.get<Photo[]>(appConfig.apiUrl+'/photo/search/'+page+'/'+sortFields+'/'+ordering+'/'+searchkey);        
    }
    delete(id: string) {
        return this.http.delete(appConfig.apiUrl+'/photo/' + id);
    }
    status(id: string, status:number) {
       return this.http.put(appConfig.apiUrl+'/photo/status/' +id, {status:status});
    }
}