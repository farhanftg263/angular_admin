import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,EmailTemplateService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'EmailTemplateEdit.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})

export class EmailTemplateEditComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  emailTemplateEdit : any = {};
  emailTemplateAddResponse : any = {};
  message: string;
  emailTemplate: FormGroup;
  emailTemplateAddForm: FormGroup;
  id: number;
  emailTemplateid:string;
  emailTitle:string;
  private sub: any;
  totalpage:any={};
  submitted = false;
      constructor(
        private router : Router,
        private alertService : AlertService,
        private emailTemplateService : EmailTemplateService,       
        private validationService : ValidationService,
        private fb: FormBuilder,
        private route: ActivatedRoute
      ){}
      

    ngOnInit() {
      //get email template list
      this.emailTemplateid=this.route.snapshot.paramMap.get('id');
        if(!(this.emailTemplateid)){
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['email-template/summary']);
        }
        console.log('iiiiiiddddd '+this.emailTemplateid);
         this.emailTemplateService.getById(this.emailTemplateid).subscribe(
          data => {
              this.emailTemplateEdit = data;
              if(!(this.emailTemplateEdit.result._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['email-template/summary']);
            }else{     
                
                this.emailTemplate = this.fb.group({
                    "id":[this.emailTemplateEdit.result._id],
                    "emailTitle": [this.emailTemplateEdit.result.emailTitle, [Validators.required, Validators.minLength(2)]],
                    "emailSubject": [this.emailTemplateEdit.result.emailSubject,[Validators.required,Validators.minLength(2)]],
                    "emailContent" : [this.emailTemplateEdit.result.emailContent],                    
                    "status" : [this.emailTemplateEdit.result.status]         
                });
            }
          },
          error => {
              this.alertService.error(error);
          }
        );

         // Form validation
         this.emailTemplate = this.fb.group({
          "emailTitle": ['', [Validators.required, Validators.minLength(2)]],
          "emailSubject": ['', [Validators.required, Validators.minLength(2)]],
          "emailContent": ['',[Validators.required,Validators.minLength(2)]],          
          "status" : ['1']         
      });
    }

    /*
      Function :  Edit Email Template
      Author : Pradeep Chaurasia
      Created On : 19:09:2018
    */
      edit()
      {
          this.submitted = true;
          this.loading = true;
          
          if(this.emailTemplate.invalid)
          {           
              return;

          }
          console.log(this.emailTemplate.value);

          this.emailTemplateService.update(this.emailTemplate.value).subscribe(    
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
 