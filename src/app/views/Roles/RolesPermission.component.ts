import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService,RolesService,ValidationService} from '../../_services';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'RolesPermission.component.html',
  styles: [` 
  .invalid-feedback{
    display: block;
  }`
]
})

export class RolesPermissionComponent implements OnInit  {
  model: any = {};
  loading = false;
  returnUrl : string;
  rolesPermission : any = {};
  rolesPermissionResponse : any = {};
  message: string;
  roles: FormGroup;
  rolesPermissionForm: FormGroup;
  id: number;
  rolesid:string;
  pageName:string;
  private sub: any;
  totalpage:any={};
  submitted = false;
  validRolename=false;
  rolename:any;
  privelege_value:any;
  checkedUsers=false;
  checkedDashboard=false;
  checkedRoles=false;
  checkedAppUsers=false;
  checkedCMS=false;
  checkedGlobal=false;
  checkedPrice=false;
  checkedEmailTemp=false;
  checkedProduct=false;
  checkedRedemption=false;
  checkedPhoto = false;
  checkedContact = false;
  checkedFeedback = false;
  checkedStats=false;
  checkedRevenue=false;
  checkedRegistration=false;
  checkedLeaderboard=false;

      constructor(
        private router : Router,
        private alertService : AlertService,
        private rolesService : RolesService,       
        private validationService : ValidationService,
        private fb: FormBuilder,
        private route: ActivatedRoute
      ){}
      

    ngOnInit() {
      //get roles edit record      
      this.rolesid=this.route.snapshot.paramMap.get('id');
        if(!(this.rolesid)){
            this.alertService.error('No record exists with given parameters provided',true);
            this.loading = false;
            this.router.navigate(['roles/summary']);
        }
      console.log('iiiiiiddddd '+this.rolesid);
      this.rolesService.getById(this.rolesid).subscribe(
        data => {
            this.rolesPermission = data;
            if(!(this.rolesPermission.result._id)){
                this.alertService.error('No record exists with given parameters provided',true);
                this.loading = false;
                this.router.navigate(['roles/summary']);
            }else{
                this.rolename=this.rolesPermission.result.roleName;
                this.privelege_value=this.rolesPermission.result.privilege;
                console.log('privilege value found: '+ this.privelege_value);
                //var array = JSON.parse("[" + this.privelege_value + "]");
                var privilege_array=  this.privelege_value.split(",");
               // this.checkedUsers=true;
                if(privilege_array.indexOf('1')>=0){
                    this.checkedDashboard=true;
                }
                if(privilege_array.indexOf('2')>=0){
                    this.checkedUsers=true;
                }
                if(privilege_array.indexOf('3')>=0){
                    this.checkedRoles=true;
                }
                if(privilege_array.indexOf('4')>=0){
                    this.checkedAppUsers=true;
                }
                if(privilege_array.indexOf('5')>=0){
                    this.checkedCMS=true;
                }
                if(privilege_array.indexOf('6')>=0){
                    this.checkedGlobal=true;
                }
                if(privilege_array.indexOf('7')>=0){
                    this.checkedPrice=true;
                }
                if(privilege_array.indexOf('8')>=0){
                    this.checkedEmailTemp=true;
                }
                if(privilege_array.indexOf('9')>=0){
                    this.checkedProduct=true;
                }
                if(privilege_array.indexOf('10')>=0){
                    this.checkedRedemption=true;
                }
                if(privilege_array.indexOf('11')>=0){
                    this.checkedPhoto=true;
                }
                if(privilege_array.indexOf('12')>=0){
                    this.checkedContact=true;
                }
                if(privilege_array.indexOf('13')>=0){
                    this.checkedFeedback=true;
                }
                if(privilege_array.indexOf('14')>=0){
                    this.checkedStats=true;
                }
                if(privilege_array.indexOf('15')>=0){
                    this.checkedRevenue=true;
                }
                if(privilege_array.indexOf('16')>=0){
                    this.checkedRegistration=true;
                }
                if(privilege_array.indexOf('17')>=0){
                    this.checkedLeaderboard=true;
                }
                
                console.log('rolename found: '+this.rolename);
                this.roles = this.fb.group({
                    "id":[this.rolesPermission.result._id],
                    "privilege_dashboard": [this.checkedDashboard],
                    "privilege_users": [this.checkedUsers],
                    "privilege_roles": [this.checkedRoles],
                    "privilege_app_users":[this.checkedAppUsers],
                    "privilege_cms":[this.checkedCMS],
                    "privilege_global":[this.checkedGlobal],
                    "privilege_price":[this.checkedPrice],
                    "privilege_emailtemp":[this.checkedEmailTemp],
                    "privilege_product":[this.checkedProduct],
                    "privilege_redemption":[this.checkedRedemption],
                    "privilege_photo":[this.checkedPhoto],
                    "privilege_contact":[this.checkedContact],
                    "privilege_feedback":[this.checkedFeedback],
                    "privilege_stats":[this.checkedStats],
                    "privilege_revenue":[this.checkedRevenue],
                    "privilege_registration":[this.checkedRegistration],
                    "privilege_leaderboard":[this.checkedLeaderboard],

                    //"privilege[]": [this.rolesPermission.result.privilege]
                    
                });
            }
        },
        error => {
            this.alertService.error(error);
        }        
      );    

    
      // Form validation
      this.roles = this.fb.group({           
            "privilege_dashboard": [''],
            "privilege_users": [''],
            "privilege_roles": [''],
            "privilege_app_users":[''],
            "privilege_cms":[''],
            "privilege_global":[''],
            "privilege_price":[''],
            "privilege_emailtemp":[''],
            "privilege_product":[''],
            "privilege_redemption":[''],
            "privilege_photo":[''],
            "privilege_contact":[''],
            "privilege_feedback":[''],
            "privilege_stats":[''],
            "privilege_revenue":[''],
            "privilege_registration":[''],
            "privilege_leaderboard":['']

        });
    }

