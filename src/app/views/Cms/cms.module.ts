import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { CmsAddComponent } from './CmsAdd.component';
import { CmsEditComponent } from './CmsEdit.component';
import { CmsSummaryComponent } from './CmsSummary.component';
import { CmsRoutingModule } from './cms-routing.module';
import { TinymceModule } from 'angular2-tinymce';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    CmsRoutingModule,
    ReactiveFormsModule,
    TinymceModule.withConfig({}),
    PaginationModule.forRoot(),
  ],
  declarations: [ 
    CmsAddComponent,
    CmsEditComponent,
    CmsSummaryComponent,   
  ]
})
export class CmsModule { }
