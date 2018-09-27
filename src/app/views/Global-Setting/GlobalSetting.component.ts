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
            this.globalSettingSummary = data;
            console.log('mmmmmmmmmmm'+this.globalSettingSummary.result[0]._id);
            console.log('photo purchase point:'+this.globalSettingSummary.result[0].createdDt);
            this.globalSetting = this.fb.group({
                "id":[this.globalSettingSummary.result[0]._id],
                "photoPurchasePoints": [this.globalSettingSummary.result[0].photoPurchasePoints, [Validators.required, Validators.minLength(1)]],
                "pointsRecievedPhoto": [this.globalSettingSummary.result[0].pointsRecievedPhoto,[Validators.required,Validators.minLength(1)]],
                "pointsRecievedShare" : [this.globalSettingSummary.result[0].pointsRecievedShare,[Validators.required, Validators.minLength(1)]],                    
                "pointsRecievedView" : [this.globalSettingSummary.result[0].pointsRecievedView,[Validators.required, Validators.minLength(1)]],
                "pointsRecievedSignup" : [this.globalSettingSummary.result[0].pointsRecievedSignup,[Validators.required, Validators.minLength(1)]],                  
            });
        },
        error => {
          console.log('pppppppppp');
          console.log(error);
            this.alertService.error(error);
        }
      )    

         // Form validation
         this.globalSetting = this.fb.group({
          "photoPurchasePoints": ['', [Validators.required, Validators.minLength(1)]],
          "pointsRecievedPhoto": ['', [Validators.required, Validators.minLength(1)]],
          "pointsRecievedShare": ['',[Validators.required,Validators.minLength(1)]],          
          "pointsRecievedView" : ['',[Validators.required,Validators.minLength(1)]], 
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
       console.log('all fields value: '+(this.globalSetting.value));

       this.globalSettingService.update(this.globalSetting.value).subscribe(    
         data => {
             this.globalSettingAddResponse = data;
             if(this.globalSettingAddResponse.code == 200)
             { 
                 this.alertService.success(this.globalSettingAddResponse.message,true);
                 this.loading = false;
                 this.router.navigate(['global_setting/summary']);
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

   numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

 }