import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,UserService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';
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
  userAddResponse : any = {};
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

  sortDirection : any={};
  SortField : any='_id';
  SortFieldDir :any='0';
  search_key: any;
  perPage:any;
  users: FormGroup;

    constructor(
      private router : Router,
      private alertService : AlertService,
      private userService : UserService,
      private route: ActivatedRoute,
      private fb: FormBuilder,

    ){}

    ngOnInit() {
      //get user list
      this.setPage(1);
      this.sortDirection = 0;  
      
    this.userService.getAll(this.currentPage,this.SortField,this.SortFieldDir).subscribe(          
        data => {
            this.userSummary = data;
            this.totalItems = this.userSummary.total;
            this.currentPage = this.userSummary.current;
            this.perPage=this.userSummary.perPage;
            console.log(this.userSummary);
        },
        error => {
            this.alertService.error(error);
        }
      )

      this.users = this.fb.group({
        "searchKey": ['', ]   
        });
    }

    setPage(pageNo: number): void {
      this.currentPage = pageNo;
    }
  
    pageChanged(event: any): void {
      this.sortDirection = 0;
      console.log('Page changed to: ' + event.page);
      console.log('Number items per page: ' + event.itemsPerPage);
      if(this.users.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.userService.getAllBySearchKey(event.page,this.SortField,this.SortFieldDir,this.users.value.searchKey).subscribe(                  
            data => {
                this.userSummary = data;
                this.totalItems = this.userSummary.total;
                this.currentPage = parseInt(this.userSummary.current);
                this.perPage=this.userSummary.perPage;
                console.log(this.userSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{
            this.userService.getAll(event.page,this.SortField,this.SortFieldDir).subscribe(      
                data => {
                    this.userSummary = data;
                    this.totalItems = this.userSummary.total;
                    this.currentPage = parseInt(this.userSummary.current);
                    this.perPage=this.userSummary.perPage;
                    console.log(this.userSummary);
                },
                error => {
                    this.alertService.error(error);
                }
            )
        }
    }
    
    /*
       Function Type : sortByFields
       Author : Pradeep Chaurasia
       Created On : 28-09-2018
    */
    sortByFields(fieldsName:string,sortDirection:any): void {
        this.setPage(1);
        console.log('Before sort direction for sort: ' + this.sortDirection);
        if(this.sortDirection==0){
            this.sortDirection=1;
        }else{
            this.sortDirection=0;
        }
            this.SortField=fieldsName;
            this.SortFieldDir=sortDirection;

       if(this.users.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.userService.getAllBySearchKey(this.currentPage,fieldsName,sortDirection,this.users.value.searchKey).subscribe(                  
            data => {
                this.userSummary = data;
                this.totalItems = this.userSummary.total;
                this.currentPage = parseInt(this.userSummary.current);
                this.perPage=this.userSummary.perPage;
                console.log(this.userSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{
            this.userService.getAll(this.currentPage,fieldsName,sortDirection).subscribe(        
            data => {
                this.userSummary = data;
                this.totalItems = this.userSummary.total;
                this.currentPage = parseInt(this.userSummary.current);
                this.perPage=this.userSummary.perPage;
                console.log(this.userSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }
    }

    /*
       Function Type : Change Status
       Author : Farhan
       Created On : 24-09-2018
    */
    changeStatus(user)
    {
        if(confirm("Are you sure you want to change the status of this user")) {
            user.userStatus =  parseInt(user.userStatus) == 1 ? 0 : 1;
            this.userService.status(user._id,user.userStatus).subscribe(data => {
                console.log(data);
                console.log(data);
                this.userAddResponse = data;
                if(this.userAddResponse.code == 200)
                    { 
                        this.alertService.success(this.userAddResponse.message,true);
                    }else{ 
                        this.alertService.error(this.userAddResponse.message);
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
    /*
      Function Type : Delete user records
      Author : Function
      Created On : 25-09-2018
    */
   delete(id:string){
        if(confirm("Are you sure you want to delete this user")) {
            console.log(id);
            this.user_id = id;
            if(!(this.user_id))
            {
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['admin_user/summary']);
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
                        this.router.navigate(['admin_user/summary']);
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

     /*
      Function Type : filter user record
      Author : Pradeep Chaurasia
      Created On : 03-10-2018
    */
    searchedData(){
        console.log('all fields value of search form: '+this.users.value.searchKey);
        this.setPage(1);
        this.sortDirection = 0;
        if(this.users.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.userService.getAllBySearchKey(this.currentPage,this.SortField,this.sortDirection,this.users.value.searchKey).subscribe(                  
            data => {
                this.userSummary = data;
                this.totalItems = this.userSummary.total;
                this.currentPage = parseInt(this.userSummary.current);
                this.perPage=this.userSummary.perPage;
                console.log(this.userSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{

            this.userService.getAll(this.currentPage,this.SortField,this.sortDirection).subscribe(                  
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
    }

 }