import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { CmsAddComponent } from './CmsAdd.component';
import { CmsSummaryComponent } from './CmsSummary.component';
import { CmsRoutingModule } from './cms-routing.module';
import { TinymceModule } from 'angular2-tinymce';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    CmsRoutingModule,
    ReactiveFormsModule,
    TinymceModule.withConfig({})
  ],
  declarations: [ 
    CmsAddComponent,
    CmsSummaryComponent,
  ]
})
export class CmsModule { }
