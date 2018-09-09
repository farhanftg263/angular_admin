import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  model: any = {};
  loading = false;
  returnUrl : string;
   constructor(
     private router : Router
   ){}

   //Login 
   login()
   {
      console.log(this.model);
      
      this.loading = true;
      //localStorage.setItem('currentUser', JSON.stringify({'user':'sdsd'}));
      //this.router.navigate(['dashboard']);
   }
 }
