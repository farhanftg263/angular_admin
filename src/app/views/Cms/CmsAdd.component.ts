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
  message: string;
  cms: FormGroup;
    cmsAddForm: FormGroup;
    submitted = false;
      constructor(
        private router : Router,
        private alertService : AlertService,       
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
          "contentControl": ['',[Validators.required,Validators.minLength(2)]],
          "metaTitle" : [''],
          "metaDescription" : ['']         
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
          
          if(this.cms.invalid)
          { alert('nn');
          
              return;

          }
          console.log(this.cms.value);
          alert("Success name"+this.cms.value.pageName+' meta title: '+this.cms.value.metaTitle+' meta content: '+this.cms.value.metaDescription+' status: '+this.cms.value.status);
      }
     
    }
 