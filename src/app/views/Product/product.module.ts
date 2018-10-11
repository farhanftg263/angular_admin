import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { ProductAddComponent } from './ProductAdd.component';
import { ProductEditComponent } from './ProductEdit.component';
import { ProductSummaryComponent } from './ProductSummary.component';
import { ProductRoutingModule } from './product-routing.module';
import { LightboxModule } from 'ngx-lightbox';
//import { FileSelectDirective,FileUploader } from 'ng2-file-upload';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Lightbox } from 'ngx-lightbox';

@NgModule({
  imports: [
    LightboxModule,
    FormsModule,
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule,    
    PaginationModule.forRoot(),
  ],
  declarations: [ 
    ProductAddComponent,
    ProductEditComponent,
    ProductSummaryComponent,
   // FileSelectDirective,
   // FileUploader 
  ]
})
export class ProductModule { }
