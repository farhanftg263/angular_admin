import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,AppUserService,ValidationService,RolesService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'AppUserDetail.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})
export class AppUserDetailComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl : string;
    roleList : any = {};
    userEditResponse : any = {};
    userDetail:any={};
    message: string;
    user: FormGroup;
    user_id : string;
    submitted = false;
    status:string;
      constructor(
        private router : Router,
        private route : ActivatedRoute,
        private alertService : AlertService,
        private userService : AppUserService,
        private roleService : RolesService,
        private fb: FormBuilder,
      ){}
    ngOnInit() {           

        this.user_id = this.route.snapshot.paramMap.get('id');
        if(!(this.user_id))
        {
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['app_user/summary']);
        }

        // Get user by id
        this.userService.getById(this.user_id).subscribe(
            data => {
                this.userDetail = data;
                if(this.userDetail.result.userStatus==1){
                    this.status="Active"
                }else{
                    this.status="Inactive"
                }
                console.log(this.userDetail);
                if(this.userDetail.code == 200)
                {
                    // Form validation
                    let result : any = this.userDetail.result;
                    console.log(result.userStatus);
                   
                }
                else{
                    this.alertService.error(this.userDetail.message,true);
                    this.router.navigate['app_user/summary']
                }
            },
            error => {
                this.alertService.error(error);
            }        
          );
       
        
    }

}