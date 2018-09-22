import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { GlobalSettingComponent } from './GlobalSetting.component';
import { GlobalSettingRoutingModule } from './global-setting-routing.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    GlobalSettingRoutingModule,
    ReactiveFormsModule,   
  ],
  declarations: [ 
    GlobalSettingComponent,
    
  ]
})
export class GlobalSettingModule { }
