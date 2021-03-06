import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,EmailTemplateService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'EmailTemplateSummary.component.html'
})

export class EmailTemplateSummaryComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  emailTemplateSummary : any = {};
  message: string;
  emailDelete : any = {};
  emailUpdate : any = {};
  emailAddResponse : any = {};
  id: number;
  emailid:string;
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
  search_key: any;
  perPage:any;
  emailTemplates: FormGroup;

  currentPager: number   = 4;
    constructor(
      private router : Router,
      private alertService : AlertService,
      private emailTemplateService : EmailTemplateService,
      private route: ActivatedRoute,     
      private fb: FormBuilder,

    ){}

    ngOnInit() {
      //get email template list
      this.setPage(1);
      this.sortDirection = 0;       
      this.emailTemplateService.getAll(this.currentPage,this.SortField,this.SortFieldDir).subscribe(
      
        data => {
          console.log('mmmmmmmmmmm');
            this.emailTemplateSummary = data;
            this.totalItems = this.emailTemplateSummary.total;
            this.currentPage = this.emailTemplateSummary.current;
            this.perPage=this.emailTemplateSummary.perPage;
            console.log(this.emailTemplateSummary);
        },
        error => {
          console.log('pppppppppp');
          console.log(error);
            this.alertService.error(error);
        }
      )
      this.emailTemplates = this.fb.group({
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
        if(this.emailTemplates.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.emailTemplateService.getAllBySearchKey(event.page,this.SortField,this.SortFieldDir,this.emailTemplates.value.searchKey).subscribe(                  
            data => {
                this.emailTemplateSummary = data;
                this.totalItems = this.emailTemplateSummary.total;
                this.currentPage = parseInt(this.emailTemplateSummary.current);
                this.perPage=this.emailTemplateSummary.perPage;
                console.log(this.emailTemplateSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{
            this.emailTemplateService.getAll(event.page,this.SortField,this.SortFieldDir).subscribe(        
                data => {
                    this.emailTemplateSummary = data;
                    this.totalItems = this.emailTemplateSummary.total;
                    this.currentPage = parseInt(this.emailTemplateSummary.current);
                    this.perPage=this.emailTemplateSummary.perPage;
                    console.log(this.emailTemplateSummary);
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
        if(this.emailTemplates.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.emailTemplateService.getAllBySearchKey(this.currentPage,fieldsName,sortDirection,this.emailTemplates.value.searchKey).subscribe(                  
            data => {
                this.emailTemplateSummary = data;
                this.totalItems = this.emailTemplateSummary.total;
                this.currentPage = parseInt(this.emailTemplateSummary.current);
                this.perPage=this.emailTemplateSummary.perPage;
                console.log(this.emailTemplateSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{
            this.emailTemplateService.getAll(this.currentPage,fieldsName,sortDirection).subscribe(        
                data => {
                    this.emailTemplateSummary = data;
                    this.totalItems = this.emailTemplateSummary.total;
                    this.currentPage = parseInt(this.emailTemplateSummary.current);
                    this.perPage=this.emailTemplateSummary.perPage;
                    console.log(this.emailTemplateSummary);
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
        Type: Public function for delete email template
    */

    delete(id:string){
        if(confirm("Are you sure you want to delete this record?")) {
        console.log('This is deleted id: '+id);
        //this.cmsid=this.route.snapshot.paramMap.get('id');
        this.emailid=id;
            if(!(this.emailid)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['email_template/summary']);
            }
        // console.log('iiiiiiddddd '+this.cmsid);
                this.emailTemplateService.delete(this.emailid).subscribe(
                    data => {
                        this.emailAddResponse = data;
                        if(this.emailAddResponse.code == 200)
                        { 
                            this.alertService.success(this.emailAddResponse.message,true);
                            this.loading = false;
                            document.getElementById("delete_"+this.emailid).style.display = 'none';                      
                            this.router.navigate(['email_template/summary']);
                        }
                        else{ 
                            this.alertService.error(this.emailAddResponse.message);
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
    Type: Public function for change status of email template like active and Inactive
    */

    changeStatus(emailtemp)
    {
        if(confirm("Are you sure you want to change the status of this email template")) {
            if(!(emailtemp._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['email_template/summary']);
            } 
            emailtemp.status =  parseInt(emailtemp.status) == 1 ? 0 : 1;
            this.emailTemplateService.updateStatus(emailtemp._id,emailtemp.status).subscribe(data => {
                console.log(data);
                this.emailAddResponse = data;
                if(this.emailAddResponse.code == 200)
                    { 
                        this.alertService.success(this.emailAddResponse.message,true);
                    }else{ 
                        this.alertService.error(this.emailAddResponse.message);
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
      Function Type : filter email template record
      Author : Pradeep Chaurasia
      Created On : 03-10-2018
    */
   searchedData(){
    console.log('all fields value of search form: '+this.emailTemplates.value.searchKey);
    this.setPage(1);
    this.sortDirection = 0;
    if(this.emailTemplates.value.searchKey){ 
        console.log('Before sort direction for sort: ' + this.sortDirection);
    
        this.emailTemplateService.getAllBySearchKey(this.currentPage,this.SortField,this.sortDirection,this.emailTemplates.value.searchKey).subscribe(                  
        data => {
            this.emailTemplateSummary = data;
            this.totalItems = this.emailTemplateSummary.total;
            this.currentPage = parseInt(this.emailTemplateSummary.current);
            this.perPage=this.emailTemplateSummary.perPage;
            console.log(this.emailTemplateSummary);
        },
        error => {
            this.alertService.error(error);
        }
        )
    }else{

            this.emailTemplateService.getAll(this.currentPage,this.SortField,this.sortDirection).subscribe(                  
                data => {
                    this.emailTemplateSummary = data;
                    this.totalItems = this.emailTemplateSummary.total;
                    this.currentPage = parseInt(this.emailTemplateSummary.current);
                    this.perPage=this.emailTemplateSummary.perPage;
                    console.log(this.emailTemplateSummary);
                },
                error => {
                    this.alertService.error(error);
                }
                )


        }
    }


 }