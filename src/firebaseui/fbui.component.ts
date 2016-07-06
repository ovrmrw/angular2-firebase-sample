import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FirebaseUiService } from './fbui.service';


@Component({
  selector: 'sg-firebaseui',
  template: `
    <button (click)="login()" >Login</button>
    <button (click)="logout()" >Logout</button>
  `,
  providers: [FirebaseUiService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirebaseUiComponent implements OnInit {
  constructor(
    public service: FirebaseUiService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  login() {
    this.service.loginGoogleAuth();
  }

  logout() {
    this.service.logout();
  }

  get user() { return this.service.user$; }
}