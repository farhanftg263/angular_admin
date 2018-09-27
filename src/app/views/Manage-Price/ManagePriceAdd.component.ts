import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,ManagePriceService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'ManagePriceAdd.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})

export class ManagePriceAddComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  managePriceAdd : any = {};
  managePriceAddResponse : any = {};
  message: string;
  managePrice: FormGroup;
  managePriceAddForm: FormGroup;
  submitted = false;
      constructor(
        private router : Router,
        private alertService : AlertService,
        private managePriceService : ManagePriceService,       
        private validationService : ValidationService,
        private fb: FormBuilder
      ){}

    ngOnInit() {
      //get price list
     
         // Form validation
         this.managePrice = this.fb.group({
          "price": ['', [Validators.required, Validators.minLength(1)]],
          "peerPoints": ['', [Validators.required, Validators.minLength(1)]],                   
          "status" : ['1']         
      });
    }

    /*
      Function :  Add price
      Author : Pradeep Chaurasia
      Created On : 24:09:2018
    */
      add()
      {
          this.submitted = true;
          this.loading = true;
          
          if(this.managePrice.invalid)
          {           
              return;

          }
          console.log(this.managePrice.value);
          //alert("Success name"+this.cms.value.pageName+' meta title: '+this.cms.value.metaTitle+' meta content: '+this.cms.value.metaDescription+' status: '+this.cms.value.status);

          this.managePriceService.create(this.managePrice.value).subscribe(
            data => {
                this.managePriceAddResponse = data;
                if(this.managePriceAddResponse.code == 200)
                { 
                    this.alertService.success(this.managePriceAddResponse.message,true);
                    this.loading = false;
                    this.router.navigate(['manage_price/summary']);
                }
                else{ 
                    this.alertService.error(this.managePriceAddResponse.message);
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
 