import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,UserService} from '../../_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'UserSummary.component.html',
})

export class UserSummaryComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  userSummary : any = {};
  message: string;

  totalItems: number = 64;
  currentPage: number   = 4;
  smallnumPages: number = 0;

  maxSize: number = 5;
  bigTotalItems: number = 675;
  bigCurrentPage: number = 1;
  numPages: number = 0;

  currentPager: number   = 4;

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
            this.totalItems = this.userSummary.total;
            this.currentPage = this.userSummary.current;
            
            console.log(this.userSummary);
        },
        error => {
            this.alertService.error(error);
        }
      )
    }

    setPage(pageNo: number): void {
      this.currentPage = pageNo;
    }
  
    pageChanged(event: any): void {
      console.log('Page changed to: ' + event.page);
      console.log('Number items per page: ' + event.itemsPerPage);
    }

 }