import { Component, Input,OnInit } from '@angular/core';
import { navItems } from './../../_nav';
import {Router} from '@angular/router';
import { stringify } from 'querystring';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  constructor(
    private router : Router
  ) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }
  ngOnInit(){
    var leftmenu=new Array();
    //var moduleId=new Array();
    //console.log('left menu list: '+JSON.stringify(navItems));
        var numberOfMngrName = 0;
        var moduleId2=Array(1,3,10);
        console.log('loged in user for menu : '+JSON.stringify(moduleId2));
        var logedinUser = JSON.parse(localStorage.getItem("currentUser"));
        console.log('admin user detail ppp: '+JSON.stringify(logedinUser.result));

      if(logedinUser.result.roleId!='5b9bf654fb6fc00e4d75e7e7'){
        var privilegeval=logedinUser.result.privilege;
        console.log('privilege val: '+privilegeval);
        //var moduleId= privilegeval.split(",");
        var moduleId = JSON.parse("[" + privilegeval + "]");
         console.log('loged in user for menu : '+JSON.stringify(moduleId));
        for(var i=0;i<navItems.length;i++){
          var appendChildren={};
          
          if(moduleId.indexOf(navItems[i].modid)>=0){
              leftmenu.push(navItems[i]);              
              //console.log('find modid: '+JSON.stringify(navItems[i]));
            }else if(navItems[i].children!= null){
              var submenu=[];
              var childFlag=false;             
              for(var j=0;j<navItems[i].children.length;j++){
                var appendJson={}; 
                if(moduleId.indexOf(navItems[i].children[j].modid)>=0){
                  appendJson['name']=navItems[i].children[j].name;
                  appendJson['url']=navItems[i].children[j].url;
                  appendJson['icon']=navItems[i].children[j].icon;
                  appendJson['modid']=navItems[i].children[j].modid;
                  
                  submenu.push(appendJson);
                  childFlag=true;
                  //console.log('find modid: '+JSON.stringify(navItems[i]));
                }
                
              }
              if(childFlag){
                appendChildren['name']=navItems[i].name;
                appendChildren['url']=navItems[i].url;
                appendChildren['icon']=navItems[i].icon;
                appendChildren['children']=submenu;

              }
              if(Object.values(appendChildren).length>0){
              leftmenu.push(appendChildren);
              }
            }
        }
        this.navItems=leftmenu;
      }
        console.log('sub array1111:  '+JSON.stringify(leftmenu));
        //console.log(JSON.stringify(leftmenu));
  }

  // Logout and refirect to login screen.
  logout()
  {
     localStorage.removeItem('currentUser');
     this.router.navigate(['login']);
  }
}
