/// <reference types='codeceptjs' />
type activityFeedPage = typeof import('./pages/activityFeedPage');
type boostMarketingPage = typeof import('./pages/boostMarketingPage');
type channelPage = typeof import('./pages/channelPage');
type commonPage = typeof import('./pages/commonPage');
type devtoolsPage = typeof import('./pages/devtoolsPage');
type loginPage = typeof import('./pages/loginPage');
type newsfeedPage = typeof import('./pages/newsfeedPage');
type registerPage = typeof import('./pages/registerPage');
type rewardsMarketingPage = typeof import('./pages/rewardsMarketingPage');
type searchPage = typeof import('./pages/searchPage');
type settingsPage = typeof import('./pages/settingsPage');
type singleEntityPage = typeof import('./pages/singleEntityPage');
type boostConsolePage = typeof import('./pages/boostConsolePage');
type supermindConsolePage = typeof import('./pages/supermindConsolePage');
type supermindSettingsPage = typeof import('./pages/supermindSettingsPage');
type walletPage = typeof import('./pages/walletPage');
type tokenMarketingPage = typeof import('./pages/tokenMarketingPage');
type composerModalComponent = typeof import('./fragments/composerModalComponent');
type activityComponent = typeof import('./fragments/activityComponent');
type activityModalComponent = typeof import('./fragments/activityModalComponent');
type boostRotatorComponent = typeof import('./fragments/boostRotatorComponent');
type confirmationModalComponent = typeof import('./fragments/confirmationModalComponent');
type modalComponent = typeof import('./fragments/modalComponent');
type notificationsComponent = typeof import('./fragments/notificationsComponent');
type sidebarComponent = typeof import('./fragments/sidebarComponent');
type supermindOnboardingModalComponent = typeof import('./fragments/supermindOnboardingModalComponent');
type topbarComponent = typeof import('./fragments/topbarComponent');
type feedNoticeComponent = typeof import('./fragments/feedNoticeComponent');
type boostModalComponent = typeof import('./fragments/boostModalComponent');
type contentSettingsComponent = typeof import('./fragments/contentSettingsComponent');
type multiFactorModalComponent = typeof import('./fragments/multiFactorModalComponent');
type channelRecommendationsModalComponent = typeof import('./fragments/channelRecommendationsModalComponent');
type CookieHelper = import('./helpers/cookie-helper');
type CommonHelper = import('./helpers/common-helper');

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
    current: any;
    activityFeedPage: activityFeedPage;
    boostMarketingPage: boostMarketingPage;
    channelPage: channelPage;
    commonPage: commonPage;
    devtoolsPage: devtoolsPage;
    loginPage: loginPage;
    newsfeedPage: newsfeedPage;
    registerPage: registerPage;
    rewardsMarketingPage: rewardsMarketingPage;
    searchPage: searchPage;
    settingsPage: settingsPage;
    singleEntityPage: singleEntityPage;
    boostConsolePage: boostConsolePage;
    supermindConsolePage: supermindConsolePage;
    supermindSettingsPage: supermindSettingsPage;
    walletPage: walletPage;
    tokenMarketingPage: tokenMarketingPage;
    composerModalComponent: composerModalComponent;
    activityComponent: activityComponent;
    activityModalComponent: activityModalComponent;
    boostRotatorComponent: boostRotatorComponent;
    confirmationModalComponent: confirmationModalComponent;
    modalComponent: modalComponent;
    notificationsComponent: notificationsComponent;
    sidebarComponent: sidebarComponent;
    supermindOnboardingModalComponent: supermindOnboardingModalComponent;
    topbarComponent: topbarComponent;
    feedNoticeComponent: feedNoticeComponent;
    boostModalComponent: boostModalComponent;
    contentSettingsComponent: contentSettingsComponent;
    multiFactorModalComponent: multiFactorModalComponent;
    channelRecommendationsModalComponent: channelRecommendationsModalComponent;
  }
  interface Methods extends Playwright, CookieHelper, CommonHelper {}
  interface I extends WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
