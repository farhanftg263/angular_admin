import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { UserAddComponent } from './UserAdd.component';
import { UserSummaryComponent } from './UserSummary.component';
import { AdminUserRoutingModule } from './adminuser-routing.module';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AdminUserRoutingModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
  ],
  declarations: [ 
    UserAddComponent,
    UserSummaryComponent,
  ]
})
export class AdminUserModule { }
