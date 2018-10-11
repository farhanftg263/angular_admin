import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './ChangePassword.component';
const routes: Routes = [
  {
    path:'',
    data:{
      title : ''
    },
    children:[
      {
        path: 'update',
        component: ChangePasswordComponent,
        data: {
          title: 'Change Password'
        }
      },
    ]  
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangePasswordRoutingModule {}
