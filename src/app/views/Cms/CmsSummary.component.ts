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
      this.cmsService.getById(this.cmsid).subscribe(
        data => {
            this.cmsDelete = data;
            console.log('==== '+this.cmsDelete.result._id);
            if(!(this.cmsDelete.result._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                console.log('This is deleted id3: '+this.cmsDelete.result._id);
                this.router.navigate(['cms/summary']);
            }else{ 
                this.cmsService.delete(this.cmsDelete.result._id).subscribe(
                    data => {
                        this.cmsAddResponse = data;
                        if(this.cmsAddResponse.code == 200)
                        { 
                            this.alertService.success(this.cmsAddResponse.message,true);
                            this.loading = false;
                            document.getElementById("delete_"+this.cmsDelete.result._id).style.display = 'none';                      
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
        },
        error => {
            this.alertService.error(error);
        }

        
      );
      }
    }

  /*
    Function Name : status
    Author  : Pradeep Chaurasia
    Created : 20-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for change status of cms pages like active and Inactive
  */

    status(id:string,status:string){
      console.log('This is id: '+id);
      console.log('This is status: '+status);        
      this.cmsid=id;
        if(!(this.cmsid)){
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['cms/summary']);
        }     
      this.cmsService.getById(this.cmsid).subscribe(
        data => {
            this.cmsUpdate = data;
            console.log(this.cmsUpdate.result);
            if(!(this.cmsUpdate.result._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['cms/summary']);
            }else{ 
                this.cmsService.updateStatus(this.cmsUpdate.result._id,status).subscribe(
                    data => {
                        this.cmsAddResponse = data;
                        if(this.cmsAddResponse.code == 200)
                        { 
                            this.alertService.success(this.cmsAddResponse.message,true);
                            this.loading = false;
                            if(status=='0'){
                              //document.getElementById("active_status_"+this.cmsUpdate.result._id).style.display ='none';
                              //document.getElementById("inactive_status_"+this.cmsUpdate.result._id).style.display ='block';                          

                              document.getElementById("active_status_"+this.cmsUpdate.result._id).classList.remove('fa-check');
                              document.getElementById("active_status_"+this.cmsUpdate.result._id).classList.add('fa-close');                                            
                            }else if(status=='1'){
                              document.getElementById("inactive_status_"+this.cmsUpdate.result._id).classList.remove('fa-close');
                              document.getElementById("inactive_status_"+this.cmsUpdate.result._id).classList.add('fa-check');                                            
                            }
                           
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
        },
        error => {
            this.alertService.error(error);
        }

        
      );

    }
 }