import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,ManagePriceService} from '../../_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'ManagePriceSummary.component.html'
})

export class ManagePriceSummaryComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  managePriceSummary : any = {};
  message: string;
  priceDelete : any = {};
  priceUpdate : any = {};
  priceAddResponse : any = {};
  id: number;
  priceid:string;
  submitted = false;

  totalItems: number = 64;
  currentPage: number   = 1;
  smallnumPages: number = 0;

  maxSize: number = 5;
  bigTotalItems: number = 675;
  bigCurrentPage: number = 1;
  numPages: number = 0;
  sortDirection : any={};
  SortField : any='_id';
  SortFieldDir :any='0';
  

  currentPager: number   = 4;
    constructor(
      private router : Router,
      private alertService : AlertService,
      private managePriceService : ManagePriceService,
      private route: ActivatedRoute

    ){}

    ngOnInit() {
      //get cms list
      this.setPage(1);
      this.sortDirection = 0;        
      this.managePriceService.getAll(this.currentPage,this.SortField,this.SortFieldDir).subscribe(
        data => {
          console.log('mmmmmmmmmmm');
            this.managePriceSummary = data;
            this.totalItems = this.managePriceSummary.total;
            this.currentPage = this.managePriceSummary.current;
            console.log(this.managePriceSummary);
        },
        error => {
          console.log('pppppppppp');
          console.log(error);
            this.alertService.error(error);
        }
      )
     
    }
    setPage(pageNo: number): void {
        this.currentPage = pageNo;
      }
      pageChanged(event: any): void {
        this.sortDirection = 0; 
        console.log('Page changed to: ' + event.page);
        console.log('Number items per page: ' + event.itemsPerPage);
        console.log('bbbbbbbbb '+this.sortDirection);

        this.managePriceService.getAll(event.page,this.SortField,this.SortFieldDir).subscribe(        
          data => {
              this.managePriceSummary = data;
              this.totalItems = this.managePriceSummary.total;
              this.currentPage = parseInt(this.managePriceSummary.current);
              
              console.log(this.managePriceSummary);
          },
          error => {
              this.alertService.error(error);
          }
        )
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
            

        console.log('fields name for sort: ' + fieldsName);
        console.log('After sort direction for sort: ' + this.sortDirection);
        this.managePriceService.getAll(this.currentPage,fieldsName,sortDirection).subscribe(        
          data => {
              this.managePriceSummary = data;
              this.totalItems = this.managePriceSummary.total;
              this.currentPage = parseInt(this.managePriceSummary.current);
              
              console.log(this.managePriceSummary);
          },
          error => {
              this.alertService.error(error);
          }
        )
      }

  /*
    Function Name : delete 
    Author  : Pradeep Chaurasia
    Created : 24-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for delete price
  */

 delete(id:string){
  if(confirm("Are you sure you want to delete this record?")) {
  console.log('This is deleted id: '+id);
  //this.cmsid=this.route.snapshot.paramMap.get('id');
  this.priceid=id;
    if(!(this.priceid)){
        this.alertService.error('No record exists with given parameters provided',true);
        this.loading = false;
        this.router.navigate(['manage_price/summary']);
    }
 // console.log('iiiiiiddddd '+this.cmsid);
        this.managePriceService.delete(this.priceid).subscribe(
            data => {
                this.priceAddResponse = data;
                if(this.priceAddResponse.code == 200)
                { 
                    this.alertService.success(this.priceAddResponse.message,true);
                    this.loading = false;
                    document.getElementById("delete_"+this.priceid).style.display = 'none';                      
                    this.router.navigate(['manage_price/summary']);
                }
                else{ 
                    this.alertService.error(this.priceAddResponse.message);
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
Function Name : changeStatus
Author  : Pradeep Chaurasia
Created : 24-09-2018
Modified By : Pradeep Chaurasia
Type: Public function for change status of price like active and Inactive
*/

changeStatus(pricetemp)
    {
        if(confirm("Are you sure you want to change the status of the price")) {
            if(!(pricetemp._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['manage_price/summary']);
            } 
            pricetemp.status =  parseInt(pricetemp.status) == 1 ? 0 : 1;
            this.managePriceService.updateStatus(pricetemp._id,pricetemp.status).subscribe(data => {
                console.log(data);
                this.priceAddResponse = data;
                if(this.priceAddResponse.code == 200)
                    { 
                        this.alertService.success(this.priceAddResponse.message,true);
                    }else{ 
                        this.alertService.error(this.priceAddResponse.message);
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