import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';
import { Router } from '@angular/router';

import { Session } from './../../../services/session';
import { LoginReferrerService } from '../../../services/login-referrer.service';
import { MindsGroup } from '../../../modules/groups/v2/group.model';
import { Observable, Subscription, combineLatest, map, skip } from 'rxjs';
import { GroupMembershipService } from '../../services/group-membership.service';
import { ModernGroupsExperimentService } from '../../../modules/experiments/sub-services/modern-groups-experiment.service';
import { ButtonColor, ButtonSize } from '../button/button.component';
import {
  ClientMetaData,
  ClientMetaService,
} from '../../services/client-meta.service';
import { ClientMetaDirective } from '../../directives/client-meta.directive';

export type GroupMembershipButtonType =
  | 'join'
  | 'leave'
  | 'awaiting'
  | 'invited'
  | null;

export type GroupMembershipChangeOuput = { isMember: boolean };

/**
 * Click this button to join/leave a group,
 * accept/decline a group invitation (2 buttons are displayed),
 * or cancel a request to join a group.
 * (function changes depending on context)
 */
@Component({
  selector: 'm-group__membershipButton',
  templateUrl: './group-membership-button.component.html',
  styleUrls: ['./group-membership-button.component.ng.scss'],
  providers: [GroupMembershipService],
})
export class GroupMembershipButtonComponent implements OnDestroy {
  buttonType: GroupMembershipButtonType = null;

  private _group: MindsGroup;
  get group(): MindsGroup {
    return this._group;
  }
  @Input() set group(group: MindsGroup) {
    if (group) {
      this.service.setGroup(group);
    }
    this._group = group;
  }

  /**
   * Whether the button overlay styling should be applied
   */
  @Input()
  overlay: boolean = false;

  /**
   * If true, don't show any text on the buttons
   */
  @Input()
  iconOnly: boolean = false;

  /**
   * Customize button size
   */
  @Input()
  size: ButtonSize = 'small';

  /**
   * Customize button color
   * If not customized, it will be 'blue' when the button says 'join' and grey otherwise
   */
  @Input()
  customColor: ButtonColor;

  /**
   * If true, show "Join Group" instead of "Join", "Leave Group" instead of "Leave"
   */
  @Input()
  verbose: boolean = false;

  /**
   * The icon to show when user has joined the group
   * (only relevant when iconOnly is true)
   */
  @Input() isMemberIcon = 'close';

  @Output() onMembershipChange: EventEmitter<
    GroupMembershipChangeOuput
  > = new EventEmitter();

  subscriptions: Subscription[] = [];

  /** Whether a "join" click has already been recorded. */
  private joinClickRecorded: boolean = false;

  /**
   * Determine which button to show (if any)
   */
  public readonly buttonType$: Observable<
    GroupMembershipButtonType
  > = combineLatest([
    this.service.isMember$,
    this.service.isAwaiting$,
    this.service.isInvited$,
    this.service.isBanned$,
  ]).pipe(
    map(([isMember, isAwaiting, isInvited, isBanned]) => {
      if (!isMember && !isAwaiting && !isInvited && !isBanned) {
        this.buttonType = 'join';
      } else if (isMember) {
        this.buttonType = 'leave';
      } else if (isInvited) {
        this.buttonType = 'invited';
      } else if (isAwaiting) {
        this.buttonType = 'awaiting';
      } else {
        this.buttonType = null;
      }

      this.initIsMemberSubscription();

      return this.buttonType;
    })
  );

  constructor(
    public service: GroupMembershipService,
    public session: Session,
    private router: Router,
    private loginReferrer: LoginReferrerService,
    private modernGroupsExperiment: ModernGroupsExperimentService,
    private clientMetaService: ClientMetaService,
    @SkipSelf() @Optional() private parentClientMeta: ClientMetaDirective
  ) {}

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription?.unsubscribe();
    }
  }

  /**
   * Watch for changes in isMember$ and emit to parent components when it changes
   */
  initIsMemberSubscription(): void {
    this.subscriptions.push(
      this.service.isMember$.pipe(skip(1)).subscribe(is => {
        if (is) {
          this.recordClick();
        }
        this.onMembershipChange.emit({ isMember: is });
      })
    );
  }

  /**
   * Records a click on the group membership button.
   * @returns { void }
   */
  public recordClick(): void {
    if (this.joinClickRecorded) {
      return;
    }
    this.joinClickRecorded = true;

    const extraClientMetaData: Partial<ClientMetaData> = {};

    if (Boolean((this.group as any).boosted_guid)) {
      extraClientMetaData.campaign = this.group.urn;
    }

    this.clientMetaService.recordClick(
      this.group.guid,
      this.parentClientMeta,
      extraClientMetaData
    );
  }

  /**
   * Decide what the click should do, depending on button type
   *
   * Two buttons are displayed for 'invited' type: the primary one is 'acceptInvitation'
   */
  onPrimaryButtonClick($event) {
    switch (this.buttonType) {
      case 'join':
        this.join();
        break;
      case 'leave':
        this.leave();
        break;
      case 'awaiting':
        this.cancelRequest();
        break;
      case 'invited':
        this.acceptInvitation();
    }
  }

  /**
   * Join a group.
   * @param { MouseEvent } - mouse event.
   * @returns { void }
   */
  public async join(): Promise<void> {
    if (!this.session.isLoggedIn()) {
      let endpoint = this.modernGroupsExperiment.isActive()
        ? `/group/${this.group.guid}?join=true`
        : `/groups/profile/${this.group.guid}/feed?join=true`;

      this.loginReferrer.register(endpoint);
      this.router.navigate(['/login']);
      return;
    }

    this.service.join();
  }

  /**
   * Leave a group
   */
  public async leave() {
    this.service.leave();
  }

  /**
   * Accept an invitation to join a group
   */
  public async acceptInvitation() {
    this.service.acceptInvitation();
  }

  /**
   * Decline an invitation to join a group
   */
  public async declineInvitation() {
    this.service.declineInvitation();
  }

  /**
   * Cancel a group join request
   */
  public async cancelRequest() {
    this.service.cancelRequest();
  }

  get color(): ButtonColor {
    if (this.customColor) {
      return this.customColor;
    }
    if (this.buttonType === 'join') {
      return 'blue';
    } else {
      return 'grey';
    }
  }
}
