namespace RewardsMarketingSteps {
  const { I, rewardsMarketingPage } = inject();

  Before(() => {});

  When('I am on the rewards marketing page', () => {
    I.amOnPage(rewardsMarketingPage.rewardsURI);
  });

  Then('I see join rewards button', () => {
    I.waitForElement(rewardsMarketingPage.buyButton, 5);
    I.seeElement(rewardsMarketingPage.buyButton);
    I.seeElement(locate('div').withText('Buy Tokens'));
    I.click(rewardsMarketingPage.buyButton);
    I.seeElement(rewardsMarketingPage.rewardsModal);
  });

  After(() => {});
}