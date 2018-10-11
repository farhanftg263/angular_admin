import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,ChangePasswordService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'ChangePassword.component.html',
  styles: [` 
        .invalid-feedback{
            display: block;
        }`
    ]
})

export class ChangePasswordComponent implements OnInit  {
    model: any = {};
    loading = false;
    returnUrl : string;    
    changePasswordSummary : any={};
    changePasswordAddResponse : any = {};
    message: string;
    changePassword: FormGroup;
    changePasswordAddForm: FormGroup;
    id: number;
    changePasswordid:string;    
    private sub: any;    
    submitted = false;
        constructor(
          private router : Router,
          private alertService : AlertService,
          private changePasswordService : ChangePasswordService,       
          private validationService : ValidationService,
          private fb: FormBuilder,
          private route: ActivatedRoute
        ){}

    ngOnInit() {

         // Form validation
         console.log('??????????????????');
         var logedinUser = JSON.parse(localStorage.getItem("currentUser"));
        // console.log('loged in user: '+JSON.stringify(logedinUser));
         //console.log('loged in user2: '+JSON.stringify(logedinUser.result._id));
         this.changePassword = this.fb.group({
            "id":[logedinUser.result._id],
            "password": ['',[Validators.required]],
            "confirmPassword": ['',[Validators.required]],
            //"email":['']
        },{
            validator: this.validationService.matchingPasswords('password', 'confirmPassword')
        });
     
    }

      /*
      Function :  Update User's password
      Author : Pradeep Chaurasia
      Created On : 21:09:2018
    */

   update()
   {
    console.log('posted value: '+JSON.stringify(this.changePassword.value));
       this.changePasswordService.update(this.changePassword.value).subscribe(    
        data => {
            this.changePasswordAddResponse = data;
            if(this.changePasswordAddResponse.code == 200)
            { 
                this.alertService.success(this.changePasswordAddResponse.message,true);
                this.loading = false;
                //this.router.navigate(['/change_password']);
            }
            else{ 
                this.alertService.error(this.changePasswordAddResponse.message);
                this.loading = false;
            }
        },
        error => { 
            console.log(error);
            this.alertService.error(error);
            this.loading = false;
        });
   }

 }