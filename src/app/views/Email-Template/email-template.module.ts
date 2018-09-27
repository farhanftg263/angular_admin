import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { EmailTemplateAddComponent } from './EmailTemplateAdd.component';
import { EmailTemplateEditComponent } from './EmailTemplateEdit.component';
import { EmailTemplateSummaryComponent } from './EmailTemplateSummary.component';
import { EmailTemplateRoutingModule } from './email-template-routing.module';
import { TinymceModule } from 'angular2-tinymce';
// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    EmailTemplateRoutingModule,
    ReactiveFormsModule,
    TinymceModule.withConfig({}),
    PaginationModule.forRoot(),
  ],
  declarations: [ 
    EmailTemplateAddComponent,
    EmailTemplateEditComponent,
    EmailTemplateSummaryComponent,
  ]
})
export class EmailTemplateModule { }
