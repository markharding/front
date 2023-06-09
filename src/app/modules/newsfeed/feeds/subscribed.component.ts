import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Injectable,
  Injector,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  Self,
  SkipSelf,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, map, scan, startWith } from 'rxjs/operators';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import {
  FeedsService,
  InjectItem,
} from '../../../common/services/feeds.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Client, Upload } from '../../../services/api';
import { ContextService } from '../../../services/context.service';
import { Navigation as NavigationService } from '../../../services/navigation';
import { ComposerComponent } from '../../composer/composer.component';
import { ExperimentsService } from '../../experiments/experiments.service';
import { PersistentFeedExperimentService } from '../../experiments/sub-services/persistent-feed-experiment.service';
import { FeedNoticeService } from '../../notices/services/feed-notice.service';
import { NewsfeedBoostRotatorComponent } from '../boost-rotator/boost-rotator.component';
import { FeedItemType } from '../feed/feed.component';
import { NewsfeedService } from '../services/newsfeed.service';
import { DismissalService } from './../../../common/services/dismissal.service';
import { FeedAlgorithmHistoryService } from './../services/feed-algorithm-history.service';
import { Platform } from '@angular/cdk/platform';
import { OnboardingV4Service } from '../../onboarding-v4/onboarding-v4.service';
import { Session } from '../../../services/session';

export enum FeedAlgorithm {
  top = 'top',
  latest = 'latest',
  forYou = 'for-you',
  groups = 'groups',
}

const commonInjectItems: InjectItem[] = [
  {
    type: FeedItemType.feedNotice,
    indexes: i => i > 0 && i % 6 === 0,
  },
  {
    type: FeedItemType.featuredContent,
    indexes: i => (i > 0 && i % 5 === 0) || i === 3,
  },
  {
    type: FeedItemType.channelRecommendations,
    indexes: (i, feedLength) =>
      feedLength <= 3 ? i === feedLength - 1 : i === 2,
  },
];

@Injectable()
export class LatestFeedService extends FeedsService {
  endpoint = 'api/v2/feeds/subscribed/activities';
  countEndpoint = 'api/v3/newsfeed/subscribed/latest/count';
  limit = new BehaviorSubject(12);
  injectItems = [
    ...commonInjectItems,
    {
      type: FeedItemType.topHighlights,
      indexes: [3],
    },
  ];
}

@Injectable()
export class TopFeedService extends FeedsService {
  endpoint = 'api/v3/newsfeed/feed/unseen-top';
  limit = new BehaviorSubject(12);
  injectItems = commonInjectItems;
}

/**
 * Service for "For You" feed.
 */
@Injectable()
export class ForYouFeedService extends FeedsService {
  endpoint = 'api/v3/newsfeed/feed/clustered-recommendations';
  limit = new BehaviorSubject(12);
  injectItems = commonInjectItems;
}

/**
 * Service for "Groups" feed.
 */
@Injectable()
export class GroupsFeedService extends FeedsService {
  endpoint = 'api/v2/feeds/subscribed/activities';
  limit = new BehaviorSubject(12);
  injectItems = commonInjectItems;
}

@Component({
  selector: 'm-newsfeed--subscribed',
  providers: [
    LatestFeedService,
    TopFeedService,
    ForYouFeedService,
    GroupsFeedService,
  ],
  templateUrl: 'subscribed.component.html',
})
export class NewsfeedSubscribedComponent implements OnInit, OnDestroy {
  prepended: Array<any> = [];
  offset: string | number = '';
  showBoostRotator: boolean = false;
  inProgress: boolean = false;
  moreData: boolean = true;
  algorithm: FeedAlgorithm;
  message: string = '';
  newUserPromo: boolean = false;
  postMeta: any = {
    title: '',
    description: '',
    thumbnail: '',
    url: '',
    active: false,
    attachment_guid: null,
  };
  paramsSubscription: Subscription;
  reloadFeedSubscription: Subscription;
  private zendeskErrorSubscription: Subscription;
  private onboardingTagsCompletedSubscription: Subscription;
  routerSubscription: Subscription;

