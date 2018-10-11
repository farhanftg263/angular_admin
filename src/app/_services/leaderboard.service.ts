import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Leaderboard } from '../_models';
import { appConfig } from '../app.config';

@Injectable()
export class LeaderboardService {
    constructor(private http: HttpClient) { }

    getAll(page : number,sortFields : string, ordering : number) {
        
        return this.http.get<Leaderboard[]>(appConfig.apiUrl+'/leaderboard/'+page+'/'+sortFields+'/'+ordering);        
    }
    getAllBySearchKey(page : number,sortFields : string, ordering : number,searchkey:any) {
        
        return this.http.get<Leaderboard[]>(appConfig.apiUrl+'/leaderboard/search/'+page+'/'+sortFields+'/'+ordering+'/'+searchkey);        
    }
}