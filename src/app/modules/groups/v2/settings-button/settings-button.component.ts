import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { ReportCreatorComponent } from '../../../report/creator/creator.component';
import { Session } from '../../../../services/session';
import { ConfirmV2Component } from '../../../modals/confirm-v2/confirm.component';
import { ModalService } from '../../../../services/ux/modal.service';
import { BoostGroupExperimentService } from '../../../experiments/sub-services/boost-groups-experiment.service';
import { BoostModalV2LazyService } from '../../../boost/modal-v2/boost-modal-v2-lazy.service';
import { GroupService } from '../group.service';
import { Subscription } from 'rxjs';

/**
 * Dropdown menu with options to change various group behaviors.
 * Options are tailored to roles/permissions of the user.
 */
@Component({
  selector: 'm-group__settingsButton',
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.ng.scss'],
})
export class GroupSettingsButton implements OnInit, OnDestroy {
  group;

  public boostGroupsExperimentIsActive: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    public service: GroupService,
    public session: Session,
    private injector: Injector,
    public modalService: ModalService,
    private boostModal: BoostModalV2LazyService,
    private boostGroupsExperiment: BoostGroupExperimentService
  ) {}

  ngOnInit(): void {
    this.boostGroupsExperimentIsActive = this.boostGroupsExperiment.isActive();

    this.subscriptions.push(
      this.service.group$.subscribe(group => {
        this.group = group;
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Enable/disable notifications
   */
  async toggleNotifications(enable: boolean) {
    this.service.toggleNotifications(enable);
  }

  /**
   * Enable/disable whether the group is moderated
   */
  async toggleModeration(enable: boolean) {
    this.service.toggleModeration(enable);
  }

  /**
   * Enable/disable whether the group is private/public
   */
  async togglePrivate(enable: boolean) {
    this.service.togglePrivate(enable);
  }

  /**
   * Enable/disable showing boosts in the feed
   */
  async toggleShowBoosts(enable: boolean) {
    this.service.toggleShowBoosts(enable);
  }

  /**
   * Whether the group is nsfw
   */
  async toggleExplicit(enable) {
    this.service.toggleExplicit(enable);
  }

  /**
   * Opens the report modal to report a group
   */
  openReportModal() {
    return this.modalService.present(ReportCreatorComponent, {
      data: {
        entity: this.group,
      },
    });
  }

  /**
   * Opens confirmation of deletion modal
   * if deletion is possible
   * @returns { void }
   */
  public openDeleteConfirmationModal(): void {
    const modal = this.modalService.present(ConfirmV2Component, {
      data: {
        title: 'Delete Group',
        body:
          'Are you sure you want to delete this? This action cannot be undone.',
        confirmButtonColor: 'red',
        onConfirm: () => {
          modal.dismiss();
          this.service.delete();
        },
      },
      injector: this.injector,
    });
  }

  /**
   * On Boost group click, open, boost modal for group.
   * @returns { Promise<void> }
   */
  public async onBoostGroupClick(): Promise<void> {
    try {
      await this.boostModal.open(this.group);
    } catch (e) {
      // do nothing.
    }
  }
}
