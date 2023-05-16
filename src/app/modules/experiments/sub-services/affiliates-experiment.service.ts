import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Central service for handling logic around the affiliates experiment
 */
@Injectable({ providedIn: 'root' })
export class AffiliatesExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Whether experiment is active.
   * @returns { boolean } - true if experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('epic-304-affiliates', true);
  }
}