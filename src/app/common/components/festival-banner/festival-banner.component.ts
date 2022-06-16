import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FestivalBannerExperimentService } from '../../../modules/experiments/sub-services/festival-banner-experiment.service';
import { SessionsStorageService } from '../../../services/session-storage.service';
import { ConfigsService } from '../../services/configs.service';
import { ThemeService } from '../../services/theme.service';

/**
 * Banner promoting festival of ideas, full width and fixed to bottom of page.
 * Copied from join banner
 */
@Component({
  selector: 'm-festivalBanner',
  templateUrl: './festival-banner.component.html',
  styleUrls: ['./festival-banner.component.ng.scss'],
})
export class FestivalBannerComponent implements OnInit {
  // asset url for logo.
  public readonly cdnAssetsUrl: string = '';

  // whether modal has been dismissed in this session.
  public dismissed = true;

  constructor(
    private sessionStorage: SessionsStorageService,
    private festivalBannerExperiment: FestivalBannerExperimentService,
    private themes: ThemeService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.dismissed = !!this.sessionStorage.get('dismissed_festival_banner');
  }

  /**
   * Gets logo URL dependent on theme.
   * @returns { Observable<string> } Observable logo url.
   */
  get largeLogoUrl(): Observable<string> {
    return this.themes.isDark$.pipe(
      map((isDarkTheme: boolean) => {
        return `${this.cdnAssetsUrl}${
          !isDarkTheme
            ? 'assets/logos/logo-dark-mode.svg'
            : 'assets/logos/logo-light-mode.svg'
        }`;
      })
    );
  }

  /**
   * Whether festival banner should be shown.
   * @returns { boolean } - true if banner should be shown.
   */
  public shouldShow(): boolean {
    return this.festivalBannerExperiment.isActive() && !this.dismissed;
  }

  /**
   * Dismisses banner and sets record in session storage.
   * @returns { void }
   */
  public dismiss(): void {
    this.dismissed = true;
    this.sessionStorage.set('dismissed_festival_banner', true);
  }

  /**
   * Action button clicked - opens new window with ticketing page
   */
  public buyTickets(): void {
    window.open(
      'https://www.ticketmaster.com/event/3B005CB2CF161F8D?utm_source=minds&utm_medium=banner&utm_campaign=festival',
      '_blank'
    );
  }
}
