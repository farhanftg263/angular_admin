import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,RolesService,UserService, ValidationService} from '../../_services';
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
    userAddResponse : any = {};
    message: string;
    user: FormGroup;
    userAddForm: FormGroup;
    submitted = false;
    firstNameLength = false;
      constructor(
        private router : Router,
        private alertService : AlertService,
        private roleService : RolesService,
        private userService : UserService,
        private validationService : ValidationService,
        private fb: FormBuilder
      ){}
    ngOnInit() {
        //get user list
        
        this.roleService.getAllActiveRoles(1).subscribe(
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
            "firstName": ['', [Validators.required]],
            "email": ['',[Validators.required,Validators.email, Validators.minLength(6),Validators.maxLength(60)]],
            "lastName": ['',[Validators.required, Validators.minLength(2),Validators.maxLength(20)]],
            "userType" : ['',Validators.required],
            "password" : ['',[Validators.required, Validators.minLength(2),Validators.maxLength(20)]],
            "confirmPassword" : ['',Validators.required]
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
        this.loading = true;
        
        if(this.user.invalid)
        {
            return;
        }      
        
        this.userService.create(this.user.value).subscribe(
            data => {
                this.userAddResponse = data;
                if(this.userAddResponse.code == 200)
                {
                    this.alertService.success(this.userAddResponse.message,true);
                    this.loading = false;
                    this.router.navigate(['admin_user/summary']);
                }
                else{
                    this.alertService.error(this.userAddResponse.message);
                    this.loading = false;
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            })
    }
}