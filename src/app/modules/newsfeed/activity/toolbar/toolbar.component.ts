import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';
import { Session } from '../../../../services/session';
import { Router } from '@angular/router';
import { BoostModalV2LazyService } from '../../../boost/modal-v2/boost-modal-v2-lazy.service';
import { InteractionsModalService } from '../../interactions-modal/interactions-modal.service';
import { InteractionType } from '../../interactions-modal/interactions-modal-data.service';
import { ModalService } from '../../../../services/ux/modal.service';
import { CounterChangeFadeIn } from '../../../../animations';
import { PersistentFeedExperimentService } from '../../../experiments/sub-services/persistent-feed-experiment.service';
import { ExperimentsService } from '../../../experiments/experiments.service';
import { ToasterService } from '../../../../common/services/toaster.service';

/**
 * Button icons for quick-access actions (upvote, downvote, comment, remind, boost (for owners),
 * tip (for non-owners), displayed below activity post content.
 *
 * If 'interactions' is enabled, the toolbar also includes a second row that displays how many people reminded the post, upvoted the post, etc.
 */
@Component({
  selector: 'm-activity__toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['./toolbar.component.ng.scss'],
  animations: [CounterChangeFadeIn],
})
export class ActivityToolbarComponent {
  private entitySubscription: Subscription;
  private paywallBadgeSubscription: Subscription;

  entity: ActivityEntity;
  allowReminds: boolean = true;
  protected isOwner: boolean = false;
  protected supermindButtonExperiment: boolean = false;

  // Used to remove a downvoted item from the feed.
  @Output() onDownvote: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public service: ActivityService,
    public session: Session,
    private router: Router,
    private modalService: ModalService,
    private boostModal: BoostModalV2LazyService,
    private interactionsModalService: InteractionsModalService,
    private persistentFeedExperiment: PersistentFeedExperimentService,
    public experimentsService: ExperimentsService,
    private cd: ChangeDetectorRef,
    private toast: ToasterService
  ) {}

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;

        this.isOwner =
          this.session.getLoggedInUser() &&
          this.session.getLoggedInUser().guid === this.entity.ownerObj.guid;
      }
    );

    this.paywallBadgeSubscription = this.service.shouldShowPaywallBadge$.subscribe(
      (showBadge: boolean) => {
        // this.allowReminds = !showBadge;
      }
    );

    this.supermindButtonExperiment = this.experimentsService.hasVariation(
      'front-5812-supermind-button',
      true
    );
  }

  ngOnDestroy() {
    this.entitySubscription.unsubscribe();
    this.paywallBadgeSubscription.unsubscribe();
  }

  /**
   * Toggle showing of comments.
   * @returns { void }
   */
  public toggleComments(): void {
    // use snapshot of entity from activity service to ensure it is up to date.
    const entitySnapshot: ActivityEntity = this.service.entity$.getValue();
    if (!entitySnapshot.allow_comments) {
      this.toast.warn('This user has disabled comments on their post');

      if (!entitySnapshot['comments:count']) {
        return;
      }
    }

    if (
      this.service.displayOptions.fixedHeight ||
      (this.service.displayOptions.isFeed &&
        this.persistentFeedExperiment.isActive())
    ) {
      this.router.navigate([`/newsfeed/${this.entity.guid}`]);
      return;
    }

    this.service.displayOptions.showOnlyCommentsToggle = !this.service
      .displayOptions.showOnlyCommentsToggle;
  }

  async openBoostModal(e: MouseEvent): Promise<void> {
    try {
      await this.boostModal.open(this.entity);
      return;
    } catch (e) {
      // do nothing.
    }
  }

  async openInteractions(type: InteractionType) {
    // Access to metrics details modal is denied for logged out users
    // So don't try to open it
    if (!this.session.getLoggedInUser()) {
      return;
    }

    const guid =
      this.entity.entity_guid && type !== 'quotes' && type !== 'reminds'
        ? this.entity.entity_guid
        : this.entity.guid;
    await this.interactionsModalService.open(type, guid);
  }

  /**
   * Remove item from the feed.
   * @param { boolean } $event - true if was downvoted.
   * @returns { void }
   */
  public onThumbsDownChange($event: boolean): void {
    if ($event) {
      this.onDownvote.emit();
    }
    this.detectChanges();
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**
   * Show the metrics bar if at least one metric has data
   **/
  get showMetrics(): boolean {
    return (
      this.entity &&
      (this.entity['thumbs:up:count'] > 0 ||
        this.entity['thumbs:down:count'] > 0 ||
        this.entity?.reminds > 0 ||
        this.entity?.quotes > 0)
    );
  }
}
