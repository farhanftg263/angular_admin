import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,RolesService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'RolesAdd.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})

export class RolesAddComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  rolesAdd : any = {};
  rolesAddResponse : any = {};
  message: string;
  roles: FormGroup;
  rolesAddForm: FormGroup;
  submitted = false;
  validRolename=false;
      constructor(
        private router : Router,
        private alertService : AlertService,
        private rolesService : RolesService,       
        private validationService : ValidationService,
        private fb: FormBuilder
      ){}

    ngOnInit() {
      //get roles list
     
         // Form validation
         this.roles = this.fb.group({
          "roleName": ['', [Validators.required, Validators.minLength(2)]],
          "description": [''],          
          "status" : ['1']         
      });
    }

    /*
      Function :  Add Roles
      Author : Pradeep Chaurasia
      Created On : 27:09:2018
    */
      add()
      {
          this.submitted = true;
          this.loading = true;
          
          if(this.roles.invalid)
          {   this.validRolename=true;
              return;

          }
          this.validRolename=false;
          console.log(this.roles.value);
          
          this.rolesService.create(this.roles.value).subscribe(
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
 