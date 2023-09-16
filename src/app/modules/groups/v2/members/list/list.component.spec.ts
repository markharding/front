import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GroupMembersListComponent } from './list.component';
import { GroupMembersListService } from './list.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BehaviorSubject, of } from 'rxjs';
import { Session } from '../../../../../services/session';
import { groupMock } from '../../../../../mocks/responses/group.mock';
import { GroupMembershipLevel } from '../../group.types';

describe('GroupMembersListComponent', () => {
  let component: GroupMembersListComponent;
  let fixture: ComponentFixture<GroupMembersListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          GroupMembersListComponent,
          MockComponent({
            selector: 'm-publisherCard',
            inputs: [
              'publisher',
              'showDescription',
              'sizeOverride',
              'showSubscriptionButton',
            ],
          }),
          MockComponent({
            selector: 'm-group__memberActions',
            inputs: ['group', 'user'],
            outputs: ['onKick', 'membershipChange'],
          }),
          MockComponent({
            selector: 'm-tooltip',
          }),
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
          }),
          MockComponent({
            selector: 'infinite-scroll',
            inputs: ['moreData', 'inProgress'],
            outputs: ['load'],
          }),
        ],
        providers: [
          {
            provide: Session,
            useValue: MockService(Session),
          },
        ],
      })
        .overrideProvider(GroupMembersListService, {
          useValue: MockService(GroupMembersListService, {
            has: [
              'group$',
              'groupMembershipLevel$',
              'membershipLevelGte$',
              'searchQuery$',
            ],
            props: {
              group$: {
                get: () => new BehaviorSubject<any>(groupMock),
              },
              groupMembershipLevel$: {
                get: () =>
                  new BehaviorSubject<any>(GroupMembershipLevel.MEMBER),
              },
              membershipLevelGte$: {
                get: () => new BehaviorSubject<any>(false),
              },
              searchQuery$: {
                get: () => new BehaviorSubject<string>(''),
              },
            },
          }),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(GroupMembersListComponent);
    component = fixture.componentInstance;

    component.group$.next(groupMock);
    component.groupMembershipLevel$.next(GroupMembershipLevel.MEMBER);
    component.membershipLevelGte$.next(false);

    (component as any).service.getList$.and.returnValue(
      of({
        'load-next': false,
        members: [],
      })
    );

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
