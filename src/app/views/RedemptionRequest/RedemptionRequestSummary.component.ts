import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { appConfig } from '../../app.config';
import 'rxjs/add/operator/map';
import { AlertService,RedemptionRequestService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'RedemptionRequestSummary.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }
  .img-pointer{
    cursor:pointer
  }
  `
]
})

export class RedemptionRequestSummaryComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  redemptionSummary : any = {};
  message: string; 
  redemptionAddResponse : any = {};
  id: number;
  redemptionid:string;
  submitted = false;
  site_url = appConfig.apiUrl;
  private _album = [];

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
  perPage:any;
  redemption: FormGroup;
    constructor(
      private router : Router,
      private alertService : AlertService,
      private redemptionService : RedemptionRequestService,
      private route: ActivatedRoute,
      private fb: FormBuilder,
     

    ){}

    ngOnInit() {

        this.setPage(1);
        this.sortDirection = 0;       
        this.redemptionService.getAll(this.currentPage,this.SortField,this.SortFieldDir).subscribe(
        
            data => {
            
                this.redemptionSummary = data;
                this.totalItems = this.redemptionSummary.total;
                this.currentPage = this.redemptionSummary.current;
                this.perPage=this.redemptionSummary.perPage;
                console.log('all redemption record: '+JSON.stringify(this.redemptionSummary.result));
            },
            error => {
                console.log('error ocured under redemption request');
                console.log(error);
                this.alertService.error(error);
            }
            )
        this.redemption = this.fb.group({
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

        if(this.redemption.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.redemptionService.getAllBySearchKey(event.page,this.SortField,this.SortFieldDir,this.redemption.value.searchKey).subscribe(                  
            data => {
                this.redemptionSummary = data;
                this.totalItems = this.redemptionSummary.total;
                this.currentPage = parseInt(this.redemptionSummary.current);
                this.perPage=this.redemptionSummary.perPage;
                console.log(this.redemptionSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{

        this.redemptionService.getAll(event.page,this.SortField,this.SortFieldDir).subscribe(                
          data => {
            console.log(this.redemptionSummary);
              this.redemptionSummary = data;
              this.totalItems = this.redemptionSummary.total;
              this.currentPage = parseInt(this.redemptionSummary.current);
              this.perPage=this.redemptionSummary.perPage;
              console.log(this.redemptionSummary);
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
       if(this.redemption.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.redemptionService.getAllBySearchKey(this.currentPage,fieldsName,sortDirection,this.redemption.value.searchKey).subscribe(                  
            data => {
                this.redemptionSummary = data;
                this.totalItems = this.redemptionSummary.total;
                this.currentPage = parseInt(this.redemptionSummary.current);
                this.perPage=this.redemptionSummary.perPage;
                console.log(this.redemptionSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{
       
            this.redemptionService.getAll(this.currentPage,fieldsName,sortDirection).subscribe(        
            data => {
                this.redemptionSummary = data;
                this.totalItems = this.redemptionSummary.total;
                this.currentPage = parseInt(this.redemptionSummary.current);
                this.perPage=this.redemptionSummary.perPage;
                console.log(this.redemptionSummary);
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
    Type: Public function for delete product
  */

 changeStatus(id:string){
        if(confirm("Are you sure you want to mark as complete")) {
        console.log('This is changed id: '+id);
        //this.redemptionid=this.route.snapshot.paramMap.get('id');
        this.redemptionid=id;
            if(!(this.redemptionid)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                console.log('This is changed id2: '+this.redemptionid);
                this.router.navigate(['redemption_request/summary']);
            }
            // console.log('iiiiiiddddd '+this.redemptionid); 
            this.redemptionService.changeStatus(this.redemptionid,1).subscribe(
                data => {
                    this.redemptionAddResponse = data;
                    if(this.redemptionAddResponse.code == 200)
                    { 
                        this.alertService.success(this.redemptionAddResponse.message,true);
                        this.loading = false;
                        //document.getElementById("delete_"+this.redemptionid).style.display = 'none';                      
                        this.router.navigate(['redemption_request/summary']);
                    }
                    else{ 
                        this.alertService.error(this.redemptionAddResponse.message);
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
  

     /*
      Function Type : filter product record
      Author : Pradeep Chaurasia
      Created On : 04-10-2018
    */
   searchedData(){
    console.log('all fields value of search form: '+this.redemption.value.searchKey);
    this.setPage(1);
    this.sortDirection = 0;
    if(this.redemption.value.searchKey){ 
        console.log('Before sort direction for sort: ' + this.sortDirection);
    
        this.redemptionService.getAllBySearchKey(this.currentPage,this.SortField,this.sortDirection,this.redemption.value.searchKey).subscribe(                  
        data => {
            this.redemptionSummary = data;
            this.totalItems = this.redemptionSummary.total;
            this.currentPage = parseInt(this.redemptionSummary.current);
            this.perPage=this.redemptionSummary.perPage;
            console.log(this.redemptionSummary);
        },
        error => {
            this.alertService.error(error);
        }
        )
    }else{

            this.redemptionService.getAll(this.currentPage,this.SortField,this.sortDirection).subscribe(                  
                data => {
                    this.redemptionSummary = data;
                    this.totalItems = this.redemptionSummary.total;
                    this.currentPage = parseInt(this.redemptionSummary.current);
                    this.perPage=this.redemptionSummary.perPage;
                    console.log(this.redemptionSummary);
                },
                error => {
                    this.alertService.error(error);
                }
                )


        }
    }
 }