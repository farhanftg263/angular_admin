import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 


import { RedemptionRequestSummaryComponent } from './RedemptionRequestSummary.component';
import { RedemptionRequestRoutingModule } from './redemption-request-routing.module';
import { LightboxModule } from 'ngx-lightbox';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UserDetailComponent } from './UserDetail.component';
import { ProductDetailComponent } from './ProductDetail.component';
import { Lightbox } from 'ngx-lightbox';

@NgModule({
  imports: [
    LightboxModule,    
    FormsModule,
    CommonModule,
    RedemptionRequestRoutingModule,
    ReactiveFormsModule,    
    PaginationModule.forRoot(),
  ],
  declarations: [    
    RedemptionRequestSummaryComponent,
    UserDetailComponent,
    ProductDetailComponent,       
  ]
})
export class RedemptionRequestModule { }
