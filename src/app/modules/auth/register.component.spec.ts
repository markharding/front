import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { clientMock } from '../../../tests/client-mock.spec';
import { Client } from '../../services/api/client';
import { loginReferrerServiceMock } from '../../mocks/services/login-referrer-service-mock.spec';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MockComponent, MockService } from '../../utils/mock';
import { TopbarService } from '../../common/layout/topbar.service';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { PagesService } from '../../common/services/pages.service';
import { ConfigsService } from '../../common/services/configs.service';
import { MetaService } from '../../common/services/meta.service';
import { AuthRedirectService } from '../../common/services/auth-redirect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Navigation as NavigationService } from '../../services/navigation';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';
import { BehaviorSubject } from 'rxjs';
import { EmailCodeExperimentService } from '../experiments/sub-services/email-code-experiment.service';
import { ContentSettingsModalService } from '../content-settings/content-settings-modal.service';
import { OnboardingV4Service } from '../onboarding-v4/onboarding-v4.service';

let activatedRouteMock = new (function() {
  this.queryParams = new BehaviorSubject({
    referrer: null,
  });
})();

describe('RegisterComponent', () => {
  let comp: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MockComponent({
            selector: 'm-registerForm',
            template: '',
            inputs: [
              'referrer',
              'showTitle',
              'showBigButton',
              'showPromotions',
              'showLabels',
              'showInlineErrors',
            ],
            outputs: ['done'],
          }),
          MockComponent({
            selector: 'm-marketing__footer',
          }),
          RegisterComponent,
        ],
        imports: [RouterTestingModule, ReactiveFormsModule],
        providers: [
          { provide: Client, useValue: clientMock },
          { provide: Router, useValue: MockService(Router) },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: PagesService, useValue: MockService(PagesService) },
          { provide: LoginReferrerService, useValue: loginReferrerServiceMock },
          { provide: Session, useValue: sessionMock },
          {
            provide: NavigationService,
            useValue: MockService(NavigationService),
          },
          {
            provide: SidebarNavigationService,
            useValue: MockService(SidebarNavigationService),
          },
          { provide: ConfigsService, useValue: MockService(ConfigsService) },
          { provide: TopbarService, useValue: MockService(TopbarService) },
          { provide: MetaService, useValue: MockService(MetaService) },
          {
            provide: PageLayoutService,
            useValue: MockService(PageLayoutService),
          },
          {
            provide: AuthRedirectService,
            useValue: MockService(AuthRedirectService),
          },
          {
            provide: EmailCodeExperimentService,
            useValue: MockService(EmailCodeExperimentService),
          },
          {
            provide: OnboardingV4Service,
            useValue: MockService(OnboardingV4Service),
          },
        ],
      }).compileComponents();
    })
  );

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);

    comp = fixture.componentInstance;
    comp.flags.canPlayInlineVideos = true;

    fixture.detectChanges();
  });

  afterEach(() => {
    loginReferrerServiceMock.navigate.calls.reset();
    (comp as any).emailCodeExperiment.isActive.calls.reset();
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  xit('should have a video with webm and mp4 sources', () => {
    const video: DebugElement = fixture.debugElement.query(
      By.css('.m-video-banner video')
    );
    expect(video).not.toBeNull();
    expect(video.nativeElement.poster).toBe(
      'http://dev.minds.io/assets/videos/earth-1/earth-1.png'
    );

    const webmSource: DebugElement = fixture.debugElement.query(
      By.css('video source:first-child')
    );
    const mp4Source: DebugElement = fixture.debugElement.query(
      By.css('video source:last-child')
    );

    expect(webmSource).not.toBeNull();
    expect(webmSource.nativeElement.src).toBe(
      'http://dev.minds.io/assets/videos/earth-1/earth-1.webm'
    );

    expect(mp4Source).not.toBeNull();
    expect(mp4Source.nativeElement.src).toBe(
      'http://dev.minds.io/assets/videos/earth-1/earth-1.mp4'
    );
  });

  xit('should have a register prompt and the form', () => {
    const h3: DebugElement = fixture.debugElement.query(By.css('h3'));
    expect(h3).not.toBeNull();
    expect(h3.nativeElement.textContent).toBe('Not on Minds? Start a channel');

    expect(fixture.debugElement.query(By.css('m-registerForm'))).not.toBeNull();
  });

  xit('should redirect when registered', () => {
    comp.registered();

    expect(loginReferrerServiceMock.navigate).toHaveBeenCalled();
    expect(
      loginReferrerServiceMock.navigate.calls.mostRecent().args[0]
    ).toEqual({ defaultUrl: '/test' });
  });

  it('should call to set title correctly with no referrer', () => {
    comp.ngOnInit();
    expect((comp as any).metaService.setTitle).toHaveBeenCalledWith(
      'Join Minds, and Elevate the Conversation',
      false
    );
  });
});
