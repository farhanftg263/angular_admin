import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,GlobalSettingService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'GlobalSetting.component.html',
  styles: [` 
        .invalid-feedback{
            display: block;
        }`
    ]
})

export class GlobalSettingComponent implements OnInit  {
    model: any = {};
    loading = false;
    returnUrl : string;
    globalSettingEdit : any = {};
    globalSettingSummary : any={};
    globalSettingAddResponse : any = {};
    message: string;
    globalSetting: FormGroup;
    globalSettingAddForm: FormGroup;
    id: number;
    globalSettingid:string;    
    private sub: any;    
    submitted = false;
        constructor(
          private router : Router,
          private alertService : AlertService,
          private globalSettingService : GlobalSettingService,       
          private validationService : ValidationService,
          private fb: FormBuilder,
          private route: ActivatedRoute
        ){}

    ngOnInit() {
      //get global setting records
      //this.globalSettingid=this.route.snapshot.paramMap.get('id');
      this.globalSettingService.getAll().subscribe(
        data => {
          console.log('mmmmmmmmmmm');
            this.globalSettingSummary = data;
            console.log(this.globalSettingSummary);
        },
        error => {
          console.log('pppppppppp');
          console.log(error);
            this.alertService.error(error);
        }
      ) 
    /*  console.log('ppppppp111: '+this.globalSettingSummary.result);

        if(!(this.globalSettingid)){
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['global_setting']);
        }
        console.log('iiiiiiddddd '+this.globalSettingid);
         this.globalSettingService.getById(this.globalSettingid).subscribe(
          data => {
              this.globalSettingEdit = data;
              if(!(this.globalSettingEdit.result._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['global_setting']);
            }else{     
                
                this.globalSetting = this.fb.group({
                    "id":[this.globalSettingEdit.result._id],
                    "photoPurchasePoints": [this.globalSettingEdit.result.photoPurchasePoints, [Validators.required, Validators.minLength(1)]],
                    "pointsRecievedPhoto": [this.globalSettingEdit.result.pointsRecievedPhoto,[Validators.required,Validators.minLength(1)]],
                    "pointsRecievedShare" : [this.globalSettingEdit.result.pointsRecievedShare,[Validators.required, Validators.minLength(1)]],                    
                    "pointsRecievedView" : [this.globalSettingEdit.result.pointsRecievedView,[Validators.required, Validators.minLength(1)]],
                    "pointsRecievedSignup" : [this.globalSettingEdit.result.pointsRecievedSignup,[Validators.required, Validators.minLength(1)]],                  
                });
            }
          },
          error => {
              this.alertService.error(error);
          }
         ); */

         // Form validation
         this.globalSetting = this.fb.group({
          "photoPurchasePoints": ['', [Validators.required, Validators.minLength(1)]],
          "pointsRecievedPhoto": ['', [Validators.required, Validators.minLength(1)]],
          "pointsRecievedShare": ['',[Validators.required,Validators.minLength(1)]],          
          "pointsRecievedView" : ['1',[Validators.required,Validators.minLength(1)]], 
          "pointsRecievedSignup": ['',[Validators.required,Validators.minLength(1)]],                   
      });
     
    }

      /*
      Function :  Update Global Setting
      Author : Pradeep Chaurasia
      Created On : 21:09:2018
    */
   update()
   {
       this.submitted = true;
       this.loading = true;
       
       if(this.globalSetting.invalid)
       {           
           return;

       }
       console.log(this.globalSetting.value);

       this.globalSettingService.update(this.globalSetting.value).subscribe(    
         data => {
             this.globalSettingAddResponse = data;
             if(this.globalSettingAddResponse.code == 200)
             { 
                 this.alertService.success(this.globalSettingAddResponse.message,true);
                 this.loading = false;
                 this.router.navigate(['global_setting']);
             }
             else{ 
                 this.alertService.error(this.globalSettingAddResponse.message);
                 this.loading = false;
             }
         },
         error => { 
             console.log(error);
             this.alertService.error(error);
             this.loading = false;
         })
   }

 }