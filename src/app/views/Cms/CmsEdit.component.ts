import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,CmsService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'CmsEdit.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})

export class CmsEditComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  cmsEdit : any = {};
  cmsAddResponse : any = {};
  message: string;
  cms: FormGroup;
  cmsAddForm: FormGroup;
  id: number;
  cmsid:string;
  pageName:string;
  private sub: any;
  totalpage:any={};
  submitted = false;
      constructor(
        private router : Router,
        private alertService : AlertService,
        private cmsService : CmsService,       
        private validationService : ValidationService,
        private fb: FormBuilder,
        private route: ActivatedRoute
      ){}
      

    ngOnInit() {
      //get cms edit record      
      this.cmsid=this.route.snapshot.paramMap.get('id');
        if(!(this.cmsid)){
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['cms/summary']);
        }
      console.log('iiiiiiddddd '+this.cmsid);
      this.cmsService.getById(this.cmsid).subscribe(
        data => {
            this.cmsEdit = data;
            if(!(this.cmsEdit.result._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['cms/summary']);
            }else{     
                
                this.cms = this.fb.group({
                    "id":[this.cmsEdit.result._id],
                    "pageName": [this.cmsEdit.result.pageName, [Validators.required, Validators.minLength(2)]],
                    "pageContent": [this.cmsEdit.result.pageContent,[Validators.required,Validators.minLength(2)]],
                    "metaTitle" : [this.cmsEdit.result.metaTitle],
                    "metaDescription" : [this.cmsEdit.result.metaDescription],
                    "status" : [this.cmsEdit.result.status]         
                });
            }
        },
        error => {
            this.alertService.error(error);
        }

        
      );    

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
      Function :  Edit CMS
      Author : Pradeep Chaurasia
      Created On : 17:09:2018
    */
      edit()
      {
          this.submitted = true;
          this.loading = true;
          
          if(this.cms.invalid)
          {           
              return;

          }
          console.log('all fields value: '+stringify(this.cms.value));
          //alert("Success name"+this.cms.value.pageName+' meta title: '+this.cms.value.metaTitle+' meta content: '+this.cms.value.metaDescription+' status: '+this.cms.value.status);

          this.cmsService.update(this.cms.value).subscribe(
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
 