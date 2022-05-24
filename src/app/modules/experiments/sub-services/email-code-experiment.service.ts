import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether email code experiment is active ('minds-3055-email-codes'), based
 * upon whether the user has been assigned the experimental variant / the feature
 * flag is enabled.
 */
@Injectable({ providedIn: 'root' })
export class EmailCodeExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the experiment is active.
   * @returns { boolean } whether experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('minds-3055-email-codes', true);
  }
}
