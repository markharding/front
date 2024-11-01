import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { FormControl, FormsModule, NgControl } from '@angular/forms';
import { ApiService } from '../../../api/api.service';
import {
  AutoCompleteEntityTypeEnum,
  AutocompleteEntityInputComponent,
} from './autocomplete-entity-input.component';
import { MockService } from '../../../../utils/mock';
import userMock from '../../../../mocks/responses/user.mock';
import { of, take, throttleTime } from 'rxjs';
import { groupMock } from '../../../../mocks/responses/group.mock';
import { Session } from '../../../../services/session';

describe('AutocompleteEntityInputComponent', () => {
  let comp: AutocompleteEntityInputComponent;
  let fixture: ComponentFixture<AutocompleteEntityInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AutocompleteEntityInputComponent],
      providers: [
        { provide: NgControl, useValue: NgControl },
        { provide: ApiService, useValue: MockService(ApiService) },
      ],
    })
      .overrideComponent(AutocompleteEntityInputComponent, {
        add: {
          providers: [
            {
              provide: NgControl,
              useClass: class extends NgControl {
                control = new FormControl();
                viewToModelUpdate() {}
              },
            },
            {
              provide: Session,
              useValue: MockService(Session),
            },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteEntityInputComponent);
    comp = fixture.componentInstance;

    comp.entityRef$.next(null);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      comp.propagateChange = jasmine.createSpy('propagateChange');
    });

    it('should propagate change out when entityRef$ is updated with an entity', fakeAsync(() => {
      comp.entityRef$.next(userMock);

      tick();
      expect(comp.propagateChange).toHaveBeenCalledWith(userMock);
      discardPeriodicTasks();
    }));
  });

  describe('showPopout$', () => {
    it('should show popout because focused and has entities', fakeAsync(() => {
      comp.entityRef$.next('abc');

      (comp as any).api.get.and.returnValue(
        of({
          entities: [userMock],
        })
      );

      comp.inProgress$.next(false);
      comp.isFocused$.next(true);

      tick(100);

      comp.showPopout$.pipe(take(1)).subscribe((showPopout) => {
        expect(showPopout).toBe(true);
      });

      discardPeriodicTasks();
    }));
  });

  describe('entitySelection', () => {
    let mockApiService: ApiService;

    beforeEach(() => {
      mockApiService = TestBed.inject(ApiService);
      comp.propagateChange = jasmine.createSpy('propagateChange');
    });

    it('should propagate change when a group is selected', fakeAsync(() => {
      comp.entityType = AutoCompleteEntityTypeEnum.Group;
      (comp as any).api.get.and.returnValue(of({ entities: [groupMock] }));

      comp.onEntitySelect(groupMock);

      tick();
      expect(comp.propagateChange).toHaveBeenCalledWith(groupMock);
      discardPeriodicTasks();
    }));

    it('should propagate change when a user is selected', fakeAsync(() => {
      comp.entityType = AutoCompleteEntityTypeEnum.User;
      (comp as any).api.get.and.returnValue(of({ entities: [userMock] }));

      comp.onEntitySelect(userMock);

      tick();
      expect(comp.propagateChange).toHaveBeenCalledWith(userMock);
      discardPeriodicTasks();
    }));
  });

  describe('clearAfterSelection', () => {
    it('should clear the input field after a selection is made', fakeAsync(() => {
      comp.clearAfterSelection = true;
      comp.entityRef$.next(userMock);

      tick();
      fixture.detectChanges();

      expect(comp.inputElRef.nativeElement.value).toBe('');
      discardPeriodicTasks();
    }));
  });

  describe('matchedEntitiesList', () => {
    it('should get results from server with nsfw included when a user opts into nsfw', (done: DoneFn) => {
      const seachTerm: string = 'username_test';
      (comp as any).api.get.and.returnValue(of({ entities: [userMock] }));
      (comp as any).session.getLoggedInUser.and.returnValue({
        ...userMock,
        mature: 1,
      });
      comp.entityRef$.next(seachTerm);
      comp.entityType = AutoCompleteEntityTypeEnum.User;

      comp.matchedEntitiesList$
        .pipe(take(1), throttleTime(100))
        .subscribe((entities) => {
          expect((comp as any).api.get).toHaveBeenCalledWith(
            'api/v2/search/suggest/user',
            {
              q: seachTerm,
              limit: (comp as any).limit,
              hydrate: 1,
              include_nsfw: 1,
            }
          );
          expect(entities).toEqual([userMock]);
          done();
        });
    });

    it('should get results from server without nsfw included when a user opts out of nsfw', (done: DoneFn) => {
      const seachTerm: string = 'username_test';
      (comp as any).api.get.and.returnValue(of({ entities: [userMock] }));
      (comp as any).session.getLoggedInUser.and.returnValue({
        ...userMock,
        mature: 0,
      });
      comp.entityRef$.next(seachTerm);
      comp.entityType = AutoCompleteEntityTypeEnum.User;

      comp.matchedEntitiesList$
        .pipe(take(1), throttleTime(100))
        .subscribe((entities) => {
          expect((comp as any).api.get).toHaveBeenCalledWith(
            'api/v2/search/suggest/user',
            {
              q: seachTerm,
              limit: (comp as any).limit,
              hydrate: 1,
              include_nsfw: 0,
            }
          );
          expect(entities).toEqual([userMock]);
          done();
        });
    });

    it('should get results from server without nsfw included when a user is not logged in', (done: DoneFn) => {
      const seachTerm: string = 'username_test';
      (comp as any).api.get.and.returnValue(of({ entities: [userMock] }));
      (comp as any).session.getLoggedInUser.and.returnValue(null);

      comp.entityRef$.next(seachTerm);
      comp.entityType = AutoCompleteEntityTypeEnum.User;

      comp.matchedEntitiesList$
        .pipe(take(1), throttleTime(100))
        .subscribe((entities) => {
          expect((comp as any).api.get).toHaveBeenCalledWith(
            'api/v2/search/suggest/user',
            {
              q: seachTerm,
              limit: (comp as any).limit,
              hydrate: 1,
              include_nsfw: 0,
            }
          );
          expect(entities).toEqual([userMock]);
          done();
        });
    });
  });
});
