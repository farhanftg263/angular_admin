import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,CmsService} from '../../_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'CmsSummary.component.html'
})

export class CmsSummaryComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  cmsSummary : any = {};
  message: string;
    constructor(
      private router : Router,
      private alertService : AlertService,
      private cmsService : CmsService,

    ){}

    ngOnInit() {
      //get cms list
      
      this.cmsService.getAll().subscribe(
        data => {
            this.cmsSummary = data;
            console.log(this.cmsSummary);
        },
        error => {
            this.alertService.error(error);
        }
      )
     
    }
 }