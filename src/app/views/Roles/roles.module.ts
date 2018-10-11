import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { RolesAddComponent } from './RolesAdd.component';
import { RolesEditComponent } from './RolesEdit.component';
import { RolesPermissionComponent } from './RolesPermission.component';
import { RolesSummaryComponent } from './RolesSummary.component';
import { RolesRoutingModule } from './roles-routing.module';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RolesRoutingModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
  ],
  declarations: [ 
    RolesAddComponent,
    RolesEditComponent,
    RolesSummaryComponent,
    RolesPermissionComponent,   
  ]
})
export class RolesModule { }
