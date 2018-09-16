import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { UserAddComponent } from './UserAdd.component';
import { UserSummaryComponent } from './UserSummary.component';
import { AdminUserRoutingModule } from './adminuser-routing.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AdminUserRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ 
    UserAddComponent,
    UserSummaryComponent,
  ]
})
export class AdminUserModule { }
