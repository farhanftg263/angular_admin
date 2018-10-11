import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { ForgetPasswordComponent } from './views/forgetpassword/forgetpassword.component';
import { ResetPasswordComponent } from './views/resetpassword/resetpassword.component';

import { AuthGuard } from './_guards/index';

import { UserSummaryComponent } from './views/Users/UserSummary.component';
import { UserAddComponent } from './views/Users/UserAdd.component';
import { CmsSummaryComponent } from './views/Cms/CmsSummary.component';
import { CmsAddComponent } from './views/Cms/CmsAdd.component';
//import { EmailTemplateSummaryComponent } from './views/Email-Template/EmailTemplateSummary.component';
//import { EmailTemplateAddComponent } from './views/Email-Template/EmailTemplateAdd.component';
//import { GlobalSettingComponent } from './views/Global-Setting/GlobalSetting.component';
import { ManagePriceSummaryComponent } from './views/Manage-Price/ManagePriceSummary.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'forgetpassword',
    component: ForgetPasswordComponent,
    data: {
      title: 'Forget Password'
    }
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent,
    data: {
      title: 'Reset Password'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'admin_user',
        loadChildren: './views/Users/adminuser.module#AdminUserModule'
      },
      {
        path: 'cms',
        loadChildren: './views/Cms/cms.module#CmsModule'
      },
      {
        path: 'email_template',
        loadChildren: './views/Email-Template/email-template.module#EmailTemplateModule'
      },
      {
        path: 'global_setting',
        loadChildren: './views/Global-Setting/global-setting.module#GlobalSettingModule'
      },
      {
        path: 'manage_price',
        loadChildren: './views/Manage-Price/manage-price.module#ManagePriceModule'
      },
      {
        path: 'product',
        loadChildren: './views/Product/product.module#ProductModule'
      },
      {
        path: 'roles',
        loadChildren: './views/Roles/roles.module#RolesModule'
      },
      {
        path: 'change_password',
        loadChildren: './views/Change-Password/change-password.module#ChangePasswordModule'
      },
      {
        path: 'photo',
        loadChildren: './views/ManagePhoto/photo.module#PhotoModule'
      },
      {
        path: 'app_user',
        loadChildren: './views/App-Users/appuser.module#AppUserModule'
      },
      {
        path: 'redemption_request',
        loadChildren: './views/RedemptionRequest/redemption-request.module#RedemptionRequestModule'
      },
      {
        path: 'contact-admin',
        loadChildren: './views/ContactAdmin/ContactAdmin.module#ContactAdminModule'
      },
      {
        path: 'feedback',
        loadChildren: './views/Feedback/Feedback.module#FeedbackModule'
      },
      {
        path: 'leaderboard',
        loadChildren: './views/Leaderboard/Leaderboard.module#LeaderboardModule'
      },
      {
        path: 'buttons',
        loadChildren: './views/buttons/buttons.module#ButtonsModule'
      },
      {
        path: 'charts',
        loadChildren: './views/chartjs/chartjs.module#ChartJSModule'
      },
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'icons',
        loadChildren: './views/icons/icons.module#IconsModule'
      },
      {
        path: 'notifications',
        loadChildren: './views/notifications/notifications.module#NotificationsModule'
      },
      {
        path: 'theme',
        loadChildren: './views/theme/theme.module#ThemeModule'
      },
      {
        path: 'widgets fgdfgdfg',
        loadChildren: './views/widgets/widgets.module#WidgetsModule'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes,{useHash: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
