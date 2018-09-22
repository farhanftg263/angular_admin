import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,CmsService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'CmsAdd.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})

export class CmsAddComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  cmsAdd : any = {};
  cmsAddResponse : any = {};
  message: string;
  cms: FormGroup;
  cmsAddForm: FormGroup;
  submitted = false;
      constructor(
        private router : Router,
        private alertService : AlertService,
        private cmsService : CmsService,       
        private validationService : ValidationService,
        private fb: FormBuilder
      ){}

    ngOnInit() {
      //get cms list
     /* 
      this.cmsService.getAll().subscribe(
        data => {
            this.cmsSummary = data;
            console.log(this.cmsSummary);
        },
        error => {
            this.alertService.error(error);
        }
      ) */
         // Form validation
         this.cms = this.fb.group({
          "pageName": ['', [Validators.required, Validators.minLength(2)]],
          "pageContent": ['',[Validators.required,Validators.minLength(2)]],
          "metaTitle" : [''],
          "metaDescription" : [''],
          "status" : ['1']         
      });
    }

    /*
      Function :  Add CMS
      Author : Pradeep Chaurasia
      Created On : 17:09:2018
    */
      add()
      {
          this.submitted = true;
          this.loading = true;
          
          if(this.cms.invalid)
          {           
              return;

          }
          console.log(this.cms.value);
          //alert("Success name"+this.cms.value.pageName+' meta title: '+this.cms.value.metaTitle+' meta content: '+this.cms.value.metaDescription+' status: '+this.cms.value.status);

          this.cmsService.create(this.cms.value).subscribe(
            data => {
                this.cmsAddResponse = data;
                if(this.cmsAddResponse.code == 200)
                { 
                    this.alertService.success(this.cmsAddResponse.message,true);
                    this.loading = false;
                    this.router.navigate(['cms/summary']);
                }
                else{ 
                    this.alertService.error(this.cmsAddResponse.message);
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
 