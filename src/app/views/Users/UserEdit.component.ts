import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,UserService,ValidationService,RolesService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'UserEdit.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})
export class UserEditComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl : string;
    roleList : any = {};
    userEditResponse : any = {};
    message: string;
    user: FormGroup;
    user_id : string;
    submitted = false;
      constructor(
        private router : Router,
        private route : ActivatedRoute,
        private alertService : AlertService,
        private userService : UserService,
        private roleService : RolesService,
        private fb: FormBuilder,
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

        this.user_id = this.route.snapshot.paramMap.get('id');
        if(!(this.user_id))
        {
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['admin_user/summary']);
        }

        // Get user by id
        this.userService.getById(this.user_id).subscribe(
            data => {
                this.userEditResponse = data;
                console.log(this.userEditResponse);
                if(this.userEditResponse.code == 200)
                {
                    // Form validation
                    let result : any = this.userEditResponse.result;
                    console.log(result.userStatus);
                    this.user = this.fb.group({
                        "id" : [result._id],
                        "firstName": [result.firstName, [Validators.required, Validators.minLength(2)]],
                        "email": [result.email,[Validators.required,Validators.email]],
                        "lastName": [result.lastName,Validators.required],
                        "userType" : [result.userType,Validators.required],
                        "userStatus" : [result.userStatus]
                    });
                }
                else{
                    this.alertService.error(this.userEditResponse.message,true);
                    this.router.navigate['admin_user/summary']
                }
            },
            error => {
                this.alertService.error(error);
            }        
          );

           // Form validation
        this.user = this.fb.group({
            "firstName": ['', [Validators.required, Validators.minLength(2)]],
            "email": ['',[Validators.required,Validators.email]],
            "lastName": ['',Validators.required],
            "userType" : ['',Validators.required],
           // "userStatus" : ['1']
        });
    }

    /*
      Function :  Edit User
      Author : Farhan
      Created On : 14:09:2018
    */
    edit()
    {
        this.submitted = true;
        this.loading = true;
        console.log(this.user.value);
        if(this.user.invalid)
        {           
            return;

        }
        this.userService.update(this.user.value).subscribe(
        data => {
            this.userEditResponse = data;
            if(this.userEditResponse.code == 200)
            { 
                this.alertService.success(this.userEditResponse.message,true);
                this.loading = false;
                this.router.navigate(['admin_user/summary']);
            }
            else{ 
                this.alertService.error(this.userEditResponse.message);
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