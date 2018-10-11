import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Product } from '../_models';
import { appConfig } from '../app.config';
import { stringify } from '@angular/compiler/src/util';

@Injectable()
export class ProductService {
    constructor(private http: HttpClient) { }
   
    getAll(page : number,sortFields : string, ordering : number) {
        
        return this.http.get<Product[]>(appConfig.apiUrl+'/product/'+page+'/'+sortFields+'/'+ordering);        
    }
    getAllBySearchKey(page : number,sortFields : string, ordering : number,searchkey:any) {
        
        return this.http.get<Product[]>(appConfig.apiUrl+'/product/search/'+page+'/'+sortFields+'/'+ordering+'/'+searchkey);        
    }

    getById(id: string) {
        console.log('services id: '+id);
        return this.http.get(appConfig.apiUrl+'/product/edit/' + id);
    }

    create(product: Product) {             
        return this.http.post(appConfig.apiUrl+'/product', product);
    }

    update(product: Product) {
        return this.http.put(appConfig.apiUrl+'/product/' + product.id, product);
    }

    updateStatus(id: string, status:string) {
        console.log('services id: '+id);
        console.log('services status: '+status);
    return this.http.put(appConfig.apiUrl+'/product/status/' +id, {status:status});
    }

    delete(id: string) {
        return this.http.delete(appConfig.apiUrl+'/product/' + id);
    }
}