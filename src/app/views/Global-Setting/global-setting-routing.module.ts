import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlobalSettingComponent } from './GlobalSetting.component';
const routes: Routes = [
  {
    path:'',
    data:{
      title : 'Manage Master'
    },
    children:[
      {
        path: 'summary',
        component: GlobalSettingComponent,
        data: {
          title: 'Global Setting'
        }
      },
    ]  
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalSettingRoutingModule {}
