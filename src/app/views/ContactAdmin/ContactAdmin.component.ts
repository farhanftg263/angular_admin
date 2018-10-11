import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,ContactAdminService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'ContactAdmin.component.html',
  
})

export class ContactAdminComponent implements OnInit  {
  model: any = {};
  loading = false;
  contactAdmin : FormGroup;
  userStatus : boolean = false;
  sortDirection : any={};
  SortField : any='_id';
  SortFieldDir :any='0';
  search_key: any;
  private _album = [];
  private userDetails = [];
  is_get_data : boolean = false;

  contactAdminSummary : any = {};
 
  // Pagination Attribute
  totalItems: number = 64;
  currentPage: number   = 4;
  smallnumPages: number = 0;

  maxSize: number = 5;
  bigTotalItems: number = 675;
  bigCurrentPage: number = 1;
  numPages: number = 0;

  currentPager: number   = 4;
  perPage:any;
  /////////////////////////

    constructor(
      private router : Router,
      private alertService : AlertService,
      private contactAdminService : ContactAdminService,
      private route: ActivatedRoute,
      private fb : FormBuilder
    ){}

    ngOnInit() {
        // cal services
        this.loading = true;
        this.sortDirection = 0;
        this.setPage(1);
        this.contactAdminService.getAll(this.currentPage,this.SortField,this.SortFieldDir).subscribe( data => {
            this.contactAdminSummary = data;
            console.log("HI "+this.contactAdminSummary);
            this.totalItems = this.contactAdminSummary.total;
            this.currentPage = this.contactAdminSummary.current;
            this.perPage=this.contactAdminSummary.perPage;
            this.loading = false;
            if(!this.contactAdminSummary.total)
            {
                this.is_get_data = true;
            }
        },
        error => {
            this.alertService.error(error);
            this.loading = false;
        })

        this.contactAdmin = this.fb.group({
            "searchKey": ['', ]   
        });
    }

    setPage(pageNo: number): void {
        this.currentPage = pageNo;
    }
    pageChanged(event: any): void {
        this.sortDirection = 0;
        this.loading = true;
        console.log('Page changed to: ' + event.page);
        console.log('Number items per page: ' + event.itemsPerPage);
        if(this.contactAdmin.value.searchKey){ 
              console.log('Before sort direction for sort: ' + this.sortDirection);
          
              this.contactAdminService.getAllBySearchKey(event.page,this.SortField,this.SortFieldDir,this.contactAdmin.value.searchKey).subscribe(                  
              data => {
                  this.contactAdminSummary = data;
                  this.totalItems = this.contactAdminSummary.total;
                  this.currentPage = parseInt(this.contactAdminSummary.current);
                  this.perPage=this.contactAdminSummary.perPage;
                  console.log(this.contactAdminSummary);
                  this.loading = false;
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
              )
          }else{
              this.contactAdminService.getAll(event.page,this.SortField,this.SortFieldDir).subscribe(      
                  data => {
                      this.contactAdminSummary = data;
                      this.totalItems = this.contactAdminSummary.total;
                      this.currentPage = parseInt(this.contactAdminSummary.current);
                      this.perPage=this.contactAdminSummary.perPage;
                      console.log(this.contactAdminSummary);
                      this.loading = false;
                  },
                  error => {
                      this.alertService.error(error);
                      this.loading = false;
                  }
              )
          }
      }
    
      /*
       Function Type : sortByFields
       Author : Farhan
       Created On : 09-10-2018
    */
    sortByFields(fieldsName:string,sortDirection:any): void {
        this.setPage(1);
        this.loading = true;
        console.log('Before sort direction for sort: ' + this.sortDirection);
        if(this.sortDirection==0){
            this.sortDirection=1;
        }else{
            this.sortDirection=0;
        }
        this.SortField=fieldsName;
        this.SortFieldDir=sortDirection;
        console.log('log '+fieldsName);

       if(this.contactAdmin.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
            this.contactAdminService.getAllBySearchKey(this.currentPage,fieldsName,sortDirection,this.contactAdmin.value.searchKey).subscribe(                  
            data => {
                this.contactAdminSummary = data;
                this.totalItems = this.contactAdminSummary.total;
                this.currentPage = parseInt(this.contactAdminSummary.current);
                this.perPage=this.contactAdminSummary.perPage;
                console.log(this.contactAdminSummary);
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
            )
        }else{
            this.contactAdminService.getAll(this.currentPage,fieldsName,sortDirection).subscribe(        
            data => {
                this.contactAdminSummary = data;
                this.totalItems = this.contactAdminSummary.total;
                this.currentPage = parseInt(this.contactAdminSummary.current);
                this.perPage=this.contactAdminSummary.perPage;
                console.log(this.contactAdminSummary);
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
            )
        }
    }
    /*
      Function Type : filter photo record
      Author : Farhan
      Created On : 03-10-2018
    */
   searchedData(){
        console.log('all fields value of search form: '+this.contactAdmin.value.searchKey);
        this.setPage(1);
        this.sortDirection = 0;
        this.loading = true;
        if(this.contactAdmin.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.contactAdminService.getAllBySearchKey(this.currentPage,this.SortField,this.sortDirection,this.contactAdmin.value.searchKey).subscribe(                  
            data => {
                this.contactAdminSummary = data;
                this.totalItems = this.contactAdminSummary.total;
                this.currentPage = parseInt(this.contactAdminSummary.current);
                this.perPage=this.contactAdminSummary.perPage;
                console.log(this.contactAdminSummary);
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            })
        }else{

            this.contactAdminService.getAll(this.currentPage,this.SortField,this.sortDirection).subscribe(                  
                data => {
                    this.contactAdminSummary = data;
                    this.totalItems = this.contactAdminSummary.total;
                    this.currentPage = parseInt(this.contactAdminSummary.current);
                    
                    console.log(this.contactAdminSummary);
                    this.loading = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                })

        }
    }
    /*
      Function Type : Delete contact admin records
      Author : Farhan
      Created On : 11-10-2018
    */
    delete(id:string){
        if(confirm("Are you sure you want to delete this record")) {
            if(!(id))
            {
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['contact-admin/summary']);
            }
            // console.log('iiiiiiddddd '+this.cmsid); 
            this.contactAdminService.delete(id).subscribe(
                data => {
                    var contactAdminResponse: any = data;
                    if(contactAdminResponse.code == 200)
                    { 
                        this.alertService.success(contactAdminResponse.message,true);
                        this.loading = false;
                        document.getElementById("delete_"+id).style.display = 'none';                      
                        this.router.navigate(['contact-admin/summary']);
                    }
                    else{ 
                        this.alertService.error(contactAdminResponse.message);
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