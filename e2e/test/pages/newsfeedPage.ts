import { FeedNoticeComponent } from '../components/feedNoticeComponent';
import { FeedNoticeKey } from '../types/feednotice.types';
import { ActivityFeedPage } from './activityFeedPage';
const { I } = inject();

/**
 * Newsfeed page - common functions for newsfeed.
 */
export class NewsfeedPage extends ActivityFeedPage {
  public feedNoticeComponent = new FeedNoticeComponent();
  public newsfeedURI: string = '/newsfeed/subscriptions/latest';

  /**
   * Navigate to newsfeed by URL.
   * @returns { void }
   */
  public navigateToByUrl(): void {
    I.amOnPage(this.newsfeedURI);
  }

  get composerBox(): string {
    return `m-newsfeed m-composer .m-composer__trigger`;
  }

  openComposer() {
    I.waitForElement(this.composerBox, 5);
    I.click(this.composerBox);
  }

  /**
   * Whether newsfeed has a given feed notice.
   * @param { FeedNoticeKey } feedNoticeKey - key to check for.
   * @returns { void }
   */
  public hasFeedNotice(feedNoticeKey: FeedNoticeKey): void {
    this.feedNoticeComponent.has(feedNoticeKey);
  }

  /**
   * Click the visible feed notices primary action.
   * @returns { void }
   */
  public clickFeedNoticePrimaryAction(): void {
    this.feedNoticeComponent.clickPrimaryAction();
  }
}
