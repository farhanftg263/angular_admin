import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EmailTemplate } from '../_models';
import { appConfig } from '../app.config';

@Injectable()
export class EmailTemplateService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<EmailTemplate[]>(appConfig.apiUrl+'/email_template/?page=1');
    }

    getById(id: string) {
        return this.http.get(appConfig.apiUrl+'/email_template/' + id);
    }

    create(emailTemplate: EmailTemplate) {
        return this.http.post(appConfig.apiUrl+'/email_template', emailTemplate);
    }

    update(emailTemplate: EmailTemplate) {
        return this.http.put(appConfig.apiUrl+'/email_template/' + emailTemplate.id, emailTemplate);
    }

    delete(id: number) {
        return this.http.delete(appConfig.apiUrl+'/email_template/' + id);
    }

    updateStatus(id: string, status:string) {
        console.log('services id: '+id);
        console.log('services status: '+status);
        return this.http.put(appConfig.apiUrl+'/email_template/status/' +id, {status:status});
    }
}