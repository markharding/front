import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { NotificationsToasterComponent } from '../../../modules/notifications/toaster.component';
import { Session } from '../../../services/session';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'm-v3-topbar',
  templateUrl: 'v3-topbar.component.html',
})
export class V3TopbarComponent implements OnInit, OnDestroy {
  minds = window.Minds;
  timeout;
  isTouchScreen = false;

  @ViewChild(DynamicHostDirective, { static: true })
  notificationsToasterHost: DynamicHostDirective;

  componentRef;
  componentInstance: NotificationsToasterComponent;

  constructor(
    protected session: Session,
    protected cd: ChangeDetectorRef,
    private themeService: ThemeService,
    protected componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.loadComponent();
    this.session.isLoggedIn(() => this.detectChanges());
  }

  getCurrentUser() {
    return this.session.getLoggedInUser();
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        NotificationsToasterComponent
      ),
      viewContainerRef = this.notificationsToasterHost.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  touchStart() {
    this.isTouchScreen = true;
  }

  mouseEnter() {
    if (this.session.isLoggedIn()) {
      this.timeout = setTimeout(() => {
        if (!this.isTouchScreen) {
          this.themeService.toggleUserThemePreference();
        }
      }, 5000);
    }
  }

  mouseLeave() {
    clearTimeout(this.timeout);
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
