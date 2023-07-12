import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DiscoveryComponent } from './discovery.component';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { CommonModule } from '../../common/common.module';
import { DiscoveryTrendsComponent } from './trends/trends.component';
import { DiscoverySearchComponent } from './search/search.component';
import { DiscoveryTagsComponent } from './tags/tags.component';
import { DiscoverySharedModule } from './discovery-shared.module';
import { DiscoveryFeedsComponent } from './feeds/feeds.component';
import { DiscoverySuggestionsComponent } from './suggestions/suggestions.component';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { LanguageModule } from '../language/language.module';
import { DiscoveryBoostFeedComponent } from './boost/boost-feed.component';
import { DiscoveryLatestFeedComponent } from './latest/latest.component';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';
import { ContentSettingsModule } from '../content-settings/content-settings.module';
import { DiscoveryTopComponent } from './top/top.component';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { PathMatch } from '../../common/types/angular.types';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DiscoveryComponent,
        pathMatch: 'prefix' as PathMatch,
        children: [
          { path: '', redirectTo: 'top', pathMatch: 'full' as PathMatch },
          {
            path: 'top',
            component: DiscoveryTopComponent,
            pathMatch: 'full' as PathMatch,
            data: {
              title: 'Discovery / Top',
              ogImage: '/assets/og-images/discovery-v3.png',
              ogImageWidth: 1200,
              ogImageHeight: 1200,
            },
          },
          {
            path: 'overview',
            component: DiscoveryTrendsComponent,
            data: {
              title: 'Discovery / Overview',
              ogImage: '/assets/og-images/discovery-v3.png',
              ogImageWidth: 1200,
              ogImageHeight: 1200,
            },
          },
          {
            path: 'trend/:guid',
            redirectTo: '/newsfeed/:guid',
          },
          {
            path: 'search',
            component: DiscoverySearchComponent,
          },
          {
            path: 'tags',
            children: [
              {
                path: '',
                redirectTo: 'your',
                pathMatch: 'full' as PathMatch,
              },
              {
                path: ':type',
                component: DiscoveryTagsComponent,
                data: {
                  title: 'Discovery / Tags',
                },
              },
            ],
          },
          {
            path: 'boost/feed',
            component: DiscoveryBoostFeedComponent,
            data: {
              title: 'Discovery / Boosted',
            },
          },
          {
            // deprecated route.
            path: 'supermind',
            redirectTo: '/supermind/explore',
          },
          {
            path: 'memberships/feed',
            component: DiscoveryLatestFeedComponent,
            data: {
              title: 'Discovery / Memberships',
              memberships: true,
            },
          },
          {
            path: 'feeds',
            children: [
              {
                path: '',
                redirectTo: 'preferred',
                pathMatch: 'full' as PathMatch,
              },
              {
                path: 'preferred',
                component: DiscoveryFeedsComponent,
              },
              {
                path: 'trending',
                component: DiscoveryFeedsComponent,
              },
            ],
          },
          {
            path: 'suggestions',
            children: [
              { path: '', redirectTo: 'user', pathMatch: 'full' as PathMatch },
              {
                path: 'user',
                component: DiscoverySuggestionsComponent,
              },
              {
                path: 'group',
                component: DiscoverySuggestionsComponent,
              },
            ],
          },
          {
            path: 'plus',
            data: { plus: true },
            children: [
              {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full' as PathMatch,
              },
              {
                path: 'overview',
                component: DiscoveryTrendsComponent,
                data: {
                  title: 'Minds+ / Overview',
                  plus: true,
                },
              },
              {
                path: 'trend/:guid',
                redirectTo: '/newsfeed/:guid',
              },
              {
                path: 'latest/feed',
                component: DiscoveryLatestFeedComponent,
                data: {
                  title: 'Minds+ / Latest',
                  plus: true,
                },
              },
              {
                path: 'search',
                component: DiscoverySearchComponent,
                data: { plus: true },
              },
              {
                path: 'tags',
                children: [
                  {
                    path: '',
                    redirectTo: 'your',
                    pathMatch: 'full' as PathMatch,
                  },
                  {
                    path: ':type',
                    component: DiscoveryTagsComponent,
                    data: {
                      title: 'Your Tags',
                      data: { plus: true },
                    },
                  },
                ],
              },
              {
                path: 'feeds',
                children: [
                  {
                    path: '',
                    redirectTo: 'preferred',
                    pathMatch: 'full' as PathMatch,
                  },
                  {
                    path: 'preferred',
                    component: DiscoveryFeedsComponent,
                    data: { plus: true },
                  },
                  {
                    path: 'trending',
                    component: DiscoveryFeedsComponent,
                    data: { plus: true },
                  },
                ],
              },
            ],
          },
        ],
      },
    ]),
    NgCommonModule,
    CommonModule,
    SuggestionsModule,
    ActivityModule,
    DiscoverySharedModule,
    HashtagsModule,
    LanguageModule,
    RouterModule,
    NewsfeedModule,
    ContentSettingsModule,
  ],
})
export class DiscoveryModule {}
