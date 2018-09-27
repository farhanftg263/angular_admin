import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,ManagePriceService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'ManagePriceEdit.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})

export class ManagePriceEditComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  managePriceEdit : any = {};
  managePriceAddResponse : any = {};
  message: string;
  managePrice: FormGroup;
  managePriceAddForm: FormGroup;
  id: number;
  managePriceid:string;  
  private sub: any;
  totalpage:any={};
  submitted = false;
      constructor(
        private router : Router,
        private alertService : AlertService,
        private managePriceService : ManagePriceService,       
        private validationService : ValidationService,
        private fb: FormBuilder,
        private route: ActivatedRoute
      ){}
      

    ngOnInit() {
      //get price list
      this.managePriceid=this.route.snapshot.paramMap.get('id');
        if(!(this.managePriceid)){
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['email-template/summary']);
        }
        console.log('iiiiiiddddd '+this.managePriceid);
         this.managePriceService.getById(this.managePriceid).subscribe(
          data => {
              this.managePriceEdit = data;
              if(!(this.managePriceEdit.result._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['email-template/summary']);
            }else{     
                
                this.managePrice = this.fb.group({
                    "id":[this.managePriceEdit.result._id],
                    "price": [this.managePriceEdit.result.price, [Validators.required, Validators.minLength(2)]],
                    "peerPoints": [this.managePriceEdit.result.peerPoints,[Validators.required,Validators.minLength(2)]],                    
                    "status" : [this.managePriceEdit.result.status]         
                });
            }
          },
          error => {
              this.alertService.error(error);
          }
        );

         // Form validation
         this.managePrice = this.fb.group({
          "price": ['', [Validators.required, Validators.minLength(1)]],
          "peerPoints": ['', [Validators.required, Validators.minLength(1)]],          
          "status" : ['1']         
      });
    }

    /*
      Function :  Edit Price
      Author : Pradeep Chaurasia
      Created On : 19:09:2018
    */
      edit()
      {
          this.submitted = true;
          this.loading = true;
          
          if(this.managePrice.invalid)
          {           
              return;

          }
          console.log(this.managePrice.value);

          this.managePriceService.update(this.managePrice.value).subscribe(    
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
 