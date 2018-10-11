import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,ProductService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';
import { appConfig } from '../../app.config';
import { Lightbox } from 'ngx-lightbox';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'ProductEdit.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }
  .img-pointer{
    cursor:pointer
  }
  `
]
})

export class ProductEditComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  productEdit : any = {};
  productAddResponse : any = {};
  message: string;
  product: FormGroup;
  productAddForm: FormGroup;
  id: number;
  productid:string;
  pageName:string;
  private sub: any;
  totalpage:any={};
  base64 : String;
  submitted = false;
  productImage : String;
  site_url = appConfig.apiUrl;
  _album = [];
      constructor(
        private router : Router,
        private alertService : AlertService,
        private productService : ProductService,       
        private validationService : ValidationService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private _lightbox : Lightbox
      ){}
      

    ngOnInit() {
      //get product edit record      
      this.productid=this.route.snapshot.paramMap.get('id');
        if(!(this.productid)){
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['product/summary']);
        }
      console.log('iiiiiiddddd '+this.productid);
      this.productService.getById(this.productid).subscribe(
        data => {
            this.productEdit = data;
            if(!(this.productEdit.result._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['product/summary']);
            }else{     
                
                this.product = this.fb.group({
                    "id":[this.productEdit.result._id],
                    "productName": [this.productEdit.result.productName, [Validators.required, Validators.minLength(2)]],
                    "description": [this.productEdit.result.description,[Validators.required,Validators.minLength(2)]],
                    "shippingRequired": [this.productEdit.result.shippingRequired,[Validators.required]],
                    "peerPointsRequired": [this.productEdit.result.peerPointsRequired,[Validators.required]],
                    "inventory": [this.productEdit.result.inventory,[Validators.required]],
                    "productImage" : [""],          
                    "status" : [this.productEdit.result.status]             
                });

                this.productImage = this.productEdit.result.productImage;
                if(this.productImage)
                {
                  const src = appConfig.apiUrl+'/product/'+this.productImage
                  const caption = this.productEdit.result.productName;
                  const thumb = appConfig.apiUrl+'/product/thumb/'+this.productImage
                  const album = {
                      src: src,
                      caption: caption,
                      thumb: thumb
                  };
                  this._album.push(album);   
                }
            }
        },
        error => {
            this.alertService.error(error);
        }        
      );    

     // Form validation
         this.product = this.fb.group({
            "productName": ['', [Validators.required, Validators.minLength(2)]],
            "description": ['',[Validators.required,Validators.minLength(2)]],
            "shippingRequired": ['',[Validators.required]],
            "peerPointsRequired": ['',[Validators.required]],
            "inventory": ['',[Validators.required]],
            "productImage" : [''],          
            "status" : ['1']          
      });
    }

    open(): void {
        // open lightbox
        this._lightbox.open(this._album,0);
    }
    
    close(): void {
    // close lightbox programmatically
    this._lightbox.close();
    }

    onFileSelected(event){
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();

          reader.onload = this.handleReaderLoaded.bind(this);
          reader.readAsBinaryString(file);
        }

      }
      handleReaderLoaded(e) {
        this.base64 = 'data:image/png;base64,'+btoa(e.target.result);
        console.log('base' + btoa(e.target.result));
      }

    /*
      Function :  Edit Product
      Author : Pradeep Chaurasia
      Created On : 17:09:2018
    */
      edit()
      {
          this.submitted = true;
          this.loading = true;
          
          if(this.product.invalid)
          {           
              return;

          }
          this.product.value.productImage = this.base64;
          console.log('all fields value: '+stringify(this.product.value));

          this.productService.update(this.product.value).subscribe(
            data => {
                this.productAddResponse = data;
                if(this.productAddResponse.code == 200)
                { 
                    this.alertService.success(this.productAddResponse.message,true);
                    this.loading = false;
                    this.router.navigate(['product/summary']);
                }
                else{ 
                    this.alertService.error(this.productAddResponse.message);
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
 