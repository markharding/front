import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MockComponent, MockService } from '../../../utils/mock';
import { TwitterConnectionService } from '../services/twitter-connection.service';
import { ConnectTwitterModalComponent } from './connect-twitter-modal.component';

describe('ConnectTwitterModalComponent', () => {
  let comp: ConnectTwitterModalComponent;
  let fixture: ComponentFixture<ConnectTwitterModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ConnectTwitterModalComponent,
          MockComponent({
            selector: 'm-button',
            inputs: ['disabled', 'saving'],
          }),
          MockComponent({
            selector: 'm-modalCloseButton',
            inputs: ['color'],
          }),
        ],
        providers: [
          {
            provide: TwitterConnectionService,
            useValue: MockService(TwitterConnectionService, {
              has: [
                'isConnected$',
                'authUrlRequestInProgress$',
                'authUrl$',
                'postAuthRedirectPath$',
              ],
              props: {
                isConnected$: {
                  get: () => new BehaviorSubject<boolean>(false),
                },
                authUrlRequestInProgress$: {
                  get: () => new BehaviorSubject<boolean>(false),
                },
                authUrl$: {
                  get: () => new BehaviorSubject<string>('/auth'),
                },
                postAuthRedirectPath$: {
                  get: () => new BehaviorSubject<string>('/redirect-path'),
                },
              },
            }),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(ConnectTwitterModalComponent);
    comp = fixture.componentInstance;

    (comp as any).twitterConnection.isConnected$.next(false);
    (comp as any).twitterConnection.authUrlRequestInProgress$.next(false);
    (comp as any).twitterConnection.authUrl$.next('/auth');
    (comp as any).twitterConnection.postAuthRedirectPath$.next(
      '/redirect-path'
    );

    (comp as any).assignWindowLocation = () => void 0;

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should update body text based upon modal data', () => {
    const defaultBodyText: string = 'Connect your Minds account with Twitter.';
    const newBodyText: string = 'New body text';

    expect(comp.bodyText).toBe(defaultBodyText);

    comp.setModalData({ bodyText: newBodyText });
    fixture.detectChanges();

    expect(comp.bodyText).toBe(newBodyText);
  });

  it('should get auth url and assign new location on connect click', fakeAsync(() => {
    comp.onConnectClick(null);
    tick();
    expect(
      (comp as any).twitterConnection.postAuthRedirectPath$.getValue()
    ).toBe('/supermind/inbox');
  }));
});
