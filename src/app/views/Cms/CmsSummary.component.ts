import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,CmsService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'CmsSummary.component.html'
})

export class CmsSummaryComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  cmsSummary : any = {};
  message: string;
  cmsDelete : any = {};
  cmsUpdate : any = {};
  cmsAddResponse : any = {};
  id: number;
  cmsid:string;
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
  cms: FormGroup;
  currentPager: number   = 4;
  perPage:any;
    constructor(
      private router : Router,
      private alertService : AlertService,
      private cmsService : CmsService,
      private route: ActivatedRoute,
      private fb: FormBuilder,

    ){}

    ngOnInit() {
      //get cms list
      this.setPage(1);
      this.sortDirection = 0;  
      this.cmsService.getAll(this.currentPage,this.SortField,this.SortFieldDir).subscribe(      
        data => {
            this.cmsSummary = data;
            this.totalItems = this.cmsSummary.total;
            this.currentPage = this.cmsSummary.current;
            this.perPage=this.cmsSummary.perPage;
            console.log(this.cmsSummary);
        },
        error => {
            this.alertService.error(error);
        }
      )
      this.cms = this.fb.group({
        "searchKey": ['', ]   
    });
     
    }

    setPage(pageNo: number): void {
        this.currentPage = pageNo;
      }
    
    pageChanged(event: any): void {
        console.log('Page changed to: ' + event.page);
        console.log('Number items per page: ' + event.itemsPerPage);
        if(this.cms.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.cmsService.getAllBySearchKey(event.page,this.SortField,this.SortFieldDir,this.cms.value.searchKey).subscribe(                  
            data => {
                this.cmsSummary = data;
                this.totalItems = this.cmsSummary.total;
                this.currentPage = parseInt(this.cmsSummary.current);
                this.perPage=this.cmsSummary.perPage;
                console.log(this.cmsSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{
            this.cmsService.getAll(event.page,this.SortField,this.SortFieldDir).subscribe(
                data => {
                    this.cmsSummary = data;
                    this.totalItems = this.cmsSummary.total;
                    this.currentPage = parseInt(this.cmsSummary.current);
                    this.perPage=this.cmsSummary.perPage;
                    console.log(this.cmsSummary);
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
        console.log('fields name for sort: ' + fieldsName);
        console.log('After sort direction for sort: ' + this.sortDirection);

        if(this.cms.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.cmsService.getAllBySearchKey(this.currentPage,fieldsName,sortDirection,this.cms.value.searchKey).subscribe(                  
            data => {
                this.cmsSummary = data;
                this.totalItems = this.cmsSummary.total;
                this.currentPage = parseInt(this.cmsSummary.current);
                this.perPage=this.cmsSummary.perPage;
                console.log(this.cmsSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{

            this.cmsService.getAll(this.currentPage,fieldsName,sortDirection).subscribe(        
            data => {
                this.cmsSummary = data;
                this.totalItems = this.cmsSummary.total;
                this.currentPage = parseInt(this.cmsSummary.current);
                this.perPage=this.cmsSummary.perPage;
                
                console.log(this.cmsSummary);
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
    Type: Public function for delete cms pages
  */

    delete(id:string){
        if(confirm("Are you sure you want to delete the CMS")) {
        console.log('This is deleted id: '+id);
        //this.cmsid=this.route.snapshot.paramMap.get('id');
        this.cmsid=id;
            if(!(this.cmsid)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                console.log('This is deleted id2: '+this.cmsid);
                this.router.navigate(['cms/summary']);
            }
            // console.log('iiiiiiddddd '+this.cmsid); 
            this.cmsService.delete(this.cmsid).subscribe(
                data => {
                    this.cmsAddResponse = data;
                    if(this.cmsAddResponse.code == 200)
                    { 
                        this.alertService.success(this.cmsAddResponse.message,true);
                        this.loading = false;
                        document.getElementById("delete_"+this.cmsid).style.display = 'none';                      
                        this.router.navigate(['cms/summary']);
                    }
                    else{ 
                        this.alertService.error(this.cmsAddResponse.message);
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
    Created : 20-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for change status of cms pages like active and Inactive
  */

    changeStatus(cms)
    {
        if(confirm("Are you sure you want to change status of the CMS")) {
            if(!(cms._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['cms/summary']);
            } 
            cms.status =  parseInt(cms.status) == 1 ? 0 : 1;
            this.cmsService.updateStatus(cms._id,cms.status).subscribe(data => {
                console.log(data);
                this.cmsAddResponse = data;
                if(this.cmsAddResponse.code == 200)
                    { 
                        this.alertService.success(this.cmsAddResponse.message,true);
                    }else{ 
                        this.alertService.error(this.cmsAddResponse.message);
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
      Function Type : filter price record
      Author : Pradeep Chaurasia
      Created On : 03-10-2018
    */
   searchedData(){
    console.log('all fields value of search form: '+this.cms.value.searchKey);
    this.setPage(1);
    this.sortDirection = 0;
    if(this.cms.value.searchKey){ 
        console.log('Before sort direction for sort: ' + this.sortDirection);
    
        this.cmsService.getAllBySearchKey(this.currentPage,this.SortField,this.sortDirection,this.cms.value.searchKey).subscribe(                  
        data => {
            this.cmsSummary = data;
            this.totalItems = this.cmsSummary.total;
            this.currentPage = parseInt(this.cmsSummary.current);
            this.perPage=this.cmsSummary.perPage;
            console.log(this.cmsSummary);
        },
        error => {
            this.alertService.error(error);
        }
        )
    }else{

            this.cmsService.getAll(this.currentPage,this.SortField,this.sortDirection).subscribe(                  
                data => {
                    this.cmsSummary = data;
                    this.totalItems = this.cmsSummary.total;
                    this.currentPage = parseInt(this.cmsSummary.current);
                    
                    console.log(this.cmsSummary);
                },
                error => {
                    this.alertService.error(error);
                }
                )


        }
    }

 }