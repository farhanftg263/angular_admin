import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,FeedbackService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'Feedback.component.html',
  
})

export class FeedbackComponent implements OnInit  {
  model: any = {};
  loading = false;
  feedback : FormGroup;
  userStatus : boolean = false;
  sortDirection : any={};
  SortField : any='_id';
  SortFieldDir :any='0';
  search_key: any;
  private _album = [];
  private userDetails = [];
  is_get_data : boolean = false;

  feedbackSummary : any = {};
 
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
      private feedbackService : FeedbackService,
      private route: ActivatedRoute,
      private fb : FormBuilder
    ){}

    ngOnInit() {
        // cal services
        this.loading = true;
        this.sortDirection = 0;
        this.setPage(1);
        this.feedbackService.getAll(this.currentPage,this.SortField,this.SortFieldDir).subscribe( data => {
            this.feedbackSummary = data;
            console.log("HI "+this.feedbackSummary);
            this.totalItems = this.feedbackSummary.total;
            this.currentPage = this.feedbackSummary.current;
            this.perPage=this.feedbackSummary.perPage;
            this.loading = false;
            if(!this.feedbackSummary.total)
            {
                this.is_get_data = true;
            }
        },
        error => {
            this.alertService.error(error);
            this.loading = false;
        })

        this.feedback = this.fb.group({
            "searchKey": ['', ]   
        });
    }

    setPage(pageNo: number): void {
        this.currentPage = pageNo;
    }
    pageChanged(event: any): void {
        this.sortDirection = 0;
        this.loading = true;
        
        if(this.feedback.value.searchKey){ 
              console.log('Before sort direction for sort: ' + this.sortDirection);
          
              this.feedbackService.getAllBySearchKey(event.page,this.SortField,this.SortFieldDir,this.feedback.value.searchKey).subscribe(                  
              data => {
                  this.feedbackSummary = data;
                  this.totalItems = this.feedbackSummary.total;
                  this.currentPage = parseInt(this.feedbackSummary.current);
                  this.perPage=this.feedbackSummary.perPage;
                  console.log(this.feedbackSummary);
                  this.loading = false;
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
              )
          }else{
              this.feedbackService.getAll(event.page,this.SortField,this.SortFieldDir).subscribe(      
                  data => {
                      this.feedbackSummary = data;
                      this.totalItems = this.feedbackSummary.total;
                      this.currentPage = parseInt(this.feedbackSummary.current);
                      this.perPage=this.feedbackSummary.perPage;
                      console.log(this.feedbackSummary);
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

       if(this.feedback.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
            this.feedbackService.getAllBySearchKey(this.currentPage,fieldsName,sortDirection,this.feedback.value.searchKey).subscribe(                  
            data => {
                this.feedbackSummary = data;
                this.totalItems = this.feedbackSummary.total;
                this.currentPage = parseInt(this.feedbackSummary.current);
                this.perPage=this.feedbackSummary.perPage;
                console.log(this.feedbackSummary);
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
            )
        }else{
            this.feedbackService.getAll(this.currentPage,fieldsName,sortDirection).subscribe(        
            data => {
                this.feedbackSummary = data;
                this.totalItems = this.feedbackSummary.total;
                this.currentPage = parseInt(this.feedbackSummary.current);
                this.perPage=this.feedbackSummary.perPage;
                console.log(this.feedbackSummary);
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
        console.log('all fields value of search form: '+this.feedback.value.searchKey);
        this.setPage(1);
        this.sortDirection = 0;
        this.loading = true;
        if(this.feedback.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.feedbackService.getAllBySearchKey(this.currentPage,this.SortField,this.sortDirection,this.feedback.value.searchKey).subscribe(                  
            data => {
                this.feedbackSummary = data;
                this.totalItems = this.feedbackSummary.total;
                this.currentPage = parseInt(this.feedbackSummary.current);
                this.perPage=this.feedbackSummary.perPage;
                console.log(this.feedbackSummary);
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            })
        }else{

            this.feedbackService.getAll(this.currentPage,this.SortField,this.sortDirection).subscribe(                  
                data => {
                    this.feedbackSummary = data;
                    this.totalItems = this.feedbackSummary.total;
                    this.currentPage = parseInt(this.feedbackSummary.current);
                    
                    console.log(this.feedbackSummary);
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
            this.feedbackService.delete(id).subscribe(
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