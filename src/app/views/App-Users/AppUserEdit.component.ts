import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,AppUserService,ValidationService,RolesService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';

import { DatepickerOptions } from 'ng2-datepicker';
import * as frLocale from 'date-fns/locale/fr';
import * as enLocale from 'date-fns/locale/en';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'AppUserEdit.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})
export class AppUserEditComponent implements OnInit {
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
    userEditResponse : any = {};
    message: string;
    user: FormGroup;
    user_id : string;
    submitted = false;
      constructor(
        private router : Router,
        private route : ActivatedRoute,
        private alertService : AlertService,
        private userService : AppUserService,
        private roleService : RolesService,
        private fb: FormBuilder,
      ){}
    ngOnInit() {
        //get user list
        
        this.user_id = this.route.snapshot.paramMap.get('id');
        if(!(this.user_id))
        {
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['app_user/summary']);
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
                    (<HTMLInputElement>document.getElementById("my-date-picker")).value=result.dob;                     
                    this.user = this.fb.group({
                        "id" : [result._id],                       
                        "firstName": [result.firstName, [Validators.required, Validators.minLength(2),Validators.maxLength(20)]],           
                        "email": [result.email,[Validators.required,Validators.email, Validators.minLength(6),Validators.maxLength(60)]],                        
                        "lastName": [result.lastName,[Validators.required, Validators.minLength(2),Validators.maxLength(20)]],
                        "username": [result.username,[Validators.required, Validators.minLength(6),Validators.maxLength(20)]],
                        "dob": [result.dob]                     
                    });
                }
                else{
                    this.alertService.error(this.userEditResponse.message,true);
                    this.router.navigate['app_user/summary']
                }
            },
            error => {
                this.alertService.error(error);
            }        
          );

           // Form validation
        this.user = this.fb.group({
            "firstName": ['', [Validators.required, Validators.minLength(2),Validators.maxLength(20)]],           
            "email": ['',[Validators.required,Validators.email, Validators.minLength(6),Validators.maxLength(60)]],                        
            "lastName": ['',[Validators.required, Validators.minLength(2),Validators.maxLength(20)]],
            "username": ['',[Validators.required, Validators.minLength(6),Validators.maxLength(20)]],
            "dob": ['']    
          
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
        var dobval = (<HTMLInputElement>document.getElementById("my-date-picker")).value;                     
       this.user.value.dob=dobval;

        this.userService.update(this.user.value).subscribe(
        data => {
            this.userEditResponse = data;
            if(this.userEditResponse.code == 200)
            { 
                this.alertService.success(this.userEditResponse.message,true);
                this.loading = false;
                this.router.navigate(['app_user/summary']);
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