import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,ProductService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'ProductAdd.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})

export class ProductAddComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  productAdd : any = {};
  productAddResponse : any = {};
  message: string;
  product: FormGroup;
  productAddForm: FormGroup;
  submitted = false;
  selectedFile :File=null;
  base64 : String;

 
  constructor(
        private router : Router,
        private alertService : AlertService,
        private productService : ProductService,       
        private validationService : ValidationService,
        private fb: FormBuilder,
       
      ){}

      
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
      
     
    ngOnInit() {
      //get product list    
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
      this.product['productImage']=this.selectedFile;
    }
    
    /*
      Function :  Add Product
      Author : Pradeep Chaurasia
      Created On : 26:09:2018
    */
      add()
      {
          this.submitted = true;
          this.loading = true;
          //var formData = new FormData();
          //formData.append('userpic', this.selectedFile, this.selectedFile.name);
          console.log('selected files: '+JSON.stringify(this.selectedFile));
         console.log('form post value: '+JSON.stringify(this.product.value)); 
         //console.log('form data upload files: '+JSON.stringify(formData));
         
          if(this.product.invalid)
          {           
              return;

          }
          
          this.product.value.productImage = this.base64;
          console.log('Form submited fields: '+this.product);
          this.productService.create(this.product.value).subscribe(
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
 