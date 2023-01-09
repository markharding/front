import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether onchain boosts experiment is active ('engine-2475-onchain-boosts').
 */
@Injectable({ providedIn: 'root' })
export class OnchainBoostsExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the experiment is active.
   * @returns { boolean } whether experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('engine-2475-onchain-boosts', true);
  }
}
