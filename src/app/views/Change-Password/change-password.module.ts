import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { ChangePasswordComponent } from './ChangePassword.component';
import { ChangePasswordRoutingModule } from './change-password-routing.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ChangePasswordRoutingModule,
    ReactiveFormsModule,   
  ],
  declarations: [ 
    ChangePasswordComponent,
    
  ]
})
export class ChangePasswordModule { }
