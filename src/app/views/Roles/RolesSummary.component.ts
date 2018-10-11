import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,RolesService,UserService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'RolesSummary.component.html'
})

export class RolesSummaryComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  rolesSummary : any = {};
  message: string;
  rolesDelete : any = {};
  rolesUpdate : any = {};
  rolesAddResponse : any = {};
  userData: any={};
  id: number;
  rolesid:string;
  submitted = false;
  roles: FormGroup;

  totalItems: number = 64;
  currentPage: number   = 4;
  smallnumPages: number = 0;

  maxSize: number = 5;
  bigTotalItems: number = 675;
  bigCurrentPage: number = 1;
  numPages: number = 0;
  currentPager: number   = 4;

  sortDirection : any={};
  SortField : any='_id';
  SortFieldDir :any='0';
  search_key: any;
  perPage:any;

 
    constructor(
      private router : Router,
      private alertService : AlertService,
      private rolesService : RolesService,
      private userService : UserService,
      private route: ActivatedRoute,
      private fb: FormBuilder,
     

    ){}

    ngOnInit() {
      //get role list
      this.setPage(1);
      this.sortDirection = 0;       
      this.rolesService.getAll(this.currentPage,this.SortField,this.SortFieldDir).subscribe(      
        data => {
            this.rolesSummary = data;
            this.totalItems = this.rolesSummary.total;
            this.currentPage = this.rolesSummary.current;
            this.perPage = this.rolesSummary.perPage;
            console.log(this.rolesSummary);
        },
        error => {
            this.alertService.error(error);
        }
      )

      this.roles = this.fb.group({
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
        if(this.roles.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.rolesService.getAllByRoleName(event.page,this.SortField,this.SortFieldDir,this.roles.value.searchKey).subscribe(                  
            data => {
                this.rolesSummary = data;
                this.totalItems = this.rolesSummary.total;
                this.currentPage = parseInt(this.rolesSummary.current);
                this.perPage=this.rolesSummary.perPage;
                console.log(this.rolesSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{
            this.rolesService.getAll(event.page,this.SortField,this.SortFieldDir).subscribe(                
            data => {
                this.rolesSummary = data;
                this.totalItems = this.rolesSummary.total;
                this.currentPage = parseInt(this.rolesSummary.current);
                this.perPage=this.rolesSummary.perPage;
                console.log(this.rolesSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }
      }
    
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
       if(this.roles.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.rolesService.getAllByRoleName(this.currentPage,fieldsName,sortDirection,this.roles.value.searchKey).subscribe(                  
            data => {
                this.rolesSummary = data;
                this.totalItems = this.rolesSummary.total;
                this.currentPage = parseInt(this.rolesSummary.current);
                this.perPage=this.rolesSummary.perPage;
                console.log(this.rolesSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{
       
            this.rolesService.getAll(this.currentPage,fieldsName,sortDirection).subscribe(        
            data => {
                this.rolesSummary = data;
                this.totalItems = this.rolesSummary.total;
                this.currentPage = parseInt(this.rolesSummary.current);
                this.perPage=this.rolesSummary.perPage;
                console.log(this.rolesSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }
    }

  /*
    Function Name : delete 
    Author  : Pradeep Chaurasia
    Created : 20-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for delete role pages
  */

    delete(id:string){
        if(confirm("Are you sure you want delete the role")) {
        console.log('This is deleted id: '+id);
        //this.rolesid=this.route.snapshot.paramMap.get('id');
        this.rolesid=id;
            if(!(this.rolesid)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                console.log('This is deleted id2: '+this.rolesid);
                this.router.navigate(['roles/summary']);
            }
            // console.log('iiiiiiddddd '+this.rolesid);
            this.userService.getUserIdByRoleId(this.rolesid).subscribe(
                data => {
                    this.userData = data;                   
                    if((this.userData.code != 400)){
                        this.alertService.error('Sorry, this record is used in admin user section so you can not delete this role.',true);
                        this.loading = false;                        
                        this.router.navigate(['roles/summary']);
                    }else{
                        this.rolesService.delete(this.rolesid).subscribe(
                            data => {
                                this.rolesAddResponse = data;
                                if(this.rolesAddResponse.code == 200)
                                { 
                                    this.alertService.success(this.rolesAddResponse.message,true);
                                    this.loading = false;
                                    document.getElementById("delete_"+this.rolesid).style.display = 'none';                      
                                    this.router.navigate(['roles/summary']);
                                }
                                else{ 
                                    this.alertService.error(this.rolesAddResponse.message);
                                    this.loading = false;
                                }
                            },
                            error => { 
                            // console.log(error);
                                this.alertService.error(error);
                                this.loading = false;
                            }
                        )
                    }
                }
            )                    
        }
    }

  /*
    Function Name : changeStatus
    Author  : Pradeep Chaurasia
    Created : 27-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for change status of roles pages like active and Inactive
  */

    changeStatus(roles)
    {
        if(confirm("Are you sure you want to change the status of this role")) {
            if(!(roles._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['roles/summary']);
            }
            
            this.userService.getUserIdByRoleId(roles._id).subscribe(
                data => {
                    this.userData = data;                   
                    if((this.userData.code != 400)){
                        this.alertService.error('Sorry, this record is used in admin user section so you can not change status of this record.',true);
                        this.loading = false;                        
                        this.router.navigate(['roles/summary']);
                    }else{
                        roles.status =  parseInt(roles.status) == 1 ? 0 : 1;
                        this.rolesService.updateStatus(roles._id,roles.status).subscribe(data => {
                            console.log(data);
                            this.rolesAddResponse = data;
                            if(this.rolesAddResponse.code == 200)
                                { 
                                    this.alertService.success(this.rolesAddResponse.message,true);
                                }else{ 
                                    this.alertService.error(this.rolesAddResponse.message);
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
            )
        }
    }

    
    searchedData(){
        console.log('all fields valu of search form: '+this.roles.value.searchKey);
        this.setPage(1);
        this.sortDirection = 0;
        if(this.roles.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.rolesService.getAllByRoleName(this.currentPage,this.SortField,this.sortDirection,this.roles.value.searchKey).subscribe(                  
            data => {
                this.rolesSummary = data;
                this.totalItems = this.rolesSummary.total;
                this.currentPage = parseInt(this.rolesSummary.current);
                this.perPage=this.rolesSummary.perPage;
                console.log(this.rolesSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{

            this.rolesService.getAll(this.currentPage,this.SortField,this.sortDirection).subscribe(                  
                data => {
                    this.rolesSummary = data;
                    this.totalItems = this.rolesSummary.total;
                    this.currentPage = parseInt(this.rolesSummary.current);
                    this.perPage=this.rolesSummary.perPage;
                    console.log(this.rolesSummary);
                },
                error => {
                    this.alertService.error(error);
                }
                )


        }
    }
    
 }