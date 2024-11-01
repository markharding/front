import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import {
  ClaimGiftCardGQL,
  ClaimGiftCardMutation,
  CreateGiftCardGQL,
  CreateGiftCardMutation,
  GetGiftCardBalancesGQL,
  GetGiftCardBalancesQuery,
  GetGiftCardBalancesWithExpiryDataGQL,
  GetGiftCardBalancesWithExpiryDataQuery,
  GetGiftCardByCodeGQL,
  GetGiftCardByCodeQuery,
  GiftCardBalanceByProductId,
  GiftCardNode,
  GiftCardProductIdEnum,
  GiftCardTargetInput,
} from '../../../graphql/generated.engine';
import { QueryOptionsAlone } from 'apollo-angular/types';
import { GiftRecipientGiftDuration } from '../wire/v2/creator/form/gift-recipient/gift-recipient-modal/gift-recipient-modal.types';
import { ConfigsService } from '../../common/services/configs.service';
import { GiftCardUpgradesConfig } from '../wallet/components/credits/send/product-upgrade-card/product-upgrade-card.types';

/**
 * Service for the retrieval and claiming of gift cards.
 */
@Injectable({ providedIn: 'root' })
export class GiftCardService {
  constructor(
    private getGiftCardByCodeGQL: GetGiftCardByCodeGQL,
    private getGiftCardBalancesGQL: GetGiftCardBalancesGQL,
    private getGiftCardBalancesWithExpiryDataGQL: GetGiftCardBalancesWithExpiryDataGQL,
    private claimGiftCardGQL: ClaimGiftCardGQL,
    private createGiftCardGQL: CreateGiftCardGQL,
    private config: ConfigsService
  ) {}

  /**
   * Get a gift card by its claim code.
   * @param { string } claimCode - claim code to get by.
   * @returns { Observable<GiftCardNode> } - gift card node or null if one was not found.
   */
  public getGiftCardByCode(claimCode: string): Observable<GiftCardNode> {
    return this.getGiftCardByCodeGQL.fetch({ claimCode: claimCode }).pipe(
      map((result: ApolloQueryResult<GetGiftCardByCodeQuery>): GiftCardNode => {
        const giftCard: GiftCardNode = result?.data
          ?.giftCardByClaimCode as GiftCardNode;
        if (!giftCard) {
          return null;
        }
        return giftCard;
      })
    );
  }

  /**
   * Get the users gift card balances.
   * @returns { Observable<GiftCardBalanceByProductId[]> } - the users various gift card balances.
   */
  public getGiftCardBalances(): Observable<GiftCardBalanceByProductId[]> {
    return this.getGiftCardBalancesGQL.fetch().pipe(
      map(
        (
          result: ApolloQueryResult<GetGiftCardBalancesQuery>
        ): GiftCardBalanceByProductId[] => {
          return result?.data?.giftCardsBalances;
        }
      )
    );
  }

  /**
   * Get the users gift card balances with data on the first expiring gift card for each product.
   * @returns { Observable<GiftCardBalanceByProductId[]> } - gift card balances for each product.
   */
  public getGiftCardBalancesWithExpiryData(
    queryOpts: QueryOptionsAlone = null
  ): Observable<GiftCardBalanceByProductId[]> {
    return this.getGiftCardBalancesWithExpiryDataGQL
      .fetch(null, queryOpts)
      .pipe(
        map(
          (
            result: ApolloQueryResult<GetGiftCardBalancesWithExpiryDataQuery>
          ): GiftCardBalanceByProductId[] => {
            return result?.data
              ?.giftCardsBalances as GiftCardBalanceByProductId[];
          }
        )
      );
  }

  /**
   * Claims a gift card, consuming the given claim code.
   * @param { string } claimCode - claim code to claim.
   * @returns { Observable<GiftCardNode> } - gift card node or null if the operation was not fully successful.
   */
  public claimGiftCard(claimCode: string): Observable<GiftCardNode> {
    return this.claimGiftCardGQL.mutate({ claimCode: claimCode }).pipe(
      map((result: ApolloQueryResult<ClaimGiftCardMutation>): GiftCardNode => {
        const giftCard: GiftCardNode = result?.data
          ?.claimGiftCard as GiftCardNode;
        if (!giftCard) {
          return null;
        }
        return giftCard;
      })
    );
  }

