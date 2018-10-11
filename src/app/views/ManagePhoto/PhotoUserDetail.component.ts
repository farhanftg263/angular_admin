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
  templateUrl: 'PhotoUserDetail.component.html',
  
})

export class PhotoUserDetailComponent implements OnInit  {
  model: any = {};
  loading = false;
  site_url = appConfig.apiUrl;
  private _album = [];


  photoUserDetails : any = {};
 

    constructor(
      private router : Router,
      private alertService : AlertService,
      private route: ActivatedRoute,
    ){}

    ngOnInit() {
        var index = this.route.snapshot.paramMap.get('id');
        if(index)
        {
            this.photoUserDetails = JSON.parse(localStorage.getItem('photoUserDetails'))[index];
            console.log(this.photoUserDetails);
        }
    }
}