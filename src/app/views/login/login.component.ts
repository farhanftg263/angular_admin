import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { AlertService, AuthenticationService } from '../../_services/index';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  message: string;
    constructor(
      private router : Router,
      private authService: AuthenticationService,
      private alertService : AlertService

    ){}

    ngOnInit() {
      if(localStorage.getItem('currentUser'))
      {
        this.router.navigate(['dashboard']);
      }
    }

    //Login 
    login()
    {
        console.log(this.model);
        this.loading = true;
        this.message = '';
        this.authService.login(this.model.email , this.model.password).subscribe(
          data => {
              if(data.code == 200)
              {
                this.router.navigate(['dashboard']);
              }else{
                this.alertService.error(data.message);
              }
              this.loading = false;
          },
          error => {
              this.alertService.error(error);
              this.loading = false;
          }
        );
    }
 }
