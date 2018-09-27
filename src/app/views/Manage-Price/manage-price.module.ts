import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { ManagePriceAddComponent } from './ManagePriceAdd.component';
import { ManagePriceEditComponent } from './ManagePriceEdit.component';
import { ManagePriceSummaryComponent } from './ManagePriceSummary.component';
import { ManagePriceRoutingModule } from './manage-price-routing.module';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ManagePriceRoutingModule,
    ReactiveFormsModule,    
    PaginationModule.forRoot(),
  ],
  declarations: [ 
    ManagePriceAddComponent,
    ManagePriceEditComponent,
    ManagePriceSummaryComponent,
  ]
})
export class ManagePriceModule { }
