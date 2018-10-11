import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,RolesService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'RolesEdit.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})

export class RolesEditComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  rolesEdit : any = {};
  rolesAddResponse : any = {};
  message: string;
  roles: FormGroup;
  rolesAddForm: FormGroup;
  id: number;
  rolesid:string;
  pageName:string;
  private sub: any;
  totalpage:any={};
  submitted = false;
  validRolename=false;
      constructor(
        private router : Router,
        private alertService : AlertService,
        private rolesService : RolesService,       
        private validationService : ValidationService,
        private fb: FormBuilder,
        private route: ActivatedRoute
      ){}
      

    ngOnInit() {
      //get roles edit record      
      this.rolesid=this.route.snapshot.paramMap.get('id');
        if(!(this.rolesid)){
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['roles/summary']);
        }
      console.log('iiiiiiddddd '+this.rolesid);
      this.rolesService.getById(this.rolesid).subscribe(
        data => {
            this.rolesEdit = data;
            if(!(this.rolesEdit.result._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['roles/summary']);
            }else{     
                
                this.roles = this.fb.group({
                    "id":[this.rolesEdit.result._id],
                    "roleName": [this.rolesEdit.result.roleName, [Validators.required, Validators.minLength(2)]],
                    "description": [this.rolesEdit.result.description],                   
                    "status" : [this.rolesEdit.result.status]         
                });
            }
        },
        error => {
            this.alertService.error(error);
        }        
      );    

     // Form validation
         this.roles = this.fb.group({
          "roleName": ['', [Validators.required, Validators.minLength(2)]],
          "description": [''],         
          "status" : ['1']         
      });
    }

    /*
      Function :  Edit ROLE
      Author : Pradeep Chaurasia
      Created On : 27:09:2018
    */
      edit()
      {
          this.submitted = true;
          this.loading = true;
          
          if(this.roles.invalid)
          {  this.validRolename=true;       
              return;

          }
          this.validRolename=false;   
          console.log('all fields value: '+stringify(this.roles.value));
          //alert("Success name"+this.cms.value.pageName+' meta title: '+this.cms.value.metaTitle+' meta content: '+this.cms.value.metaDescription+' status: '+this.cms.value.status);

          this.rolesService.update(this.roles.value).subscribe(
            data => {
                this.rolesAddResponse = data;
                if(this.rolesAddResponse.code == 200)
                { 
                    this.alertService.success(this.rolesAddResponse.message,true);
                    this.loading = false;
                    this.router.navigate(['roles/summary']);
                }
                else{                
                this.alertService.error(this.rolesAddResponse.message);
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
 