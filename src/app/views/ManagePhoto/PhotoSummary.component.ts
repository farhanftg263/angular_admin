import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,PhotoService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';
import { appConfig } from '../../app.config';
import { Lightbox } from 'ngx-lightbox';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'PhotoSummary.component.html',
  
})

export class PhotoSummaryComponent implements OnInit  {
  model: any = {};
  loading = false;
  site_url = appConfig.apiUrl;

  userStatus : boolean = false;
  sortDirection : any={};
  SortField : any='_id';
  SortFieldDir :any='0';
  search_key: any;
  private _album = [];
  private userDetails = [];
  is_get_data : boolean = false;

  photoSummary : any = {};
 
  // Pagination Attribute
  totalItems: number = 64;
  currentPage: number   = 4;
  smallnumPages: number = 0;

  maxSize: number = 5;
  bigTotalItems: number = 675;
  bigCurrentPage: number = 1;
  numPages: number = 0;

  currentPager: number   = 4;
  perPage:any;
  /////////////////////////
  photo: FormGroup;

    constructor(
      private router : Router,
      private alertService : AlertService,
      private photoService : PhotoService,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private _lightbox : Lightbox

    ){}

    ngOnInit() {
        //call Api to get photo list
        this.setPage(1);
        this.sortDirection = 0;  
        this.loading = true;
        this.photoSummary = this.photoService.getAll(this.currentPage,this.SortField,this.SortFieldDir).subscribe(          
        data => {
            this.photoSummary = data;
            this.totalItems = this.photoSummary.total;
            this.currentPage = this.photoSummary.current;
            this.perPage=this.photoSummary.perPage;
            this.loading = false;
            if(this.photoSummary.result)
            {
                this.photoSummary.result.forEach(element => {
                    if(element.photo)
                    {
                        const src = appConfig.apiUrl+'/'+element.photo
                        const caption = element.user.username;
                        const thumb = appConfig.apiUrl+'/thumb/'+element.photo
                        const album = {
                            src: src,
                            caption: caption,
                            thumb: thumb
                        };

                        this.userDetails.push(element.user);
                        this._album.push(album);   
                    }
                });
                localStorage.setItem('photoUserDetails',JSON.stringify(this.userDetails));
            }
            else{
                this.is_get_data = true;
            }
            console.log(this.photoSummary.result);
        },
        error => {
            this.alertService.error(error);
            this.loading = false;
        }
      )
        this.photo = this.fb.group({
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
        this.loading = true;
        console.log('Page changed to: ' + event.page);
        console.log('Number items per page: ' + event.itemsPerPage);
        if(this.photo.value.searchKey){ 
              console.log('Before sort direction for sort: ' + this.sortDirection);
          
              this.photoService.getAllBySearchKey(event.page,this.SortField,this.SortFieldDir,this.photo.value.searchKey).subscribe(                  
              data => {
                  this.photoSummary = data;
                  this.totalItems = this.photoSummary.total;
                  this.currentPage = parseInt(this.photoSummary.current);
                  this.perPage=this.photoSummary.perPage;
                  console.log(this.photoService);
                  this.loading = false;
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
              )
          }else{
              this.photoService.getAll(event.page,this.SortField,this.SortFieldDir).subscribe(      
                  data => {
                      this.photoSummary = data;
                      this.totalItems = this.photoSummary.total;
                      this.currentPage = parseInt(this.photoSummary.current);
                      this.perPage=this.photoSummary.perPage;
                      console.log(this.photoSummary);
                      this.loading = false;
                  },
                  error => {
                      this.alertService.error(error);
                      this.loading = false;
                  }
              )
          }
      }
    
      /*
       Function Type : sortByFields
       Author : Farhan
       Created On : 09-10-2018
    */
    sortByFields(fieldsName:string,sortDirection:any): void {
        this.setPage(1);
        this.loading = true;
        console.log('Before sort direction for sort: ' + this.sortDirection);
        if(this.sortDirection==0){
            this.sortDirection=1;
        }else{
            this.sortDirection=0;
        }
        this.SortField=fieldsName;
        this.SortFieldDir=sortDirection;

       if(this.photo.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
            this.photoService.getAllBySearchKey(this.currentPage,fieldsName,sortDirection,this.photo.value.searchKey).subscribe(                  
            data => {
                this.photoSummary = data;
                this.totalItems = this.photoSummary.total;
                this.currentPage = parseInt(this.photoSummary.current);
                this.perPage=this.photoSummary.perPage;
                console.log(this.photoSummary);
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
            )
        }else{
            this.photoService.getAll(this.currentPage,fieldsName,sortDirection).subscribe(        
            data => {
                this.photoSummary = data;
                this.totalItems = this.photoSummary.total;
                this.currentPage = parseInt(this.photoSummary.current);
                this.perPage=this.photoSummary.perPage;
                console.log(this.photoSummary);
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
            )
        }
    }
    /*
      Function Type : filter photo record
      Author : Farhan
      Created On : 03-10-2018
    */
   searchedData(){
        console.log('all fields value of search form: '+this.photo.value.searchKey);
        this.setPage(1);
        this.sortDirection = 0;
        this.loading = true;
        if(this.photo.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.photoService.getAllBySearchKey(this.currentPage,this.SortField,this.sortDirection,this.photo.value.searchKey).subscribe(                  
            data => {
                this.photoSummary = data;
                this.totalItems = this.photoSummary.total;
                this.currentPage = parseInt(this.photoSummary.current);
                this.perPage=this.photoSummary.perPage;
                console.log(this.photoSummary);
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            })
        }else{

            this.photoService.getAll(this.currentPage,this.SortField,this.sortDirection).subscribe(                  
                data => {
                    this.photoSummary = data;
                    this.totalItems = this.photoSummary.total;
                    this.currentPage = parseInt(this.photoSummary.current);
                    
                    console.log(this.photoSummary);
                    this.loading = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                })

        }
    }
     /*
       Function Type : Change Status
       Author : Farhan
       Created On : 24-09-2018
    */
   changeStatus(photo)
   {
       if(confirm("Are you sure you want to change the status of this user")) {
        photo.status =  parseInt(photo.status) == 1 ? 0 : 1;
           this.photoService.status(photo._id,photo.status).subscribe(data => {
               var response : any = data;
               if(response.code == 200)
                   { 
                       console.log(response);
                       this.alertService.success(response.message,true);
                   }else{ 
                       this.alertService.error(response.message);
                       this.loading = false;
                   }
           },
           error => {             
               this.alertService.error(error);
               this.loading = false;
           })
       }
   }
    /*
      Function Type : Delete user records
      Author : Function
      Created On : 25-09-2018
    */
   delete(id:string){
        if(confirm("Are you sure you want to delete this user")) {
            console.log(id);

            if(!(id))
            {
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['photo/summary']);
            }
            // console.log('iiiiiiddddd '+this.cmsid); 
            this.photoService.delete(id).subscribe(
                data => {
                    var userDelete: any = data;
                    if(userDelete.code == 200)
                    { 
                        this.alertService.success(userDelete.message,true);
                        this.loading = false;
                        document.getElementById("delete_"+id).style.display = 'none';                      
                        this.router.navigate(['photo/summary']);
                    }
                    else{ 
                        this.alertService.error(userDelete.message);
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
 }