import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Feedback } from '../_models';
import { appConfig } from '../app.config';

@Injectable()
export class FeedbackService {
    constructor(private http: HttpClient) { }

    getAll(page : number,sortFields : string, ordering : number) {
        
        return this.http.get<Feedback[]>(appConfig.apiUrl+'/feedback/'+page+'/'+sortFields+'/'+ordering);        
    }
    getAllBySearchKey(page : number,sortFields : string, ordering : number,searchkey:any) {
        
        return this.http.get<Feedback[]>(appConfig.apiUrl+'/feedback/search/'+page+'/'+sortFields+'/'+ordering+'/'+searchkey);        
    }
    delete(id: string) {
        return this.http.delete(appConfig.apiUrl+'/feedback/' + id);
    }
}