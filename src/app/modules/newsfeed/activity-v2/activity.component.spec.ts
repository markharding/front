import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IntersectionObserverService } from '../../../common/services/interception-observer.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { Session } from '../../../services/session';
import { FeaturesService } from '../../../services/features.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { ElementVisibilityService } from '../../../common/services/element-visibility.service';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivityService } from '../activity/activity.service';
import { ActivityV2Component } from './activity.component';
import { MockService } from '../../../utils/mock';
import { BehaviorSubject, of } from 'rxjs';
import { EntityMetricsSocketsExperimentService } from '../../experiments/sub-services/entity-metrics-sockets-experiment.service';
import { PersistentFeedExperimentService } from '../../experiments/sub-services/persistent-feed-experiment.service';

describe('ActivityV2Component', () => {
  let comp: ActivityV2Component;
  let fixture: ComponentFixture<ActivityV2Component>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ActivityV2Component],
        providers: [
          { provide: ElementRef, useValue: MockService(ElementRef) },
          {
            provide: ChangeDetectorRef,
            useValue: MockService(ChangeDetectorRef),
          },
          { provide: NewsfeedService, useValue: MockService(NewsfeedService) },
          { provide: FeaturesService, useValue: MockService(FeaturesService) },
          { provide: Session, useValue: MockService(Session) },
          { provide: ConfigsService, useValue: MockService(ConfigsService) },
          {
            provide: IntersectionObserverService,
            useValue: MockService(IntersectionObserverService),
          },
          {
            provide: EntityMetricsSocketsExperimentService,
            useValue: MockService(EntityMetricsSocketsExperimentService),
          },
          {
            provide: PersistentFeedExperimentService,
            useValue: MockService(PersistentFeedExperimentService),
          },
        ],
      })
        .overrideProvider(ActivityService, {
          useValue: MockService(ActivityService, {
            has: ['entity$', 'height$', 'isLoggedIn$', 'displayOptions'],
            props: {
              entity$: { get: () => new BehaviorSubject<any>(null) },
              height$: { get: () => new BehaviorSubject<any>(null) },
              isLoggedIn$: { get: () => new BehaviorSubject<any>(null) },
              displayOptions: {
                autoplayVideo: true,
                showOwnerBlock: true,
                showComments: true,
                showOnlyCommentsInput: true,
                showOnlyCommentsToggle: false,
                showToolbar: true,
                showInteractions: false,
                showBoostMenuOptions: false,
                showEditedTag: false,
                showVisibilityState: false,
                showTranslation: false,
                showPostMenu: true,
                showPinnedBadge: true,
                showMetrics: true,
                fixedHeight: false,
                fixedHeightContainer: false,
                isModal: false,
                minimalMode: false,
                bypassMediaModal: false,
                sidebarMode: false,
                boostRotatorMode: false,
                isSidebarBoost: false,
                isFeed: false,
                isSingle: false,
                isV2: false,
                permalinkBelowContent: false,
              },
            },
          }),
        })
        .overrideProvider(ElementVisibilityService, {
          useValue: MockService(ElementVisibilityService),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(ActivityV2Component);
    comp = fixture.componentInstance;
    comp.canRecordAnalytics = false;

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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should setup interception observer subscription', () => {
    (comp as any).entityMetricSocketsExperiment.isActive.and.returnValue(true);
    (comp as any).interceptionObserver.createAndObserve.and.returnValue(
      of(true)
    );
    comp.setupInterceptionObserver();

    expect((comp as any).service.setupMetricsSocketListener).toHaveBeenCalled();
  });

  it('should teardown interception observer subscription', () => {
    (comp as any).entityMetricSocketsExperiment.isActive.and.returnValue(true);
    (comp as any).interceptionObserver.createAndObserve.and.returnValue(
      of(false)
    );
    comp.setupInterceptionObserver();

    expect(
      (comp as any).service.teardownMetricsSocketListener
    ).toHaveBeenCalled();
  });

  it('should NOT setup interception observer subscription if experiment is off', () => {
    (comp as any).entityMetricSocketsExperiment.isActive.and.returnValue(false);

    comp.setupInterceptionObserver();

    expect(
      (comp as any).service.setupMetricsSocketListener
    ).not.toHaveBeenCalled();
  });

  it('should NOT teardown interception observer subscription if experiment is off', () => {
    (comp as any).entityMetricSocketsExperiment.isActive.and.returnValue(false);

    comp.setupInterceptionObserver();

    expect(
      (comp as any).service.teardownMetricsSocketListener
    ).not.toHaveBeenCalled();
  });
});