import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,RolesService,AppUserService, ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';

import { DatepickerOptions } from 'ng2-datepicker';
import * as frLocale from 'date-fns/locale/fr';
import * as enLocale from 'date-fns/locale/en';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'AppUserAdd.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})
export class AppUserAddComponent implements OnInit { 
     
    date: Date;
    options: DatepickerOptions = {
      locale: enLocale,
      minYear: 1970,
      maxYear: 2010,
      displayFormat: 'YYYY-MM-DD',
      addClass: 'fform-control',
     // minDate: new Date(Date.now()), // Minimal selectable date
      maxDate: new Date(Date.now()),  // Maximal selectable date
      placeholder: 'Click to select a date',
      useEmptyBarTitle: false,
      fieldId: 'my-date-picker',     
    };
    
    
    

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
        private userService : AppUserService,
        private validationService : ValidationService,
        private fb: FormBuilder,
        
      ){}
    ngOnInit() {
        this.date = new Date();
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
            "firstName": ['', [Validators.required, Validators.minLength(2),Validators.maxLength(20)]],           
            "email": ['',[Validators.required,Validators.email, Validators.minLength(6),Validators.maxLength(60)]],
            "confirmEmail": ['',[Validators.required,Validators.email]],
            "lastName": ['',[Validators.required, Validators.minLength(2),Validators.maxLength(20)]],
            "username": ['',[Validators.required, Validators.minLength(6),Validators.maxLength(20)]],
            "password" : ['',[Validators.required, Validators.minLength(2),Validators.maxLength(20)]],
            "confirmPassword" : ['',Validators.required],
            "dob":['']
        },{
            //validator: this.validationService.matchingPasswords('password', 'confirmPassword'),
            validator: this.validationService.matchingEmail('email', 'confirmEmail')
        });
    }
    /*
      Function :  Add user
      Author : Pradeep Chaurasia
      Created On : 08:10:2018
    */
    add()
    {
        
        this.submitted = true;
        this.loading = true;       
       var dobval = (<HTMLInputElement>document.getElementById("my-date-picker")).value;                     
       this.user.value.dob=dobval;
        if(this.user.invalid)
        {
            return;
        }      
        console.log('posted value: '+JSON.stringify(this.user.value));
        this.userService.create(this.user.value).subscribe(
            data => {
                this.userAddResponse = data;
                if(this.userAddResponse.code == 200)
                {
                    this.alertService.success(this.userAddResponse.message,true);
                    this.loading = false;
                    this.router.navigate(['app_user/summary']);
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