import { Component, Input, OnInit } from '@angular/core';
import { Boost, BoostState, RejectionReason } from '../../../../boost.types';
import * as moment from 'moment';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { BoostModalLazyService } from '../../../../modal/boost-modal-lazy.service';
import { BoostAudience } from '../../../../modal-v2/boost-modal-v2.types';

/**
 * Row presented in boost console list items (where applicable)
 * It shows information related to the boost's performance, status,
 * rejection reason, etc.
 */
@Component({
  selector: 'm-boostConsole__statsBar',
  templateUrl: './stats-bar.component.html',
  styleUrls: ['./stats-bar.component.ng.scss'],
})
export class BoostConsoleStatsBarComponent implements OnInit {
  /** @var { Boost } boost - Boost object */
  @Input() boost: Boost = null;
  boostIsRejected: boolean = false;
  boostIsApproved: boolean = false;

  formattedStartDate: string = '';
  public rejectionReasons: RejectionReason[] = [];

  constructor(
    private mindsConfig: ConfigsService,
    private boostModal: BoostModalLazyService
  ) {}

  ngOnInit(): void {
    const status = this.boost?.boost_status;

    this.boostIsRejected = status === BoostState.REJECTED;
    this.boostIsApproved =
      status === BoostState.APPROVED || status === BoostState.COMPLETED;

    if (this.boostIsApproved) {
      this.formattedStartDate = this.formatDate(this.boost.approved_timestamp);
    }

    this.rejectionReasons = this.mindsConfig.get('boost')[
      'rejection_reasons'
    ] as RejectionReason[];
  }

  /**
   * Returns a formatted human-readable date string
   * @param timestampInSeconds
   */
  private formatDate(timestampInSeconds): string {
    return moment(timestampInSeconds * 1000).format('M/D/YY h:mma');
  }

  public getRejectionReasonLabel(): string | null {
    return this.rejectionReasons.filter(reason => {
      return reason.code === this.boost.rejection_reason;
    })[0]?.label;
  }

  async openBoostModal(): Promise<void> {
    try {
      await this.boostModal.open(this.boost.entity, {
        disabledSafeAudience: this.wrongAudience,
      });
      return;
    } catch (e) {
      // do nothing.
    }
  }

  // If the boost rejection reason is 1, then it was rejected bc of wrong audience
  get wrongAudience(): boolean {
    return this.boost?.rejection_reason === 1;
  }
}
