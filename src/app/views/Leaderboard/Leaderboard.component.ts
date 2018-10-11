import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,LeaderboardService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'Leaderboard.component.html',
  
})

export class LeaderboardComponent implements OnInit  {
  model: any = {};
  loading = false;
  leaderboard : FormGroup;
  userStatus : boolean = false;
  sortDirection : any={};
  SortField : any='point';
  SortFieldDir :any='0';
  search_key: any;
  private _album = [];
  private userDetails = [];
  is_get_data : boolean = false;

  leaderboardSummary : any = {};
 
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

    constructor(
      private router : Router,
      private alertService : AlertService,
      private leaderboardService : LeaderboardService,
      private route: ActivatedRoute,
      private fb : FormBuilder
    ){}

    ngOnInit() {
        // cal services
        this.loading = true;
        this.sortDirection = 0;
        this.setPage(1);
        this.leaderboardService.getAll(this.currentPage,this.SortField,this.SortFieldDir).subscribe( data => {
            this.leaderboardSummary = data;
            this.totalItems = this.leaderboardSummary.total;
            this.currentPage = this.leaderboardSummary.current;
            this.perPage=this.leaderboardSummary.perPage;
            this.loading = false;
            if(!this.leaderboardSummary.total)
            {
                this.is_get_data = true;
            }
        },
        error => {
            this.alertService.error(error);
            this.loading = false;
        })

        this.leaderboard = this.fb.group({
            "searchKey": ['', ]   
        });
    }

    setPage(pageNo: number): void {
        this.currentPage = pageNo;
    }
    pageChanged(event: any): void {
        this.sortDirection = 0;
        this.loading = true;
        
        if(this.leaderboard.value.searchKey){ 
              console.log('Before sort direction for sort: ' + this.sortDirection);
          
              this.leaderboardService.getAllBySearchKey(event.page,this.SortField,this.SortFieldDir,this.leaderboard.value.searchKey).subscribe(                  
              data => {
                  this.leaderboardSummary = data;
                  this.totalItems = this.leaderboardSummary.total;
                  this.currentPage = parseInt(this.leaderboardSummary.current);
                  this.perPage=this.leaderboardSummary.perPage;
                  console.log(this.leaderboardSummary);
                  this.loading = false;
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
              )
          }else{
              this.leaderboardService.getAll(event.page,this.SortField,this.SortFieldDir).subscribe(      
                  data => {
                      this.leaderboardSummary = data;
                      this.totalItems = this.leaderboardSummary.total;
                      this.currentPage = parseInt(this.leaderboardSummary.current);
                      this.perPage=this.leaderboardSummary.perPage;
                      console.log(this.leaderboardSummary);
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
        console.log('log '+fieldsName);

       if(this.leaderboard.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
            this.leaderboardService.getAllBySearchKey(this.currentPage,fieldsName,sortDirection,this.leaderboard.value.searchKey).subscribe(                  
            data => {
                this.leaderboardSummary = data;
                this.totalItems = this.leaderboardSummary.total;
                this.currentPage = parseInt(this.leaderboardSummary.current);
                this.perPage=this.leaderboardSummary.perPage;
                console.log(this.leaderboardSummary);
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
            )
        }else{
            this.leaderboardService.getAll(this.currentPage,fieldsName,sortDirection).subscribe(        
            data => {
                this.leaderboardSummary = data;
                this.totalItems = this.leaderboardSummary.total;
                this.currentPage = parseInt(this.leaderboardSummary.current);
                this.perPage=this.leaderboardSummary.perPage;
                console.log(this.leaderboardSummary);
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
        console.log('all fields value of search form: '+this.leaderboard.value.searchKey);
        this.setPage(1);
        this.sortDirection = 0;
        this.loading = true;
        if(this.leaderboard.value.searchKey){ 
            console.log('Before sort direction for sort: ' + this.sortDirection);
        
            this.leaderboardService.getAllBySearchKey(this.currentPage,this.SortField,this.sortDirection,this.leaderboard.value.searchKey).subscribe(                  
            data => {
                this.leaderboardSummary = data;
                this.totalItems = this.leaderboardSummary.total;
                this.currentPage = parseInt(this.leaderboardSummary.current);
                this.perPage=this.leaderboardSummary.perPage;
                console.log(this.leaderboardSummary);
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            })
        }else{

            this.leaderboardService.getAll(this.currentPage,this.SortField,this.sortDirection).subscribe(                  
                data => {
                    this.leaderboardSummary = data;
                    this.totalItems = this.leaderboardSummary.total;
                    this.currentPage = parseInt(this.leaderboardSummary.current);
                    
                    this.loading = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                })

        }
    }
}