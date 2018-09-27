import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,CmsService} from '../../_services';

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
      private cmsService : CmsService,
      private route: ActivatedRoute

    ){}

    ngOnInit() {
      //get cms list
      this.setPage(1);
      this.cmsService.getAll(this.currentPage).subscribe(
        data => {
            this.cmsSummary = data;
            this.totalItems = this.cmsSummary.total;
            this.currentPage = this.cmsSummary.current;
            console.log(this.cmsSummary);
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
        this.cmsService.getAll(event.page).subscribe(
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
 }