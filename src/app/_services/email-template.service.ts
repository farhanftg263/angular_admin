import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EmailTemplate } from '../_models';
import { appConfig } from '../app.config';

@Injectable()
export class EmailTemplateService {
    constructor(private http: HttpClient) { }
       
    getAll(page : number,sortFields : string, ordering : number) {
        console.log('price ids page : '+page);
        console.log('price ids sort : '+sortFields);
        console.log('price ids ordering : '+ordering);
        return this.http.get<EmailTemplate[]>(appConfig.apiUrl+'/email_template/'+page+'/'+sortFields+'/'+ordering);        
    }

    getById(id: string) {
        return this.http.get(appConfig.apiUrl+'/email_template/edit/' + id);
    }

    create(emailTemplate: EmailTemplate) {
        return this.http.post(appConfig.apiUrl+'/email_template', emailTemplate);
    }

    update(emailTemplate: EmailTemplate) {
        return this.http.put(appConfig.apiUrl+'/email_template/' + emailTemplate.id, emailTemplate);
    }

    delete(id: string) {
        return this.http.delete(appConfig.apiUrl+'/email_template/' + id);
    }

    updateStatus(id: string, status:string) {
        console.log('services id: '+id);
        console.log('services status: '+status);
        return this.http.put(appConfig.apiUrl+'/email_template/status/' +id, {status:status});
    }
}