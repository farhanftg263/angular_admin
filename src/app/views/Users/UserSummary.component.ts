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
  userDeleteResponse : any = {};
  message: string;
  userStatus : boolean = false;
  totalItems: number = 64;
  currentPage: number   = 4;
  smallnumPages: number = 0;

  maxSize: number = 5;
  bigTotalItems: number = 675;
  bigCurrentPage: number = 1;
  numPages: number = 0;

  currentPager: number   = 4;
  user_id : string;

    constructor(
      private router : Router,
      private alertService : AlertService,
      private userService : UserService,

    ){}

    ngOnInit() {
      //get user list
      this.setPage(1);
      this.userService.getAll(this.currentPage).subscribe(
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
      this.userService.getAll(event.page).subscribe(
        data => {
            this.userSummary = data;
            this.totalItems = this.userSummary.total;
            this.currentPage = parseInt(this.userSummary.current);
            
            console.log(this.userSummary);
        },
        error => {
            this.alertService.error(error);
        }
      )
    }
    /*
       Function Type : Change Status
       Author : Farhan
       Created On : 24-09-2018
    */
    changeStatus(user)
    {
        user.userStatus =  parseInt(user.userStatus) == 1 ? 0 : 1;
        this.userService.status(user._id,user.userStatus).subscribe(data => {
            console.log(data);
        })
    }
    /*
      Function Type : Delete user records
      Author : Function
      Created On : 25-09-2018
    */
   delete(id:string){
    if(confirm("Are you sure you want to delete the user")) {
      console.log(id);
    this.user_id = id;
        if(!(this.user_id))
        {
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['cms/summary']);
        }
        // console.log('iiiiiiddddd '+this.cmsid); 
        this.userService.delete(this.user_id).subscribe(
            data => {
                this.userDeleteResponse = data;
                if(this.userDeleteResponse.code == 200)
                { 
                    this.alertService.success(this.userDeleteResponse.message,true);
                    this.loading = false;
                    document.getElementById("delete_"+this.user_id).style.display = 'none';                      
                    this.router.navigate(['cms/summary']);
                }
                else{ 
                    this.alertService.error(this.userDeleteResponse.message);
                    this.loading = false;
                }
            },
            error => { 
                this.alertService.error(error);
                this.loading = false;
            }
        )        
    }
}

 }