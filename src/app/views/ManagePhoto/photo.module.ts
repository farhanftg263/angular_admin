import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { PhotoSummaryComponent } from './PhotoSummary.component';
import { PhotoUserDetailComponent } from './PhotoUserDetail.component';
import { ManagePhotoRoutingModule } from './photo-routing.module';
import { LightboxModule } from 'ngx-lightbox';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  imports: [
    LightboxModule,
    FormsModule,
    CommonModule,
    ManagePhotoRoutingModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
  ],
  declarations: [ 
    PhotoSummaryComponent,
    PhotoUserDetailComponent
  ]
})
export class PhotoModule { }
