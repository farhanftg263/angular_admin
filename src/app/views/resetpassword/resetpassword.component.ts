import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { AlertService, AuthenticationService, ValidationService } from '../../_services/index';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'resetpassword.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})
export class ResetPasswordComponent implements OnInit  {
  loading = false;
  returnUrl : string;
  model: FormGroup;
  message: string;
  varfyResponse : any = {};
  forgetPasswordResponse : any = {};
    constructor(
      private router : Router,
      private route : ActivatedRoute,
      private authService: AuthenticationService,
      private alertService : AlertService,
      private validationService : ValidationService,
      private fb: FormBuilder

    ){}

    ngOnInit() {
      // Form validation
        this.model = this.fb.group({
            "password": ['',[Validators.required]],
            "confirmPassword": ['',[Validators.required]],
            "email":['']
        },{
            validator: this.validationService.matchingPasswords('password', 'confirmPassword')
        });
       
        this.verifyPassword();       
    }

    //verify password
    verifyPassword()
    {
         //consume services
        if(!this.route.snapshot.queryParams)
        {
            this.router.navigate(['forgetpassword']);   
        } 

        let email = this.route.snapshot.queryParams["email"];
        let token = this.route.snapshot.queryParams["token"];  
         this.authService.verifyPassword(email, token).subscribe(
            data => {
                if(data.code == 400)
                {
                    this.alertService.error(data.message,true);
                    this.router.navigate(['forgetpassword']);
                }
            },
            error => {
                this.alertService.error(error);
            }
        );
    }

    //Login 
    resetPassword()
    {
        let email = this.route.snapshot.queryParams["email"];
        this.authService.resetPassword(this.model.value.password,email).subscribe(
          data => {
              this.forgetPasswordResponse = data;
              if(this.forgetPasswordResponse.code == 200)
              {
                 this.alertService.success(this.forgetPasswordResponse.message);
              }
              else{
                 this.alertService.error(this.forgetPasswordResponse.message); 
              }
          },
          error => {
              this.alertService.error(error);
              this.loading = false;
          }
        );
    }
 }