    /*
      Function :  Edit Role Permission
      Author : Pradeep Chaurasia
      Created On : 27:09:2018
    */
      edit()
      {
          this.submitted = true;
          this.loading = true;
          var privilege_arr=new Array();
          if(this.roles.invalid)
          {  this.validRolename=true;       
              return;

          }
          this.validRolename=false;   
          console.log('all fields value: '+stringify(this.roles.value));
          if(this.roles.value.privilege_dashboard){
            privilege_arr.push(1);
          }
          if(this.roles.value.privilege_users){
            privilege_arr.push(2);
          }
          if(this.roles.value.privilege_roles){
            privilege_arr.push(3);
          }
          if(this.roles.value.privilege_app_users){
            privilege_arr.push(4);
          }
          if(this.roles.value.privilege_cms){
            privilege_arr.push(5);
          }
          if(this.roles.value.privilege_global){
            privilege_arr.push(6);
          }
          if(this.roles.value.privilege_price){
            privilege_arr.push(7);
          }
          if(this.roles.value.privilege_emailtemp){
            privilege_arr.push(8);
          }
          if(this.roles.value.privilege_product){
            privilege_arr.push(9);
          }
          if(this.roles.value.privilege_redemption){
            privilege_arr.push(10);
          }
          if(this.roles.value.privilege_photo){
            privilege_arr.push(11);
          }
          if(this.roles.value.privilege_contact){
            privilege_arr.push(12);
          }
          if(this.roles.value.privilege_feedback){
            privilege_arr.push(13);
          }
          if(this.roles.value.privilege_stats){
            privilege_arr.push(14);
          }
          if(this.roles.value.privilege_revenue){
            privilege_arr.push(15);
          }
          if(this.roles.value.privilege_registration){
            privilege_arr.push(16);
          }
          if(this.roles.value.privilege_leaderboard){
            privilege_arr.push(17);
          }
          var privilege_value=privilege_arr.join();
          console.log('all fields privilege_arr: '+privilege_arr.join());
          console.log('posted value: '+this.roles.value.privilege_dashboard);
          
          this.rolesService.updatePermission(this.roles.value.id,privilege_value).subscribe(
            data => {
                this.rolesPermissionResponse = data;
                if(this.rolesPermissionResponse.code == 200)
                { 
                    this.alertService.success(this.rolesPermissionResponse.message,true);
                    this.loading = false;
                    this.router.navigate(['roles/summary']);
                }
                else{                
                this.alertService.error(this.rolesPermissionResponse.message);
                    this.loading = false;
                }
            },
            error => { 
                console.log(error);
                this.alertService.error(error);
                this.loading = false;
            })
      }
     
    }
 