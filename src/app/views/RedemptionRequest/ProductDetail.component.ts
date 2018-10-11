import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,ProductService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { appConfig } from '../../app.config';
import { stringify } from 'querystring';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'ProductDetail.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})
export class ProductDetailComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl : string;
    productDetail:any={};
    message: string;   
    product_id : string;
    submitted = false;
    status:string;
    site_url = appConfig.apiUrl;    
    private _album = [];
      constructor(
        private router : Router,
        private route : ActivatedRoute,
        private alertService : AlertService,
        private productService : ProductService, 
        private _lightbox : Lightbox
      ){}
    ngOnInit() {           

        this.product_id = this.route.snapshot.paramMap.get('id');
        if(!(this.product_id))
        {
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['redemption_request/summary']);
        }

        // Get user by id
        this.productService.getById(this.product_id).subscribe(
            data => {
                this.productDetail = data;                
                console.log('product details: '+this.productDetail);
                if(this.productDetail.code == 200)
                {
                    // Form validation
                    let result : any = this.productDetail.result;
                    
                    
                    if(this.productDetail.result)
                    {
                        this.productDetail.result.forEach(element => {
                            if(element.productImage)
                            {
                                const src = appConfig.apiUrl+'/product/'+element.productImage
                                const caption = element.productName;
                                const thumb = appConfig.apiUrl+'/product/thumb/'+element.productImage
                                const album = {
                                    src: src,
                                    caption: caption,
                                    thumb: thumb
                                };
                                this._album.push(album);   
                            }
                        });
                    }

                }
                else{
                    this.alertService.error(this.productDetail.message,true);
                    this.router.navigate['redemption_request/summary']
                }
            },
            error => {
                this.alertService.error(error);
            }        
        );
        
    }

    open(index: number): void {
        // open lightbox
        this._lightbox.open(this._album,index);
    }
    
    close(): void {
    // close lightbox programmatically
    this._lightbox.close();
    }

}