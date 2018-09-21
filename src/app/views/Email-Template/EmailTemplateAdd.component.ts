import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,EmailTemplateService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'EmailTemplateAdd.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})

export class EmailTemplateAddComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  emailTemplateAdd : any = {};
  emailTemplateAddResponse : any = {};
  message: string;
  emailTemplate: FormGroup;
  emailTemplateAddForm: FormGroup;
  submitted = false;
      constructor(
        private router : Router,
        private alertService : AlertService,
        private emailTemplateService : EmailTemplateService,       
        private validationService : ValidationService,
        private fb: FormBuilder
      ){}

    ngOnInit() {
      //get email template list
     
         // Form validation
         this.emailTemplate = this.fb.group({
          "emailTitle": ['', [Validators.required, Validators.minLength(2)]],
          "emailSubject": ['', [Validators.required, Validators.minLength(2)]],
          "emailContent": ['',[Validators.required,Validators.minLength(2)]],          
          "status" : ['1']         
      });
    }

    /*
      Function :  Add email template
      Author : Pradeep Chaurasia
      Created On : 19:09:2018
    */
      add()
      {
          this.submitted = true;
          this.loading = true;
          
          if(this.emailTemplate.invalid)
          {           
              return;

          }
          console.log(this.emailTemplate.value);
          //alert("Success name"+this.cms.value.pageName+' meta title: '+this.cms.value.metaTitle+' meta content: '+this.cms.value.metaDescription+' status: '+this.cms.value.status);

          this.emailTemplateService.create(this.emailTemplate.value).subscribe(
            data => {
                this.emailTemplateAddResponse = data;
                if(this.emailTemplateAddResponse.code == 200)
                { 
                    this.alertService.success(this.emailTemplateAddResponse.message,true);
                    this.loading = false;
                    this.router.navigate(['email_template/summary']);
                }
                else{ 
                    this.alertService.error(this.emailTemplateAddResponse.message);
                    this.loading = false;
                }
            },
            error => { 
                console.log(error);
                this.alertService.error(error);
                this.loading = false;
            })
      }
     
    }
 