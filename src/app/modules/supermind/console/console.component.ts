import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SupermindExperimentService } from '../../experiments/sub-services/supermind-experiment.service';
import { SupermindConsoleListType } from '../supermind.types';
import { SupermindConsoleService } from './console.service';

/**
 * Supermind console component. Contains router outlet to display sub-routes like the inbox and outbox list.
 */
@Component({
  selector: 'm-supermind__console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.ng.scss'],
})
export class SupermindConsoleComponent implements OnInit, OnDestroy {
  /** @type { Subscription } routeSubscription - subscription to ActivatedRoutes firstChild.url */
  private routeSubscription: Subscription;

  /** @type { BehaviorSubject<SupermindConsoleListType> } listType$ - list type from service. */
  public readonly listType$: BehaviorSubject<SupermindConsoleListType> = this
    .service.listType$;

  /** @type { Observable<boolean> } isSingleSupermindPage$ - Whether this is a single Supermind page. */
  public readonly isSingleSupermindPage$: Observable<boolean> = this.service
    .isSingleSupermindPage$;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: SupermindConsoleService,
    private supermindExperiment: SupermindExperimentService
  ) {}

  ngOnInit(): void {
    // if experiment is not active, redirect to root.
    if (!this.supermindExperiment.isActive()) {
      this.router.navigate(['/']);
    }

    // on route change, set list type.
    this.routeSubscription = this.route.firstChild.url.subscribe(segments => {
      const param: string = segments[0].path;
      if (
        param === 'inbox' ||
        param === 'outbox' ||
        this.service.isNumericListType(param)
      ) {
        this.listType$.next(param);
        return;
      }
      this.listType$.next('inbox');
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  /**
   * Called on settings button click - navigates to settings page.
   * @param { MouseEvent } $event - click event.
   * @returns { void }
   */
  public onSettingsButtonClick($event: MouseEvent): void {
    this.router.navigate(['/settings/payments/supermind']);
  }

  /**
   * On back button click.
   * @returns { void }
   */
  public onBackClick(): void {
    this.router.navigate(['/supermind/inbox']);
  }
}