  /**
   * Create a gift card.
   * @param { GiftCardProductIdEnum } productIdEnumValue  - product id.
   * @param { number } amount - amount to credit.
   * @param { string } stripePaymentMethodId  - stripe payment method id.
   * @param { GiftCardTargetInput } targetInput - gift card target recipient.
   * @returns { Observable<string> } guid of the newly created gift card.
   */
  public createGiftCard(
    productIdEnumValue: GiftCardProductIdEnum,
    amount: number,
    stripePaymentMethodId: string,
    targetInput: GiftCardTargetInput
  ): Observable<string> {
    let productId: number;

    switch (productIdEnumValue) {
      case GiftCardProductIdEnum.Boost:
        productId = 0;
        break;
      case GiftCardProductIdEnum.Plus:
        productId = 1;
        break;
      case GiftCardProductIdEnum.Pro:
        productId = 2;
        break;
      case GiftCardProductIdEnum.Supermind:
        productId = 3;
        break;
      default:
        throw new Error('Unsupported productId for: ' + productIdEnumValue);
    }

    return this.createGiftCardGQL
      .mutate({
        productIdEnum: productId,
        amount: amount,
        stripePaymentMethodId: stripePaymentMethodId,
        targetInput: targetInput,
      })
      .pipe(
        map((result: ApolloQueryResult<CreateGiftCardMutation>): string => {
          return result?.data?.createGiftCard?.guid;
        })
      );
  }

  /**
   * Gets product name by product id.
   * @param { GiftCardProductIdEnum } productId - product id to get name for.
   * @param { boolean } plural - whether to return name in plural form.
   * @returns { string } name of product from enum for UI consumption.
   */
  public getProductNameByProductId(
    productId: GiftCardProductIdEnum,
    plural: boolean = true
  ): string {
    switch (productId) {
      case GiftCardProductIdEnum.Boost:
        if (plural) {
          return $localize`:@@GIFT_CARD__BOOST_CREDITS_TEXT:Boost Credits`;
        }
        return $localize`:@@GIFT_CARD__BOOST_CREDIT_TEXT:Boost Credit`;
      case GiftCardProductIdEnum.Plus:
        if (plural) {
          return $localize`:@@GIFT_CARD__PLUS_CREDITS_TEXT:Minds+ Credits`;
        }
        return $localize`:@@GIFT_CARD__PLUS_CREDIT_TEXT:Minds+ Credit`;
      case GiftCardProductIdEnum.Pro:
        if (plural) {
          return $localize`:@@GIFT_CARD__PRO_CREDITS_TEXT:Pro Credits`;
        }
        return $localize`:@@GIFT_CARD__PRO_CREDIT_TEXT:Pro Credit`;
      case GiftCardProductIdEnum.Supermind:
        if (plural) {
          return $localize`:@@GIFT_CARD__SUPERMIND_CREDITS_TEXT:Supermind Credits`;
        }
        return $localize`:@@GIFT_CARD__SUPERMIND_CREDIT_TEXT:Supermind Credit`;
      default:
        console.error('Unknown product id handled: ', productId);
        if (plural) {
          return $localize`:@@GIFT_CARD__OTHER_CREDITS_TEXT:Other Credits`;
        }
        return $localize`:@@GIFT_CARD__OTHER_CREDIT_TEXT:Other Credit`;
    }
  }

  /**
   * Gets the largest purchasable upgrade duration for a given product and gift card amount.
   * @param { GiftCardProductIdEnum } productId - id of the product.
   * @param { number } amount - amount of the gift card.
   * @returns { GiftCardProductIdEnum } - largest purchasable duration.
   */
  public getLargestPurchasableUpgradeDuration(
    productId: GiftCardProductIdEnum,
    amount: number
  ): GiftRecipientGiftDuration {
    const upgradesConfig: GiftCardUpgradesConfig =
      this.config.get<GiftCardUpgradesConfig>('upgrades');
    switch (productId) {
      case GiftCardProductIdEnum.Plus:
        if (amount >= upgradesConfig.plus.yearly.usd) {
          return GiftRecipientGiftDuration.YEAR;
        }
        if (amount >= upgradesConfig.plus.monthly.usd) {
          return GiftRecipientGiftDuration.MONTH;
        }
        return null;
      case GiftCardProductIdEnum.Pro:
        if (amount >= upgradesConfig.pro.yearly.usd) {
          return GiftRecipientGiftDuration.YEAR;
        }
        if (amount >= upgradesConfig.pro.monthly.usd) {
          return GiftRecipientGiftDuration.MONTH;
        }
        return null;
      default:
        return null;
    }
  }
}
