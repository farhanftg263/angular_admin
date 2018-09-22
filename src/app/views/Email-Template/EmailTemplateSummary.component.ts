import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,EmailTemplateService} from '../../_services';

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
    constructor(
      private router : Router,
      private alertService : AlertService,
      private emailTemplateService : EmailTemplateService,

    ){}

    ngOnInit() {
      //get cms list
      
      this.emailTemplateService.getAll().subscribe(
        data => {
          console.log('mmmmmmmmmmm');
            this.emailTemplateSummary = data;
            console.log(this.emailTemplateSummary);
        },
        error => {
          console.log('pppppppppp');
          console.log(error);
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
  this.emailTemplateService.getById(this.emailid).subscribe(
    data => {
        this.emailDelete = data;
        console.log(this.emailDelete.result);
        if(!(this.emailDelete.result._id)){
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['email_template/summary']);
        }else{ 
            this.emailTemplateService.delete(this.emailDelete.result._id).subscribe(
                data => {
                    this.emailAddResponse = data;
                    if(this.emailAddResponse.code == 200)
                    { 
                        this.alertService.success(this.emailAddResponse.message,true);
                        this.loading = false;
                        document.getElementById("delete_"+this.emailDelete.result._id).style.display = 'none';                      
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
  this.emailid=id;
    if(!(this.emailid)){
        this.alertService.error('No record exists with given parameters provided',true);
        this.loading = false;
        this.router.navigate(['email_template/summary']);
    }     
  this.emailTemplateService.getById(this.emailid).subscribe(
    data => {
        this.emailUpdate = data;
        console.log(this.emailUpdate.result);
        if(!(this.emailUpdate.result._id)){
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['email_template/summary']);
        }else{ 
            this.emailTemplateService.updateStatus(this.emailUpdate.result._id,status).subscribe(
                data => {
                    this.emailAddResponse = data;
                    if(this.emailAddResponse.code == 200)
                    { 
                        this.alertService.success(this.emailAddResponse.message,true);
                        this.loading = false;
                        if(status=='0'){
                          //document.getElementById("active_status_"+this.cmsUpdate.result._id).style.display ='none';
                          //document.getElementById("inactive_status_"+this.cmsUpdate.result._id).style.display ='block';                          

                          document.getElementById("active_status_"+this.emailUpdate.result._id).classList.remove('fa-check');
                          document.getElementById("active_status_"+this.emailUpdate.result._id).classList.add('fa-close');                                            
                        }else if(status=='1'){
                          document.getElementById("inactive_status_"+this.emailUpdate.result._id).classList.remove('fa-close');
                          document.getElementById("inactive_status_"+this.emailUpdate.result._id).classList.add('fa-check');                                            
                        }
                       
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
    },
    error => {
        this.alertService.error(error);
    }

    
  );

}


 }