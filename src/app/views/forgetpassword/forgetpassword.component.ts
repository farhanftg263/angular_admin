import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { AlertService, AuthenticationService } from '../../_services/index';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'forgetpassword.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})
export class ForgetPasswordComponent implements OnInit  {
  loading = false;
  returnUrl : string;
  model: FormGroup;
  message: string;
  forgetPasswordResponse : any = {};
    constructor(
      private router : Router,
      private authService: AuthenticationService,
      private alertService : AlertService,
      private fb: FormBuilder

    ){}

    ngOnInit() {
      // Form validation
        this.model = this.fb.group({
            "email": ['',[Validators.required,Validators.email]],
        });
    }

    //Login 
    forgetPassword()
    {
        this.authService.forgetPassword(this.model.value.email).subscribe(
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
