import { DismissalService } from './../../../../common/services/dismissal.service';
import { TopFeedService } from '../subscribed.component';
import { Component, EventEmitter, Output } from '@angular/core';
import { ExperimentsService } from '../../../experiments/experiments.service';

@Component({
  selector: 'm-topHighlights',
  templateUrl: './top-highlights.component.html',
  styleUrls: ['./top-highlights.component.ng.scss'],
})
export class TopHighlightsComponent {
  @Output()
  onSeeMore: EventEmitter<void> = new EventEmitter();

  constructor(
    public topFeedService: TopFeedService,
    public experiments: ExperimentsService,
    private dismissal: DismissalService
  ) {}

  /**
   * dismisses the component
   * @returns { void }
   */
  dismiss(): void {
    this.dismissal.dismiss('top-highlights');
  }
}
