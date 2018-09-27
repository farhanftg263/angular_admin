import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ManagePrice } from '../_models';
import { appConfig } from '../app.config';

@Injectable()
export class ManagePriceService {
    constructor(private http: HttpClient) { }

    getAll(page : number,sortFields : string, ordering : number) {
        console.log('price ids page : '+page);
        console.log('price ids sort : '+sortFields);
        console.log('price ids ordering : '+ordering);
        return this.http.get<ManagePrice[]>(appConfig.apiUrl+'/manage_price/'+page+'/'+sortFields+'/'+ordering);        
    }

    getById(id: string) {
        return this.http.get(appConfig.apiUrl+'/manage_price/edit/' + id);
    }

    create(managePrice: ManagePrice) {
        return this.http.post(appConfig.apiUrl+'/manage_price', managePrice);
    }

    update(managePrice: ManagePrice) {
        return this.http.put(appConfig.apiUrl+'/manage_price/' + managePrice.id, managePrice);
    }

    delete(id: string) {
        return this.http.delete(appConfig.apiUrl+'/manage_price/' + id);
    }

    updateStatus(id: string, status:string) {
        console.log('services id: '+id);
        console.log('services status: '+status);
        return this.http.put(appConfig.apiUrl+'/manage_price/status/' +id, {status:status});
    }
}