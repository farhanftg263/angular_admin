import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,RoleService, ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'UserAdd.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})
export class UserAddComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl : string;
    roleList : any = {};
    message: string;
    user: FormGroup;
    userAddForm: FormGroup;
    submitted = false;
      constructor(
        private router : Router,
        private alertService : AlertService,
        private roleService : RoleService,
        private validationService : ValidationService,
        private fb: FormBuilder
      ){}
    ngOnInit() {
        //get user list
        this.roleService.getAll().subscribe(
            data => {
                this.roleList = data;
                console.log(this.roleList);
            },
            error => {
                this.alertService.error(error);
            }
        )
        // Form validation
        this.user = this.fb.group({
            "firstName": ['', [Validators.required, Validators.minLength(2)]],
            "email": ['',[Validators.required,Validators.email]],
            "lastName": ['',Validators.required],
            "userType" : ['',Validators.required],
            "password" : ['',Validators.required],
            "confirmPassword" : ['',Validators.required]
        },{
            validator : this.validationService.matchingPasswords('password','confirmPassword')
        });
    }
    /*
      Function :  Add user
      Author : Farhan
      Created On : 14:09:2018
    */
    add()
    {
        this.submitted = true;
        console.log(this.user.invalid);
        if(this.user.invalid)
        {
            return;
        }
        alert("Success");
    }
}