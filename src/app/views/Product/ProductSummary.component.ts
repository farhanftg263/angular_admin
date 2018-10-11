import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { appConfig } from '../../app.config';
import 'rxjs/add/operator/map';
import { AlertService,ProductService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';
import { Lightbox } from 'ngx-lightbox';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'ProductSummary.component.html',
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

export class ProductSummaryComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  productSummary : any = {};
  message: string;
  productDelete : any = {};
  productUpdate : any = {};
  productAddResponse : any = {};
  id: number;
  productid:string;
  submitted = false;
  site_url = appConfig.apiUrl;
  private _album = [];
  
  totalItems: number = 64;
  currentPage: number   = 4;
  smallnumPages: number = 0;

  maxSize: number = 5;
  bigTotalItems: number = 675;
  bigCurrentPage: number = 1;
  numPages: number = 0;
  currentPager: number   = 4;

  sortDirection : any={};
  SortField : any='_id';
  SortFieldDir :any='0';
  perPage:any;
  products: FormGroup;
    constructor(
      private router : Router,
      private alertService : AlertService,
      private productService : ProductService,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private _lightbox : Lightbox

    ){}

    ngOnInit() {
      //get product list
      this.setPage(1);
      this.sortDirection = 0;       
      this.productService.getAll(this.currentPage,this.SortField,this.SortFieldDir).subscribe(      
        data => {
            this.productSummary = data;
            this.totalItems = this.productSummary.total;
            this.currentPage = this.productSummary.current;
            this.perPage=this.productSummary.perPage;

            if(this.productSummary.result)
            {
                this.productSummary.result.forEach(element => {
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
            console.log(this.productSummary);
        },
        error => {
            this.alertService.error(error);
        }
      )
      this.products = this.fb.group({
        "searchKey": ['', ]   
    });
     
    }

    open(index: number): void {
        // open lightbox
        this._lightbox.open(this._album,index);
    }
    
    close(): void {
    // close lightbox programmatically
    this._lightbox.close();
    }

    setPage(pageNo: number): void {
        this.currentPage = pageNo;
      }
    
    pageChanged(event: any): void {
        this.sortDirection = 0;
        console.log('Page changed to: ' + event.page);
        console.log('Number items per page: ' + event.itemsPerPage);

        if(this.products.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.productService.getAllBySearchKey(event.page,this.SortField,this.SortFieldDir,this.products.value.searchKey).subscribe(                  
            data => {
                this.productSummary = data;
                this.totalItems = this.productSummary.total;
                this.currentPage = parseInt(this.productSummary.current);
                this.perPage=this.productSummary.perPage;
                console.log(this.productSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{

        this.productService.getAll(event.page,this.SortField,this.SortFieldDir).subscribe(                
          data => {
            console.log(this.productSummary);
              this.productSummary = data;
              this.totalItems = this.productSummary.total;
              this.currentPage = parseInt(this.productSummary.current);
              this.perPage=this.productSummary.perPage;
              console.log(this.productSummary);
          },
          error => {
              this.alertService.error(error);
          }
        )
      }
    }
    
    sortByFields(fieldsName:string,sortDirection:any): void {
        this.setPage(1);
        console.log('Before sort direction for sort: ' + this.sortDirection);
        if(this.sortDirection==0){
            this.sortDirection=1;
        }else{
            this.sortDirection=0;
        }
       this.SortField=fieldsName;
       this.SortFieldDir=sortDirection;
       if(this.products.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.productService.getAllBySearchKey(this.currentPage,fieldsName,sortDirection,this.products.value.searchKey).subscribe(                  
            data => {
                this.productSummary = data;
                this.totalItems = this.productSummary.total;
                this.currentPage = parseInt(this.productSummary.current);
                this.perPage=this.productSummary.perPage;
                console.log(this.productSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }else{
       
            this.productService.getAll(this.currentPage,fieldsName,sortDirection).subscribe(        
            data => {
                this.productSummary = data;
                this.totalItems = this.productSummary.total;
                this.currentPage = parseInt(this.productSummary.current);
                this.perPage=this.productSummary.perPage;
                console.log(this.productSummary);
            },
            error => {
                this.alertService.error(error);
            }
            )
        }
    }

  /*
    Function Name : delete 
    Author  : Pradeep Chaurasia
    Created : 20-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for delete product
  */

    delete(id:string){
        if(confirm("Are you sure you want to delete the product")) {
        console.log('This is deleted id: '+id);
        //this.productid=this.route.snapshot.paramMap.get('id');
        this.productid=id;
            if(!(this.productid)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                console.log('This is deleted id2: '+this.productid);
                this.router.navigate(['product/summary']);
            }
            // console.log('iiiiiiddddd '+this.productid); 
            this.productService.delete(this.productid).subscribe(
                data => {
                    this.productAddResponse = data;
                    if(this.productAddResponse.code == 200)
                    { 
                        this.alertService.success(this.productAddResponse.message,true);
                        this.loading = false;
                        document.getElementById("delete_"+this.productid).style.display = 'none';                      
                        this.router.navigate(['product/summary']);
                    }
                    else{ 
                        this.alertService.error(this.productAddResponse.message);
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
    Type: Public function for change status of product like active and Inactive
  */

    changeStatus(product)
    {
        if(confirm("Are you sure you want to change status of the product")) {
            if(!(product._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['product/summary']);
            } 
            product.status =  parseInt(product.status) == 1 ? 0 : 1;
            this.productService.updateStatus(product._id,product.status).subscribe(data => {
                console.log(data);
                this.productAddResponse = data;
                if(this.productAddResponse.code == 200)
                    { 
                        this.alertService.success(this.productAddResponse.message,true);
                    }else{ 
                        this.alertService.error(this.productAddResponse.message);
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

     /*
      Function Type : filter product record
      Author : Pradeep Chaurasia
      Created On : 04-10-2018
    */
   searchedData(){
    console.log('all fields value of search form: '+this.products.value.searchKey);
    this.setPage(1);
    this.sortDirection = 0;
    if(this.products.value.searchKey){ 
        console.log('Before sort direction for sort: ' + this.sortDirection);
    
        this.productService.getAllBySearchKey(this.currentPage,this.SortField,this.sortDirection,this.products.value.searchKey).subscribe(                  
        data => {
            this.productSummary = data;
            this.totalItems = this.productSummary.total;
            this.currentPage = parseInt(this.productSummary.current);
            this.perPage=this.productSummary.perPage;
            console.log(this.productSummary);
        },
        error => {
            this.alertService.error(error);
        }
        )
    }else{

            this.productService.getAll(this.currentPage,this.SortField,this.sortDirection).subscribe(                  
                data => {
                    this.productSummary = data;
                    this.totalItems = this.productSummary.total;
                    this.currentPage = parseInt(this.productSummary.current);
                    this.perPage=this.productSummary.perPage;
                    console.log(this.productSummary);
                },
                error => {
                    this.alertService.error(error);
                }
                )


        }
    }
 }