import { Component, View, CORE_DIRECTIVES, EventEmitter } from 'angular2/angular2';
import { Client } from '../../services/api';
@Component({
  selector: 'minds-button-user-dropdown',
  inputs: ['user'],
  outputs: ['userChanged']
})
@View({
  template: `
    <button class="material-icons" (click)="toggleMenu($event)">settings</button>

    <ul class="minds-dropdown-menu" [hidden]="!showMenu" >
      <li class="mdl-menu__item" [hidden]="user.blocked" (click)="block()">Block @{{user.username}}</li>
      <li class="mdl-menu__item" [hidden]="!user.blocked" (click)="unBlock()">Un-Block @{{user.username}}</li>
      <li class="mdl-menu__item">Report</li>
    </ul>
    <minds-bg-overlay (click)="toggleMenu($event)" [hidden]="!showMenu"></minds-bg-overlay>
  `,
  directives: [ CORE_DIRECTIVES ]
})

export class UserDropdownButton{

  user : any = {
    blocked: false
  };
  userChanged: EventEmitter<any> = new EventEmitter;
  showMenu : boolean = false;

  constructor(public client : Client) {
  }

  block(){
    var self = this;
    this.user.blocked = true;
    this.client.put('api/v1/block/' + this.user.guid, {})
      .then((response : any) => {
        self.user.blocked = true;
      })
      .catch((e) => {
        self.user.blocked = false;
      });
    this.showMenu = false;
  }

  unBlock(){
    var self = this;
    this.user.blocked = false;
    this.client.delete('api/v1/block/' + this.user.guid, {})
      .then((response : any) => {
        self.user.blocked = false;
      })
      .catch((e) => {
        self.user.blocked = true;
      });
    this.showMenu = false;
  }

  toggleMenu(e){
    e.stopPropagation();
    if(this.showMenu){
      this.showMenu = false;

      return;
    }
    this.showMenu = true;
    var self = this;
    this.client.get('api/v1/block/' + this.user.guid)
      .then((response : any) => {
        self.user.blocked = response.blocked;
      })
  }

  onDestroy(){
  }

}
