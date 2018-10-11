import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { FeedbackComponent } from './Feedback.component';
import { FeedbackRoutingModule } from './Feedback-routing.module';
 

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    FeedbackRoutingModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
  ],
  declarations: [ 
    FeedbackComponent,
  ]
})
export class FeedbackModule { }