  /**
   * Listening for new posts.
   */
  private feedsUpdatedSubscription: Subscription;

  @ViewChild('composer') private composer: ComposerComponent;
  @ViewChild('boostRotator')
  private boostRotator: NewsfeedBoostRotatorComponent;
  @ViewChildren('feedViewChildren', { read: ElementRef })
  feedViewChildren: QueryList<ElementRef>;
  /**
   * Whether top highlights is dismissed
   */
  isTopHighlightsDismissed$ = this.dismissal.dismissed('top-highlights');
  /**
   * Whether channel recommendation is dismissed
   */
  isChannelRecommendationDismissed$ = this.dismissal.dismissed(
    'channel-recommendation:feed'
  );
  isDiscoveryFallbackDismissed$ = this.dismissal.dismissed(
    'feed:discovery-fallback'
  );

  @ViewChild('discoveryFallback', { read: ViewContainerRef })
  discoveryFallback!: ViewContainerRef;

  /**
   * Controls whether the latest feed should be shown at the end of the current feed
   */
  latestFallbackActive$ = new BehaviorSubject(false);

  newsfeedEndText = $localize`:@@COMMON__FEED_END:End of your newsfeed`;

  public persistentFeedExperimentActive: boolean;

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    private feedAlgorithmHistory: FeedAlgorithmHistoryService,
    private context: ContextService,
    @Self() public latestFeedService: LatestFeedService,
    @Self() public topFeedService: TopFeedService,
    @Self() public forYouFeedService: ForYouFeedService,
    @Self() public groupsFeedService: GroupsFeedService,
    protected newsfeedService: NewsfeedService,
    protected clientMetaService: ClientMetaService,
    public feedsUpdate: FeedsUpdateService,
    private toast: ToasterService,
    private experiments: ExperimentsService,
    @SkipSelf() injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dismissal: DismissalService,
    public changeDetectorRef: ChangeDetectorRef,
    private feedNoticeService: FeedNoticeService,
    persistentFeedExperiment: PersistentFeedExperimentService,
    private platform: Platform,
    private onboardingV4Service: OnboardingV4Service,
    private session: Session
  ) {
    if (isPlatformServer(this.platformId)) return;

    const storedfeedAlgorithm = this.feedAlgorithmHistory.lastAlorithm;
    if (storedfeedAlgorithm) {
      this.algorithm = storedfeedAlgorithm;
    }
    this.persistentFeedExperimentActive = persistentFeedExperiment.isActive();
    if (this.persistentFeedExperimentActive) {
      this.topFeedService.setCachingEnabled(true);
      this.latestFeedService.setCachingEnabled(true);
      this.forYouFeedService.setCachingEnabled(true);
      this.groupsFeedService.setCachingEnabled(true);
    }
  }

  ngOnInit() {
    /**
     * Emits a count of how many times the route has changed
     * (count includes the initial load)
     *
     * Reload the feed when the route changes and
     * hide the boost rotator whenever we switch tabs
     */
    this.routerSubscription = this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        startWith(this.router),
        map(() => {
          return 1;
        }),
        scan((accumulator, current) => {
          return accumulator + current;
        }, 0)
      )
      .subscribe(count => {
        this.load();

        if (count === 1) {
          setTimeout(() => {
            this.showBoostRotator = true;
          }, 50);
        } else {
          this.showBoostRotator = false;
        }
      });

    this.reloadFeedSubscription = this.newsfeedService.onReloadFeed.subscribe(
      () => {
        this.load();
      }
    );

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['algorithm']) {
        if (Object.values(FeedAlgorithm).includes(params['algorithm'])) {
          this.changeFeedAlgorithm(params['algorithm']);
        } else {
          this.router.navigate([`/newsfeed/subscriptions/${this.algorithm}`]);
        }
      }

      if (params['message']) {
        this.message = params['message'];
      }

      this.newUserPromo = !!params['newUser'];
    });

    // catch Zendesk errors and make them domain specific.
    this.zendeskErrorSubscription = this.route.queryParams
      .pipe(filter(Boolean))
      .subscribe(params => {
        if (params.kind === 'error') {
          if (
            /User is invalid: External minds-guid:\d+ has already been taken/.test(
              params.message
            )
          ) {
            this.toast.error(
              'Your email is already linked to a support account'
            );
            return;
          }

          if (
            params.message ===
            'Please use one of the options below to sign in to Zendesk.'
          ) {
            this.toast.error('Authentication method invalid');
            return;
          }

          this.toast.error(params.message ?? 'An unknown error has occurred');
        }
      });

    this.feedsUpdatedSubscription = this.feedsUpdate.postEmitter.subscribe(
      newPost => {
        this.prepend(newPost);
      }
    );

    // subscribe to onboarding tags completion and reload the feed with more relevant content.
    this.onboardingTagsCompletedSubscription = this.onboardingV4Service.tagsCompleted$.subscribe(
      (completed: boolean): void => {
        this.feedService.clear();
        this.load();
      }
    );

    this.feedNoticeService.fetch();

    this.context.set('activity');
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
    this.paramsSubscription?.unsubscribe();
    this.reloadFeedSubscription?.unsubscribe();
    this.feedsUpdatedSubscription?.unsubscribe();
    this.zendeskErrorSubscription?.unsubscribe();
    this.onboardingTagsCompletedSubscription?.unsubscribe();
  }

  /**
   * returns feedService based on algorithm
   **/
  get feedService(): FeedsService {
    switch (this.algorithm) {
      case 'top':
        return this.topFeedService;
      case 'for-you':
        return this.forYouFeedService;
      case 'groups':
        return this.groupsFeedService;
      default:
        return this.latestFeedService;
    }
  }

  async load() {
    if (isPlatformServer(this.platformId)) return;

    this.moreData = true;
    this.offset = 0;
    this.inProgress = true;

    let queryParams = {
      algorithm: this.algorithm,
    };

    if (this.experiments.hasVariation('newsfeed-group-posts', true)) {
      queryParams['include_group_posts'] = true;
    }

    /**
     * Rotating the boost rotator provides feedback that something has changes
     * to the user on shorter viewports that may not be able to see the feed
     * under the rotator.
     */
    if (this.boostRotator?.running) {
      this.boostRotator?.next();
    }

    try {
      switch (this.algorithm) {
        case 'for-you':
          await this.forYouFeedService.setLimit(12).fetch(true);
          break;
        case 'top':
          await this.topFeedService.setLimit(12).fetch(true);
          break;
        case 'latest':
          this.prepended = [];
          await Promise.all([
            this.topFeedService.setLimit(3).fetch(true),
            this.latestFeedService.fetch(true),
          ]);
          break;
        case 'groups':
          const params = {
            group_posts_for_user_guid:
              this.session.getLoggedInUser()?.guid || '',
          };

          await this.groupsFeedService
            .setParams(params)
            .setLimit(12)
            .fetch(true);
          break;
      }
    } catch (e) {
      console.error('Load Feed', e);
    }

    this.inProgress = false;
  }

  loadNext(feedService: FeedsService = this.feedService) {
    if (
      feedService.canFetchMore &&
      !feedService.inProgress.getValue() &&
      feedService.offset.getValue()
    ) {
      feedService.fetch(); // load the next 150 in the background
    }
    feedService.loadMore();
  }

  prepend(activity: any) {
    this.prepended.unshift(activity);

    this.newUserPromo = false;
  }

  delete(activity) {
    let i: any;

    for (i in this.prepended) {
      if (this.prepended[i] === activity) {
        this.prepended.splice(i, 1);
        return;
      }
    }

    this.feedService.deleteItem(activity, (item, obj) => {
      return item.urn === obj.urn;
    });
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.composer) {
      return this.composer.canDeactivate();
    }
  }

  /**
   * change feed algorithm
   **/
  changeFeedAlgorithm(algo: FeedAlgorithm) {
    this.algorithm = algo;
    this.feedAlgorithmHistory.lastAlorithm = algo;

    switch (algo) {
      case 'for-you':
        this.latestFeedService.clear(true);
        this.forYouFeedService.clear(true);
        break;
      case 'top':
        this.topFeedService.clear(true);
        break;
      case 'latest':
        this.latestFeedService.clear(true);
        this.topFeedService.clear(true);
        break;
      case 'groups':
        this.groupsFeedService.clear(true);
    }
  }

  /**
   * smooth scrolls to top and changes feed algorithm
   **/
  onShowMoreTopFeed() {
    if (isPlatformServer(this.platformId)) return;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setTimeout(() => {
      this.changeFeedAlgorithm(FeedAlgorithm.top);
      this.load();
    }, 500);
  }

  /**
   * determines whether to show top feed highlights or not
   * @param { number } index the index of the feed
   */
  shouldShowTopHighlights(index: number) {
    // only on latest
    if (this.algorithm !== 'latest') {
      return false;
    }

    // before 4th post
    return index === 3;
  }

  /**
   * whether channel recommendation should be shown
   * @param { string } location the location where the widget is to be shown
   * @param { number } index the index of the feed
   * @returns { boolean }
   */
  public shouldShowChannelRecommendation(location: string, index?: number) {
    if (this.feedService.inProgress && !this.feedService.feedLength) {
      return false;
    }

    switch (location) {
      case 'emptyState':
        return !this.feedService.feedLength;
      case 'feed':
      default:
        // if the newsfeed length was less than equal to 3,
        // show the widget after last item
        if (this.feedService.feedLength <= 3) {
          return index === this.feedService.feedLength - 1;
        }

        // show after the 3rd post
        return index === 2;
    }
  }

  /**
   * scrolls to under the boost rotator. Used as an alternative to scrollToTop but
   * keeping scrolling consistency by not avoiding the rotator.
   */
  scrollToUnderBoostRotator(): void {
    if (isPlatformServer(this.platformId)) return;

    // if boost rotator didn't exist, just scroll to top
    if (!this.boostRotator) {
      window.scrollTo({
        behavior: 'smooth',
        top: 0,
      });
      return;
    }

    const bottomOfBoostRotatorOffset =
      this.boostRotator.rotatorEl?.nativeElement?.offsetTop +
      this.boostRotator?.height;

    window.scrollTo({
      behavior: 'smooth',
      top: bottomOfBoostRotatorOffset || 0,
    });
  }

  isDiscoveryFallbackEnabled() {
    return this.experiments.hasVariation('minds-2991-discovery-fallback', true);
  }

  isLatestFallbackEnabled() {
    return this.experiments.hasVariation('minds-2978-latest-fallback', true);
  }

  async loadDiscoveryFallback() {
    const { DefaultFeedComponent } = await import(
      '../../default-feed/feed/feed.component'
    );
    this.discoveryFallback.clear();
    const componentRef = this.discoveryFallback.createComponent(
      DefaultFeedComponent
    );

    componentRef.instance.visibleHeader = true;
  }

  /**
   * what should happen at the end of the feed?
   * 1. if it was the top feed, fallback to latest
   * 2. if it was the latest feed, fallback to discovery
   * @param { FeedsService } feedService
   */
  onNewsfeedEndReached(feedService: FeedsService = this.feedService) {
    const loadDiscoveryFallbackIfEnabled = () => {
      if (
        this.isDiscoveryFallbackEnabled() &&
        !this.dismissal.isDismissed('feed:discovery-fallback')
      ) {
        this.loadDiscoveryFallback();
      }
    };

    switch (feedService) {
      case this.latestFeedService:
        loadDiscoveryFallbackIfEnabled();
        break;
      case this.topFeedService:
        if (this.isLatestFallbackEnabled()) {
          this.latestFeedService.fetch(true);
          this.latestFallbackActive$.next(true);
        } else {
          loadDiscoveryFallbackIfEnabled();
        }
        break;
      case this.forYouFeedService:
        this.latestFallbackActive$.next(false);
        break;
      case this.groupsFeedService:
        this.latestFallbackActive$.next(false);
        break;
    }
  }
}
