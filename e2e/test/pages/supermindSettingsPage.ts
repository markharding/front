const { I, sidebarComponent, supermindConsolePage } = inject();

class SupermindSettingsPage {
  // Selectors.
  private readonly minOffchainTokensInputSelector: string =
    '[data-ref=supermind-settings-min-tokens-input]';
  private readonly minCashInputSelector: string =
    '[data-ref=supermind-settings-min-cash-input]';
  private readonly submitButtonSelector: string =
    '[data-ref=supermind-settings-submit-button]';
  private readonly validationErrors: string =
    '[data-ref=supermind-settings-validation-error]';

  // Object containing text for validation error text.
  public readonly validationErrorText: { [key: string]: string } = {
    two_decimal_places: 'Must have less than 2 decimal places.',
    min_cash: 'Must be a minimum of $1',
  };

  /**
   * Navigate to console via sidebar.
   * @returns { void }
   */
  public async navigateTo(): Promise<void> {
    I.amOnPage('/settings/payments/supermind');
  }

  /**
   * Navigate to console via sidebar.
   * Note - due to minds#3997 the position of this element in the sidebar is unstable.
   * Do not use until front-5924-sidebar-v2-reorg has concluded, and at that point update the logic.
   * In the interim navigate directly via the navigateTo function of this class.
   * @returns { void }
   */
  public async navigateToViaSupermindConsole(): Promise<void> {
    sidebarComponent.expandSidebarMore();
    sidebarComponent.openSupermindConsole();

    supermindConsolePage.clickSettingsCog();
    I.waitForElement(this.minOffchainTokensInputSelector);
  }

  /**
   * Input minimum offchain tokens amount.
   * @param { string } amount - amount to input.
   * @returns { void }
   */
  public inputMinOffchainTokens(amount: string): void {
    I.seeElement(this.minOffchainTokensInputSelector);
    I.clearField(this.minOffchainTokensInputSelector);
    I.fillField(this.minOffchainTokensInputSelector, amount);
  }

  /**
   * Input minimum cash amount.
   * @param { string } amount - amount to input.
   * @returns { void }
   */
  public inputMinCash(amount: string): void {
    I.seeElement(this.minCashInputSelector);
    I.clearField(this.minCashInputSelector);
    I.fillField(this.minCashInputSelector, amount);
  }

  /**
   * Click on submit form button "Update Preferences".
   * @returns { void }
   */
  public clickSubmitButton(): void {
    I.click(this.submitButtonSelector);
  }

  /**
   * Check form values for a given field name match expected values.
   * @param { string } inputFieldName - key of input field.
   * @param { string } value - value to validate is present.
   * @returns { void }
   */
  public checkFormValues(inputFieldName: string, value: string): void {
    let inputFieldSelector;
    if (inputFieldName === 'min_cash') {
      inputFieldSelector = this.minCashInputSelector;
    } else if (inputFieldName === 'min_offchain_tokens') {
      inputFieldSelector = this.minOffchainTokensInputSelector;
    }
    I.seeInField(inputFieldSelector, value);
  }

  /**
   * Verify submit button is disabled.
   * @returns { void }
   */
  public checkSubmitButtonDisabled(): void {
    I.seeElement(`${this.submitButtonSelector} button[disabled]`);
  }

  /**
   * Check there is a validation error with given text.
   * @param { string } text - given text to validate is present.
   * @returns { void }
   */
  public checkValidationErrorHasText(text: string): void {
    I.seeElement(locate(this.validationErrors).withText(text));
  }
}

export = new SupermindSettingsPage();
