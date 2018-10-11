import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { ContactAdminComponent } from './ContactAdmin.component';
import { ContactAdminRoutingModule } from './ContactAdmin-routing.module';
 

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ContactAdminRoutingModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
  ],
  declarations: [ 
    ContactAdminComponent,
  ]
})
export class ContactAdminModule { }
