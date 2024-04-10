import { Inject, Injectable } from '@angular/core';
import * as Sentry from '@sentry/node';
import { Session } from '../../../services/session';
import { environment } from '../../../../environments/environment';
import { ConfigsService } from '../configs.service';
import { DiagnosticsInterface, SENTRY } from './diagnostics.service';

export { DiagnosticsService } from './diagnostics.service';

@Injectable()
export class ServerDiagnosticsService implements DiagnosticsInterface {
  readonly environment: string;
  constructor(
    protected session: Session,
    configs: ConfigsService,
    @Inject(SENTRY) protected sentry
  ) {
    this.environment = configs.get('environment');
  }

  listen() {
    this.session.getLoggedInUser((currentUser) => {
      this.setUser(currentUser);
    });
  }

  setUser(currentUser) {
    let userId = null;

    if (currentUser) {
      userId = currentUser.guid || null;
    }

    this.sentry.setUser({
      id: userId,
    });

    // console.info(
    //   `Diagnostics ID: ${userId} | Environment: ${this.environment}`
    // );
  }
}
