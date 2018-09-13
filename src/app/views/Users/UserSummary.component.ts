import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,UserService} from '../../_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'UserSummary.component.html'
})

export class UserSummaryComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  userSummary : any = {};
  message: string;
    constructor(
      private router : Router,
      private alertService : AlertService,
      private userService : UserService,

    ){}

    ngOnInit() {
      //get user list
      this.userService.getAll().subscribe(
        data => {
            this.userSummary = data;
        },
        error => {
            this.alertService.error(error);
        }
      )
    }
 }