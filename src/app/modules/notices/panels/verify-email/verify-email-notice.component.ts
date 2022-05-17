import { Component } from '@angular/core';
import { EmailResendService } from '../../../../common/services/email-resend.service';

/**
 * Verify email notice - will stick to top of feed.
 */
@Component({
  selector: 'm-feedNotice--verifyEmail',
  templateUrl: 'verify-email-notice.component.html',
})
export class VerifyEmailNoticeComponent {
  constructor(protected emailResend: EmailResendService) {}

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public onPrimaryOptionClick($event: MouseEvent): void {
    this.emailResend.send();
  }
}