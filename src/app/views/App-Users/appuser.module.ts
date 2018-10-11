import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { AppUserAddComponent } from './AppUserAdd.component';
import { AppUserSummaryComponent } from './AppUserSummary.component';
import { AppUserRoutingModule } from './appuser-routing.module';
import { AppUserEditComponent } from './AppUserEdit.component';
import { NgDatepickerModule } from 'ng2-datepicker';
// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AppUserDetailComponent } from './AppUserDetail.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AppUserRoutingModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    NgDatepickerModule,
  ],
  declarations: [ 
    AppUserAddComponent,
    AppUserSummaryComponent,
    AppUserEditComponent,
    AppUserDetailComponent
  ]
})
export class AppUserModule { }
