import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type ActivityEdge = EdgeInterface & {
  __typename?: 'ActivityEdge';
  cursor: Scalars['String']['output'];
  explicitVotes: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  node: ActivityNode;
  type: Scalars['String']['output'];
};

export type ActivityNode = NodeInterface & {
  __typename?: 'ActivityNode';
  /** Relevant for images/video posts. A blurhash to be used for preloading the image. */
  blurhash?: Maybe<Scalars['String']['output']>;
  commentsCount: Scalars['Int']['output'];
  guid: Scalars['String']['output'];
  hasVotedDown: Scalars['Boolean']['output'];
  hasVotedUp: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  impressionsCount: Scalars['Int']['output'];
  /** The activity has comments enabled */
  isCommentingEnabled: Scalars['Boolean']['output'];
  legacy: Scalars['String']['output'];
  message: Scalars['String']['output'];
  nsfw: Array<Scalars['Int']['output']>;
  nsfwLock: Array<Scalars['Int']['output']>;
  owner: UserNode;
  ownerGuid: Scalars['String']['output'];
  /** Unix timestamp representation of time created */
  timeCreated: Scalars['Int']['output'];
  /** ISO 8601 timestamp representation of time created */
  timeCreatedISO8601: Scalars['String']['output'];
  /** Relevant for images/video posts */
  title?: Maybe<Scalars['String']['output']>;
  urn: Scalars['String']['output'];
  votesDownCount: Scalars['Int']['output'];
  votesUpCount: Scalars['Int']['output'];
};

export type BoostEdge = EdgeInterface & {
  __typename?: 'BoostEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: BoostNode;
  type: Scalars['String']['output'];
};

export type BoostNode = NodeInterface & {
  __typename?: 'BoostNode';
  activity: ActivityNode;
  goalButtonText?: Maybe<Scalars['Int']['output']>;
  goalButtonUrl?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  legacy: Scalars['String']['output'];
};

export type BoostsConnection = ConnectionInterface & {
  __typename?: 'BoostsConnection';
  /** Gets Boost edges in connection. */
  edges: Array<BoostEdge>;
  pageInfo: PageInfo;
};

export type Connection = ConnectionInterface & {
  __typename?: 'Connection';
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type ConnectionInterface = {
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type Dismissal = {
  __typename?: 'Dismissal';
  dismissalTimestamp: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  userGuid: Scalars['String']['output'];
};

export type EdgeImpl = EdgeInterface & {
  __typename?: 'EdgeImpl';
  cursor: Scalars['String']['output'];
  node?: Maybe<NodeInterface>;
};

export type EdgeInterface = {
  cursor: Scalars['String']['output'];
  node?: Maybe<NodeInterface>;
};

export type FeedExploreTagEdge = EdgeInterface & {
  __typename?: 'FeedExploreTagEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: FeedExploreTagNode;
  type: Scalars['String']['output'];
};

export type FeedExploreTagNode = NodeInterface & {
  __typename?: 'FeedExploreTagNode';
  id: Scalars['ID']['output'];
  tag: Scalars['String']['output'];
};

export type FeedHeaderEdge = EdgeInterface & {
  __typename?: 'FeedHeaderEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: FeedHeaderNode;
  type: Scalars['String']['output'];
};

export type FeedHeaderNode = NodeInterface & {
  __typename?: 'FeedHeaderNode';
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export type FeedHighlightsConnection = ConnectionInterface &
  NodeInterface & {
    __typename?: 'FeedHighlightsConnection';
    /** Explicitly will only return activity edges */
    edges: Array<ActivityEdge>;
    id: Scalars['ID']['output'];
    pageInfo: PageInfo;
  };

export type FeedHighlightsEdge = EdgeInterface & {
  __typename?: 'FeedHighlightsEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: FeedHighlightsConnection;
  type: Scalars['String']['output'];
};

export type FeedNoticeEdge = EdgeInterface & {
  __typename?: 'FeedNoticeEdge';
  cursor: Scalars['String']['output'];
  node: FeedNoticeNode;
  type: Scalars['String']['output'];
};

export type FeedNoticeNode = NodeInterface & {
  __typename?: 'FeedNoticeNode';
  /** Whether the notice is dismissible */
  dismissible: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  /** The key of the notice that the client should render */
  key: Scalars['String']['output'];
  /** The location in the feed this notice should be displayed. top or inline. */
  location: Scalars['String']['output'];
};

export type GiftCardBalanceByProductId = {
  __typename?: 'GiftCardBalanceByProductId';
  balance: Scalars['Float']['output'];
  /** Returns the earliest expiring gift that contributes to this balance. */
  earliestExpiringGiftCard?: Maybe<GiftCardNode>;
  productId: GiftCardProductIdEnum;
};

export type GiftCardEdge = EdgeInterface & {
  __typename?: 'GiftCardEdge';
  cursor: Scalars['String']['output'];
  node: GiftCardNode;
};

export type GiftCardNode = NodeInterface & {
  __typename?: 'GiftCardNode';
  amount: Scalars['Float']['output'];
  balance: Scalars['Float']['output'];
  claimedAt?: Maybe<Scalars['Int']['output']>;
  claimedByGuid?: Maybe<Scalars['String']['output']>;
  expiresAt: Scalars['Int']['output'];
  guid?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  issuedAt: Scalars['Int']['output'];
  issuedByGuid?: Maybe<Scalars['String']['output']>;
  issuedByUsername?: Maybe<Scalars['String']['output']>;
  productId: GiftCardProductIdEnum;
  /**
   * Returns transactions relating to the gift card
   * TODO: Find a way to make this not part of the data model
   */
  transactions: GiftCardTransactionsConnection;
};

export type GiftCardNodeTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export enum GiftCardOrderingEnum {
  CreatedAsc = 'CREATED_ASC',
  CreatedDesc = 'CREATED_DESC',
  ExpiringAsc = 'EXPIRING_ASC',
  ExpiringDesc = 'EXPIRING_DESC',
}

export enum GiftCardProductIdEnum {
  Boost = 'BOOST',
  Plus = 'PLUS',
  Pro = 'PRO',
  Supermind = 'SUPERMIND',
}

export enum GiftCardStatusFilterEnum {
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
}

export type GiftCardTargetInput = {
  targetEmail?: InputMaybe<Scalars['String']['input']>;
  targetUserGuid?: InputMaybe<Scalars['String']['input']>;
  targetUsername?: InputMaybe<Scalars['String']['input']>;
};

export type GiftCardTransaction = NodeInterface & {
  __typename?: 'GiftCardTransaction';
  amount: Scalars['Float']['output'];
  boostGuid?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Int']['output'];
  giftCardGuid?: Maybe<Scalars['String']['output']>;
  giftCardIssuerGuid?: Maybe<Scalars['String']['output']>;
  giftCardIssuerName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  paymentGuid?: Maybe<Scalars['String']['output']>;
  refundedAt?: Maybe<Scalars['Int']['output']>;
};

export type GiftCardTransactionEdge = EdgeInterface & {
  __typename?: 'GiftCardTransactionEdge';
  cursor: Scalars['String']['output'];
  node: GiftCardTransaction;
};

export type GiftCardTransactionsConnection = ConnectionInterface & {
  __typename?: 'GiftCardTransactionsConnection';
  edges: Array<GiftCardTransactionEdge>;
  pageInfo: PageInfo;
};

export type GiftCardsConnection = ConnectionInterface & {
  __typename?: 'GiftCardsConnection';
  edges: Array<GiftCardEdge>;
  pageInfo: PageInfo;
};

export type GroupEdge = EdgeInterface & {
  __typename?: 'GroupEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: GroupNode;
  type: Scalars['String']['output'];
};

export type GroupNode = NodeInterface & {
  __typename?: 'GroupNode';
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  legacy: Scalars['String']['output'];
  nsfw: Array<Scalars['Int']['output']>;
  nsfwLock: Array<Scalars['Int']['output']>;
  /** Unix timestamp representation of time created */
  timeCreated: Scalars['Int']['output'];
  /** ISO 8601 timestamp representation of time created */
  timeCreatedISO8601: Scalars['String']['output'];
  urn: Scalars['String']['output'];
};

export type KeyValuePairInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  claimGiftCard: GiftCardNode;
  /** Mark an onboarding step for a user as completed. */
  completeOnboardingStep: OnboardingStepProgressState;
  createGiftCard: GiftCardNode;
  /** Dismiss a notice by its key. */
  dismiss: Dismissal;
  /** Sets onboarding state for the currently logged in user. */
  setOnboardingState: OnboardingState;
  updateAccount: Array<Scalars['String']['output']>;
};

export type MutationClaimGiftCardArgs = {
  claimCode: Scalars['String']['input'];
};

export type MutationCompleteOnboardingStepArgs = {
  additionalData?: InputMaybe<Array<KeyValuePairInput>>;
  stepKey: Scalars['String']['input'];
  stepType: Scalars['String']['input'];
};

export type MutationCreateGiftCardArgs = {
  amount: Scalars['Float']['input'];
  expiresAt?: InputMaybe<Scalars['Int']['input']>;
  productIdEnum: Scalars['Int']['input'];
  stripePaymentMethodId: Scalars['String']['input'];
  targetInput: GiftCardTargetInput;
};

export type MutationDismissArgs = {
  key: Scalars['String']['input'];
};

export type MutationSetOnboardingStateArgs = {
  completed: Scalars['Boolean']['input'];
};

export type MutationUpdateAccountArgs = {
  currentUsername: Scalars['String']['input'];
  newEmail?: InputMaybe<Scalars['String']['input']>;
  newUsername?: InputMaybe<Scalars['String']['input']>;
  resetMFA?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NewsfeedConnection = ConnectionInterface & {
  __typename?: 'NewsfeedConnection';
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type NodeImpl = NodeInterface & {
  __typename?: 'NodeImpl';
  id: Scalars['ID']['output'];
};

export type NodeInterface = {
  id: Scalars['ID']['output'];
};

export type OnboardingState = {
  __typename?: 'OnboardingState';
  completedAt?: Maybe<Scalars['Int']['output']>;
  startedAt: Scalars['Int']['output'];
  userGuid?: Maybe<Scalars['String']['output']>;
};

export type OnboardingStepProgressState = {
  __typename?: 'OnboardingStepProgressState';
  completedAt?: Maybe<Scalars['Int']['output']>;
  stepKey: Scalars['String']['output'];
  stepType: Scalars['String']['output'];
  userGuid?: Maybe<Scalars['String']['output']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  balance?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type PublisherRecsConnection = ConnectionInterface &
  NodeInterface & {
    __typename?: 'PublisherRecsConnection';
    dismissible: Scalars['Boolean']['output'];
    /**
     * TODO: clean this up to help with typing. Union types wont work due to the following error being outputted
     * `Error: ConnectionInterface.edges expects type "[EdgeInterface!]!" but PublisherRecsConnection.edges provides type "[UnionUserEdgeBoostEdge!]!".`
     */
    edges: Array<EdgeInterface>;
    id: Scalars['ID']['output'];
    pageInfo: PageInfo;
  };

export type PublisherRecsEdge = EdgeInterface & {
  __typename?: 'PublisherRecsEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: PublisherRecsConnection;
  type: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  activity: ActivityNode;
  /** Gets Boosts. */
  boosts: BoostsConnection;
  /** Get dismissal by key. */
  dismissalByKey?: Maybe<Dismissal>;
  /** Get all of a users dismissals. */
  dismissals: Array<Dismissal>;
  /** Returns an individual gift card */
  giftCard: GiftCardNode;
  /** Returns an individual gift card by its claim code. */
  giftCardByClaimCode: GiftCardNode;
  /**
   * Returns a list of gift card transactions for a ledger,
   * containing more information than just getting transactions,
   * including linked boost_guid's for Boost payments and injects
   * a transaction for the initial deposit.
   */
  giftCardTransactionLedger: GiftCardTransactionsConnection;
  /** Returns a list of gift card transactions */
  giftCardTransactions: GiftCardTransactionsConnection;
  /** Returns a list of gift cards belonging to a user */
  giftCards: GiftCardsConnection;
  /** The available balance a user has */
  giftCardsBalance: Scalars['Float']['output'];
  /** The available balances of each gift card types */
  giftCardsBalances: Array<GiftCardBalanceByProductId>;
  newsfeed: NewsfeedConnection;
  /** Gets onboarding state for the currently logged in user. */
  onboardingState?: Maybe<OnboardingState>;
  /** Get the currently logged in users onboarding step progress. */
  onboardingStepProgress: Array<OnboardingStepProgressState>;
  /** Get a list of payment methods for the logged in user */
  paymentMethods: Array<PaymentMethod>;
  search: SearchResultsConnection;
};

export type QueryActivityArgs = {
  guid: Scalars['String']['input'];
};

export type QueryBoostsArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  servedByGuid?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  targetAudience?: InputMaybe<Scalars['Int']['input']>;
  targetLocation?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryDismissalByKeyArgs = {
  key: Scalars['String']['input'];
};

export type QueryGiftCardArgs = {
  guid: Scalars['String']['input'];
};

export type QueryGiftCardByClaimCodeArgs = {
  claimCode: Scalars['String']['input'];
};

export type QueryGiftCardTransactionLedgerArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  giftCardGuid: Scalars['String']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryGiftCardTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryGiftCardsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeIssued?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<GiftCardOrderingEnum>;
  productId?: InputMaybe<GiftCardProductIdEnum>;
  statusFilter?: InputMaybe<GiftCardStatusFilterEnum>;
};

export type QueryNewsfeedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  algorithm: Scalars['String']['input'];
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  inFeedNoticesDelivered?: InputMaybe<Array<Scalars['String']['input']>>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryPaymentMethodsArgs = {
  productId?: InputMaybe<GiftCardProductIdEnum>;
};

export type QuerySearchArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter: SearchFilterEnum;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  mediaType: SearchMediaTypeEnum;
  nsfw?: InputMaybe<Array<SearchNsfwEnum>>;
  query: Scalars['String']['input'];
};

export enum SearchFilterEnum {
  Group = 'GROUP',
  Latest = 'LATEST',
  Top = 'TOP',
  User = 'USER',
}

export enum SearchMediaTypeEnum {
  All = 'ALL',
  Blog = 'BLOG',
  Image = 'IMAGE',
  Video = 'VIDEO',
}

export enum SearchNsfwEnum {
  Nudity = 'NUDITY',
  Other = 'OTHER',
  Pornography = 'PORNOGRAPHY',
  Profanity = 'PROFANITY',
  RaceReligion = 'RACE_RELIGION',
  Violence = 'VIOLENCE',
}

export type SearchResultsConnection = ConnectionInterface & {
  __typename?: 'SearchResultsConnection';
  /** The number of search records matching the query */
  count: Scalars['Int']['output'];
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type SearchResultsCount = {
  __typename?: 'SearchResultsCount';
  count: Scalars['Int']['output'];
};

export type UserEdge = EdgeInterface & {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: UserNode;
  type: Scalars['String']['output'];
};

export type UserNode = NodeInterface & {
  __typename?: 'UserNode';
  briefDescription: Scalars['String']['output'];
  /** The users public ETH address */
  ethAddress?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The number of views the users has received. Includes views from their posts */
  impressionsCount: Scalars['Int']['output'];
  /** The user is a founder (contributed to crowdfunding) */
  isFounder: Scalars['Boolean']['output'];
  /** The user is a member of Minds+ */
  isPlus: Scalars['Boolean']['output'];
  /** The user is a member of Minds Pro */
  isPro: Scalars['Boolean']['output'];
  /** You are subscribed to this user */
  isSubscribed: Scalars['Boolean']['output'];
  /** The user is subscribed to you */
  isSubscriber: Scalars['Boolean']['output'];
  /** The user is a verified */
  isVerified: Scalars['Boolean']['output'];
  legacy: Scalars['String']['output'];
  name: Scalars['String']['output'];
  nsfw: Array<Scalars['Int']['output']>;
  nsfwLock: Array<Scalars['Int']['output']>;
  /** The number of subscribers the user has */
  subscribersCount: Scalars['Int']['output'];
  /** The number of channels the user is subscribed to */
  subscriptionsCount: Scalars['Int']['output'];
  /** Unix timestamp representation of time created */
  timeCreated: Scalars['Int']['output'];
  /** ISO 8601 timestamp representation of time created */
  timeCreatedISO8601: Scalars['String']['output'];
  urn: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type DismissMutationVariables = Exact<{
  key: Scalars['String']['input'];
}>;

export type DismissMutation = {
  __typename?: 'Mutation';
  dismiss: {
    __typename?: 'Dismissal';
    userGuid: string;
    key: string;
    dismissalTimestamp: number;
  };
};

export type GetDismissalByKeyQueryVariables = Exact<{
  key: Scalars['String']['input'];
}>;

export type GetDismissalByKeyQuery = {
  __typename?: 'Query';
  dismissalByKey?: {
    __typename?: 'Dismissal';
    userGuid: string;
    key: string;
    dismissalTimestamp: number;
  } | null;
};

export type GetDismissalsQueryVariables = Exact<{ [key: string]: never }>;

export type GetDismissalsQuery = {
  __typename?: 'Query';
  dismissals: Array<{
    __typename?: 'Dismissal';
    userGuid: string;
    key: string;
    dismissalTimestamp: number;
  }>;
};

export type AdminUpdateAccountMutationVariables = Exact<{
  currentUsername: Scalars['String']['input'];
  newUsername?: InputMaybe<Scalars['String']['input']>;
  newEmail?: InputMaybe<Scalars['String']['input']>;
  resetMFA?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type AdminUpdateAccountMutation = {
  __typename?: 'Mutation';
  updateAccount: Array<string>;
};

export type GetBoostFeedQueryVariables = Exact<{
  targetLocation?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after: Scalars['Int']['input'];
  source: Scalars['String']['input'];
}>;

export type GetBoostFeedQuery = {
  __typename?: 'Query';
  boosts: {
    __typename?: 'BoostsConnection';
    edges: Array<{
      __typename?: 'BoostEdge';
      node: {
        __typename?: 'BoostNode';
        guid: string;
        activity: { __typename?: 'ActivityNode'; legacy: string };
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      endCursor?: string | null;
      startCursor?: string | null;
    };
  };
};

export type ClaimGiftCardMutationVariables = Exact<{
  claimCode: Scalars['String']['input'];
}>;

export type ClaimGiftCardMutation = {
  __typename?: 'Mutation';
  claimGiftCard: {
    __typename?: 'GiftCardNode';
    guid?: string | null;
    productId: GiftCardProductIdEnum;
    amount: number;
    balance: number;
    expiresAt: number;
    claimedAt?: number | null;
    claimedByGuid?: string | null;
  };
};

export type CreateGiftCardMutationVariables = Exact<{
  productIdEnum: Scalars['Int']['input'];
  amount: Scalars['Float']['input'];
  stripePaymentMethodId: Scalars['String']['input'];
  targetInput: GiftCardTargetInput;
}>;

export type CreateGiftCardMutation = {
  __typename?: 'Mutation';
  createGiftCard: { __typename?: 'GiftCardNode'; guid?: string | null };
};

export type GetGiftCardBalancesWithExpiryDataQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetGiftCardBalancesWithExpiryDataQuery = {
  __typename?: 'Query';
  giftCardsBalances: Array<{
    __typename?: 'GiftCardBalanceByProductId';
    productId: GiftCardProductIdEnum;
    balance: number;
    earliestExpiringGiftCard?: {
      __typename?: 'GiftCardNode';
      guid?: string | null;
      balance: number;
      expiresAt: number;
    } | null;
  }>;
};

export type GetGiftCardBalancesQueryVariables = Exact<{ [key: string]: never }>;

export type GetGiftCardBalancesQuery = {
  __typename?: 'Query';
  giftCardsBalances: Array<{
    __typename?: 'GiftCardBalanceByProductId';
    productId: GiftCardProductIdEnum;
    balance: number;
  }>;
};

export type GetGiftCardByCodeQueryVariables = Exact<{
  claimCode: Scalars['String']['input'];
}>;

export type GetGiftCardByCodeQuery = {
  __typename?: 'Query';
  giftCardByClaimCode: {
    __typename?: 'GiftCardNode';
    guid?: string | null;
    productId: GiftCardProductIdEnum;
    amount: number;
    balance: number;
    expiresAt: number;
    claimedAt?: number | null;
    issuedByUsername?: string | null;
  };
};

export type GetGiftCardTransactionsLedgerQueryVariables = Exact<{
  giftCardGuid: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetGiftCardTransactionsLedgerQuery = {
  __typename?: 'Query';
  giftCardTransactionLedger: {
    __typename?: 'GiftCardTransactionsConnection';
    edges: Array<{
      __typename?: 'GiftCardTransactionEdge';
      node: {
        __typename?: 'GiftCardTransaction';
        paymentGuid?: string | null;
        giftCardGuid?: string | null;
        amount: number;
        createdAt: number;
        refundedAt?: number | null;
        boostGuid?: string | null;
        id: string;
        giftCardIssuerGuid?: string | null;
        giftCardIssuerName?: string | null;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      endCursor?: string | null;
      startCursor?: string | null;
    };
  };
};

export type GetGiftCardQueryVariables = Exact<{
  guid: Scalars['String']['input'];
}>;

export type GetGiftCardQuery = {
  __typename?: 'Query';
  giftCard: {
    __typename?: 'GiftCardNode';
    guid?: string | null;
    productId: GiftCardProductIdEnum;
    amount: number;
    balance: number;
    expiresAt: number;
    claimedAt?: number | null;
  };
};

export type GetGiftCardsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<GiftCardOrderingEnum>;
  productId?: InputMaybe<GiftCardProductIdEnum>;
  statusFilter?: InputMaybe<GiftCardStatusFilterEnum>;
}>;

export type GetGiftCardsQuery = {
  __typename?: 'Query';
  giftCards: {
    __typename?: 'GiftCardsConnection';
    edges: Array<{
      __typename?: 'GiftCardEdge';
      node: {
        __typename?: 'GiftCardNode';
        guid?: string | null;
        productId: GiftCardProductIdEnum;
        balance: number;
        expiresAt: number;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      endCursor?: string | null;
    };
  };
};

export type FetchNewsfeedQueryVariables = Exact<{
  algorithm: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  inFeedNoticesDelivered?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
}>;

export type FetchNewsfeedQuery = {
  __typename?: 'Query';
  newsfeed: {
    __typename?: 'NewsfeedConnection';
    edges: Array<
      | {
          __typename?: 'ActivityEdge';
          explicitVotes: boolean;
          cursor: string;
          node: { __typename?: 'ActivityNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'BoostEdge';
          cursor: string;
          node: {
            __typename?: 'BoostNode';
            goalButtonUrl?: string | null;
            goalButtonText?: number | null;
            legacy: string;
            id: string;
          };
        }
      | {
          __typename?: 'EdgeImpl';
          cursor: string;
          node?:
            | { __typename?: 'ActivityNode'; legacy: string; id: string }
            | {
                __typename?: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename?: 'FeedExploreTagNode'; tag: string; id: string }
            | { __typename?: 'FeedHeaderNode'; text: string; id: string }
            | {
                __typename?: 'FeedHighlightsConnection';
                id: string;
                edges: Array<{
                  __typename?: 'ActivityEdge';
                  node: {
                    __typename?: 'ActivityNode';
                    id: string;
                    legacy: string;
                  };
                }>;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | {
                __typename?: 'FeedNoticeNode';
                location: string;
                key: string;
                dismissible: boolean;
                id: string;
              }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; id: string }
            | { __typename?: 'NodeImpl'; id: string }
            | {
                __typename?: 'PublisherRecsConnection';
                dismissible: boolean;
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: {
                        __typename?: 'ActivityNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename?: 'BoostNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'EdgeImpl';
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          }
                        | null;
                    }
                  | {
                      __typename?: 'FeedExploreTagEdge';
                      publisherNode: {
                        __typename?: 'FeedExploreTagNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHeaderEdge';
                      publisherNode: {
                        __typename?: 'FeedHeaderNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHighlightsEdge';
                      publisherNode: {
                        __typename?: 'FeedHighlightsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedNoticeEdge';
                      publisherNode: {
                        __typename?: 'FeedNoticeNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardEdge';
                      publisherNode: {
                        __typename?: 'GiftCardNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardTransactionEdge';
                      publisherNode: {
                        __typename?: 'GiftCardTransaction';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      publisherNode: {
                        __typename?: 'GroupNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'PublisherRecsEdge';
                      publisherNode: {
                        __typename?: 'PublisherRecsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'UserEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                >;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | { __typename?: 'UserNode'; id: string }
            | null;
        }
      | {
          __typename?: 'FeedExploreTagEdge';
          cursor: string;
          node: { __typename?: 'FeedExploreTagNode'; tag: string; id: string };
        }
      | {
          __typename?: 'FeedHeaderEdge';
          cursor: string;
          node: { __typename?: 'FeedHeaderNode'; text: string; id: string };
        }
      | {
          __typename?: 'FeedHighlightsEdge';
          cursor: string;
          node: {
            __typename?: 'FeedHighlightsConnection';
            id: string;
            edges: Array<{
              __typename?: 'ActivityEdge';
              node: { __typename?: 'ActivityNode'; id: string; legacy: string };
            }>;
            pageInfo: {
              __typename?: 'PageInfo';
              hasPreviousPage: boolean;
              hasNextPage: boolean;
              startCursor?: string | null;
              endCursor?: string | null;
            };
          };
        }
      | {
          __typename?: 'FeedNoticeEdge';
          cursor: string;
          node: {
            __typename?: 'FeedNoticeNode';
            location: string;
            key: string;
            dismissible: boolean;
            id: string;
          };
        }
      | {
          __typename?: 'GiftCardEdge';
          cursor: string;
          node: { __typename?: 'GiftCardNode'; id: string };
        }
      | {
          __typename?: 'GiftCardTransactionEdge';
          cursor: string;
          node: { __typename?: 'GiftCardTransaction'; id: string };
        }
      | {
          __typename?: 'GroupEdge';
          cursor: string;
          node: { __typename?: 'GroupNode'; id: string };
        }
      | {
          __typename?: 'PublisherRecsEdge';
          cursor: string;
          node: {
            __typename?: 'PublisherRecsConnection';
            dismissible: boolean;
            id: string;
            edges: Array<
              | {
                  __typename?: 'ActivityEdge';
                  publisherNode: { __typename?: 'ActivityNode'; id: string };
                }
              | {
                  __typename?: 'BoostEdge';
                  publisherNode: {
                    __typename?: 'BoostNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'EdgeImpl';
                  publisherNode?:
                    | { __typename?: 'ActivityNode'; id: string }
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'FeedExploreTagNode'; id: string }
                    | { __typename?: 'FeedHeaderNode'; id: string }
                    | { __typename?: 'FeedHighlightsConnection'; id: string }
                    | { __typename?: 'FeedNoticeNode'; id: string }
                    | { __typename?: 'GiftCardNode'; id: string }
                    | { __typename?: 'GiftCardTransaction'; id: string }
                    | { __typename?: 'GroupNode'; legacy: string; id: string }
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string }
                    | null;
                }
              | {
                  __typename?: 'FeedExploreTagEdge';
                  publisherNode: {
                    __typename?: 'FeedExploreTagNode';
                    id: string;
                  };
                }
              | {
                  __typename?: 'FeedHeaderEdge';
                  publisherNode: { __typename?: 'FeedHeaderNode'; id: string };
                }
              | {
                  __typename?: 'FeedHighlightsEdge';
                  publisherNode: {
                    __typename?: 'FeedHighlightsConnection';
                    id: string;
                  };
                }
              | {
                  __typename?: 'FeedNoticeEdge';
                  publisherNode: { __typename?: 'FeedNoticeNode'; id: string };
                }
              | {
                  __typename?: 'GiftCardEdge';
                  publisherNode: { __typename?: 'GiftCardNode'; id: string };
                }
              | {
                  __typename?: 'GiftCardTransactionEdge';
                  publisherNode: {
                    __typename?: 'GiftCardTransaction';
                    id: string;
                  };
                }
              | {
                  __typename?: 'GroupEdge';
                  publisherNode: {
                    __typename?: 'GroupNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'PublisherRecsEdge';
                  publisherNode: {
                    __typename?: 'PublisherRecsConnection';
                    id: string;
                  };
                }
              | {
                  __typename?: 'UserEdge';
                  publisherNode: {
                    __typename?: 'UserNode';
                    legacy: string;
                    id: string;
                  };
                }
            >;
            pageInfo: {
              __typename?: 'PageInfo';
              hasPreviousPage: boolean;
              hasNextPage: boolean;
              startCursor?: string | null;
              endCursor?: string | null;
            };
          };
        }
      | {
          __typename?: 'UserEdge';
          cursor: string;
          node: { __typename?: 'UserNode'; id: string };
        }
    >;
    pageInfo: {
      __typename?: 'PageInfo';
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type PageInfoFragment = {
  __typename?: 'PageInfo';
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
};

export type CompleteOnboardingStepMutationVariables = Exact<{
  stepKey: Scalars['String']['input'];
  stepType: Scalars['String']['input'];
  additionalData?: InputMaybe<Array<KeyValuePairInput> | KeyValuePairInput>;
}>;

export type CompleteOnboardingStepMutation = {
  __typename?: 'Mutation';
  completeOnboardingStep: {
    __typename?: 'OnboardingStepProgressState';
    userGuid?: string | null;
    stepKey: string;
    stepType: string;
    completedAt?: number | null;
  };
};

export type GetOnboardingStateQueryVariables = Exact<{ [key: string]: never }>;

export type GetOnboardingStateQuery = {
  __typename?: 'Query';
  onboardingState?: {
    __typename?: 'OnboardingState';
    userGuid?: string | null;
    startedAt: number;
    completedAt?: number | null;
  } | null;
};

export type GetOnboardingStepProgressQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetOnboardingStepProgressQuery = {
  __typename?: 'Query';
  onboardingStepProgress: Array<{
    __typename?: 'OnboardingStepProgressState';
    userGuid?: string | null;
    stepKey: string;
    stepType: string;
    completedAt?: number | null;
  }>;
};

export type SetOnboardingStateMutationVariables = Exact<{
  completed: Scalars['Boolean']['input'];
}>;

export type SetOnboardingStateMutation = {
  __typename?: 'Mutation';
  setOnboardingState: {
    __typename?: 'OnboardingState';
    userGuid?: string | null;
    startedAt: number;
    completedAt?: number | null;
  };
};

export type FetchPaymentMethodsQueryVariables = Exact<{
  giftCardProductId?: InputMaybe<GiftCardProductIdEnum>;
}>;

export type FetchPaymentMethodsQuery = {
  __typename?: 'Query';
  paymentMethods: Array<{
    __typename?: 'PaymentMethod';
    id: string;
    name: string;
    balance?: number | null;
  }>;
};

export type FetchSearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  filter: SearchFilterEnum;
  mediaType: SearchMediaTypeEnum;
  nsfw?: InputMaybe<Array<SearchNsfwEnum> | SearchNsfwEnum>;
  limit: Scalars['Int']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;

export type FetchSearchQuery = {
  __typename?: 'Query';
  search: {
    __typename?: 'SearchResultsConnection';
    edges: Array<
      | {
          __typename?: 'ActivityEdge';
          cursor: string;
          node: { __typename?: 'ActivityNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'BoostEdge';
          cursor: string;
          node: {
            __typename?: 'BoostNode';
            goalButtonUrl?: string | null;
            goalButtonText?: number | null;
            legacy: string;
            id: string;
          };
        }
      | {
          __typename?: 'EdgeImpl';
          cursor: string;
          node?:
            | { __typename?: 'ActivityNode'; legacy: string; id: string }
            | {
                __typename?: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename?: 'FeedExploreTagNode'; id: string }
            | { __typename?: 'FeedHeaderNode'; id: string }
            | { __typename?: 'FeedHighlightsConnection'; id: string }
            | {
                __typename?: 'FeedNoticeNode';
                location: string;
                key: string;
                id: string;
              }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; legacy: string; id: string }
            | { __typename?: 'NodeImpl'; id: string }
            | {
                __typename?: 'PublisherRecsConnection';
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: {
                        __typename?: 'ActivityNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename?: 'BoostNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'EdgeImpl';
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          }
                        | null;
                    }
                  | {
                      __typename?: 'FeedExploreTagEdge';
                      publisherNode: {
                        __typename?: 'FeedExploreTagNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHeaderEdge';
                      publisherNode: {
                        __typename?: 'FeedHeaderNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHighlightsEdge';
                      publisherNode: {
                        __typename?: 'FeedHighlightsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedNoticeEdge';
                      publisherNode: {
                        __typename?: 'FeedNoticeNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardEdge';
                      publisherNode: {
                        __typename?: 'GiftCardNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardTransactionEdge';
                      publisherNode: {
                        __typename?: 'GiftCardTransaction';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      publisherNode: {
                        __typename?: 'GroupNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'PublisherRecsEdge';
                      publisherNode: {
                        __typename?: 'PublisherRecsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'UserEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                >;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | { __typename?: 'UserNode'; legacy: string; id: string }
            | null;
        }
      | {
          __typename?: 'FeedExploreTagEdge';
          cursor: string;
          node: { __typename?: 'FeedExploreTagNode'; id: string };
        }
      | {
          __typename?: 'FeedHeaderEdge';
          cursor: string;
          node: { __typename?: 'FeedHeaderNode'; id: string };
        }
      | {
          __typename?: 'FeedHighlightsEdge';
          cursor: string;
          node: { __typename?: 'FeedHighlightsConnection'; id: string };
        }
      | {
          __typename?: 'FeedNoticeEdge';
          cursor: string;
          node: {
            __typename?: 'FeedNoticeNode';
            location: string;
            key: string;
            id: string;
          };
        }
      | {
          __typename?: 'GiftCardEdge';
          cursor: string;
          node: { __typename?: 'GiftCardNode'; id: string };
        }
      | {
          __typename?: 'GiftCardTransactionEdge';
          cursor: string;
          node: { __typename?: 'GiftCardTransaction'; id: string };
        }
      | {
          __typename?: 'GroupEdge';
          cursor: string;
          node: { __typename?: 'GroupNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'PublisherRecsEdge';
          cursor: string;
          node: {
            __typename?: 'PublisherRecsConnection';
            id: string;
            edges: Array<
              | {
                  __typename?: 'ActivityEdge';
                  publisherNode: { __typename?: 'ActivityNode'; id: string };
                }
              | {
                  __typename?: 'BoostEdge';
                  publisherNode: {
                    __typename?: 'BoostNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'EdgeImpl';
                  publisherNode?:
                    | { __typename?: 'ActivityNode'; id: string }
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'FeedExploreTagNode'; id: string }
                    | { __typename?: 'FeedHeaderNode'; id: string }
                    | { __typename?: 'FeedHighlightsConnection'; id: string }
                    | { __typename?: 'FeedNoticeNode'; id: string }
                    | { __typename?: 'GiftCardNode'; id: string }
                    | { __typename?: 'GiftCardTransaction'; id: string }
                    | { __typename?: 'GroupNode'; legacy: string; id: string }
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string }
                    | null;
                }
              | {
                  __typename?: 'FeedExploreTagEdge';
                  publisherNode: {
                    __typename?: 'FeedExploreTagNode';
                    id: string;
                  };
                }
              | {
                  __typename?: 'FeedHeaderEdge';
                  publisherNode: { __typename?: 'FeedHeaderNode'; id: string };
                }
              | {
                  __typename?: 'FeedHighlightsEdge';
                  publisherNode: {
                    __typename?: 'FeedHighlightsConnection';
                    id: string;
                  };
                }
              | {
                  __typename?: 'FeedNoticeEdge';
                  publisherNode: { __typename?: 'FeedNoticeNode'; id: string };
                }
              | {
                  __typename?: 'GiftCardEdge';
                  publisherNode: { __typename?: 'GiftCardNode'; id: string };
                }
              | {
                  __typename?: 'GiftCardTransactionEdge';
                  publisherNode: {
                    __typename?: 'GiftCardTransaction';
                    id: string;
                  };
                }
              | {
                  __typename?: 'GroupEdge';
                  publisherNode: {
                    __typename?: 'GroupNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'PublisherRecsEdge';
                  publisherNode: {
                    __typename?: 'PublisherRecsConnection';
                    id: string;
                  };
                }
              | {
                  __typename?: 'UserEdge';
                  publisherNode: {
                    __typename?: 'UserNode';
                    legacy: string;
                    id: string;
                  };
                }
            >;
            pageInfo: {
              __typename?: 'PageInfo';
              hasPreviousPage: boolean;
              hasNextPage: boolean;
              startCursor?: string | null;
              endCursor?: string | null;
            };
          };
        }
      | {
          __typename?: 'UserEdge';
          cursor: string;
          node: { __typename?: 'UserNode'; legacy: string; id: string };
        }
    >;
    pageInfo: {
      __typename?: 'PageInfo';
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type CountSearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  filter: SearchFilterEnum;
  mediaType: SearchMediaTypeEnum;
  nsfw?: InputMaybe<Array<SearchNsfwEnum> | SearchNsfwEnum>;
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;

export type CountSearchQuery = {
  __typename?: 'Query';
  search: {
    __typename?: 'SearchResultsConnection';
    count: number;
    pageInfo: {
      __typename?: 'PageInfo';
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export const PageInfoFragmentDoc = gql`
  fragment PageInfo on PageInfo {
    hasPreviousPage
    hasNextPage
    startCursor
    endCursor
  }
`;
export const DismissDocument = gql`
  mutation Dismiss($key: String!) {
    dismiss(key: $key) {
      userGuid
      key
      dismissalTimestamp
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DismissGQL extends Apollo.Mutation<
  DismissMutation,
  DismissMutationVariables
> {
  document = DismissDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetDismissalByKeyDocument = gql`
  query GetDismissalByKey($key: String!) {
    dismissalByKey(key: $key) {
      userGuid
      key
      dismissalTimestamp
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetDismissalByKeyGQL extends Apollo.Query<
  GetDismissalByKeyQuery,
  GetDismissalByKeyQueryVariables
> {
  document = GetDismissalByKeyDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetDismissalsDocument = gql`
  query GetDismissals {
    dismissals {
      userGuid
      key
      dismissalTimestamp
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetDismissalsGQL extends Apollo.Query<
  GetDismissalsQuery,
  GetDismissalsQueryVariables
> {
  document = GetDismissalsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AdminUpdateAccountDocument = gql`
  mutation AdminUpdateAccount(
    $currentUsername: String!
    $newUsername: String
    $newEmail: String
    $resetMFA: Boolean
  ) {
    updateAccount(
      currentUsername: $currentUsername
      newUsername: $newUsername
      newEmail: $newEmail
      resetMFA: $resetMFA
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AdminUpdateAccountGQL extends Apollo.Mutation<
  AdminUpdateAccountMutation,
  AdminUpdateAccountMutationVariables
> {
  document = AdminUpdateAccountDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetBoostFeedDocument = gql`
  query GetBoostFeed(
    $targetLocation: Int
    $first: Int
    $after: Int!
    $source: String!
  ) {
    boosts(
      targetLocation: $targetLocation
      first: $first
      after: $after
      source: $source
    ) {
      edges {
        node {
          guid
          activity {
            legacy
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetBoostFeedGQL extends Apollo.Query<
  GetBoostFeedQuery,
  GetBoostFeedQueryVariables
> {
  document = GetBoostFeedDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const ClaimGiftCardDocument = gql`
  mutation ClaimGiftCard($claimCode: String!) {
    claimGiftCard(claimCode: $claimCode) {
      guid
      productId
      amount
      balance
      expiresAt
      claimedAt
      claimedByGuid
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ClaimGiftCardGQL extends Apollo.Mutation<
  ClaimGiftCardMutation,
  ClaimGiftCardMutationVariables
> {
  document = ClaimGiftCardDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateGiftCardDocument = gql`
  mutation CreateGiftCard(
    $productIdEnum: Int!
    $amount: Float!
    $stripePaymentMethodId: String!
    $targetInput: GiftCardTargetInput!
  ) {
    createGiftCard(
      productIdEnum: $productIdEnum
      amount: $amount
      stripePaymentMethodId: $stripePaymentMethodId
      targetInput: $targetInput
    ) {
      guid
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateGiftCardGQL extends Apollo.Mutation<
  CreateGiftCardMutation,
  CreateGiftCardMutationVariables
> {
  document = CreateGiftCardDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGiftCardBalancesWithExpiryDataDocument = gql`
  query GetGiftCardBalancesWithExpiryData {
    giftCardsBalances {
      productId
      balance
      earliestExpiringGiftCard {
        guid
        balance
        expiresAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetGiftCardBalancesWithExpiryDataGQL extends Apollo.Query<
  GetGiftCardBalancesWithExpiryDataQuery,
  GetGiftCardBalancesWithExpiryDataQueryVariables
> {
  document = GetGiftCardBalancesWithExpiryDataDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGiftCardBalancesDocument = gql`
  query GetGiftCardBalances {
    giftCardsBalances {
      productId
      balance
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetGiftCardBalancesGQL extends Apollo.Query<
  GetGiftCardBalancesQuery,
  GetGiftCardBalancesQueryVariables
> {
  document = GetGiftCardBalancesDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGiftCardByCodeDocument = gql`
  query GetGiftCardByCode($claimCode: String!) {
    giftCardByClaimCode(claimCode: $claimCode) {
      guid
      productId
      amount
      balance
      expiresAt
      claimedAt
      issuedByUsername
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetGiftCardByCodeGQL extends Apollo.Query<
  GetGiftCardByCodeQuery,
  GetGiftCardByCodeQueryVariables
> {
  document = GetGiftCardByCodeDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGiftCardTransactionsLedgerDocument = gql`
  query GetGiftCardTransactionsLedger(
    $giftCardGuid: String!
    $first: Int
    $after: String
  ) {
    giftCardTransactionLedger(
      giftCardGuid: $giftCardGuid
      first: $first
      after: $after
    ) {
      edges {
        node {
          paymentGuid
          giftCardGuid
          amount
          createdAt
          refundedAt
          boostGuid
          id
          giftCardIssuerGuid
          giftCardIssuerName
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetGiftCardTransactionsLedgerGQL extends Apollo.Query<
  GetGiftCardTransactionsLedgerQuery,
  GetGiftCardTransactionsLedgerQueryVariables
> {
  document = GetGiftCardTransactionsLedgerDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGiftCardDocument = gql`
  query GetGiftCard($guid: String!) {
    giftCard(guid: $guid) {
      guid
      productId
      amount
      balance
      expiresAt
      claimedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetGiftCardGQL extends Apollo.Query<
  GetGiftCardQuery,
  GetGiftCardQueryVariables
> {
  document = GetGiftCardDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGiftCardsDocument = gql`
  query GetGiftCards(
    $first: Int
    $after: String
    $ordering: GiftCardOrderingEnum
    $productId: GiftCardProductIdEnum
    $statusFilter: GiftCardStatusFilterEnum
  ) {
    giftCards(
      first: $first
      after: $after
      ordering: $ordering
      productId: $productId
      statusFilter: $statusFilter
    ) {
      edges {
        node {
          guid
          productId
          balance
          expiresAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetGiftCardsGQL extends Apollo.Query<
  GetGiftCardsQuery,
  GetGiftCardsQueryVariables
> {
  document = GetGiftCardsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchNewsfeedDocument = gql`
  query FetchNewsfeed(
    $algorithm: String!
    $limit: Int!
    $cursor: String
    $inFeedNoticesDelivered: [String!]
  ) {
    newsfeed(
      algorithm: $algorithm
      first: $limit
      after: $cursor
      inFeedNoticesDelivered: $inFeedNoticesDelivered
    ) {
      edges {
        cursor
        ... on ActivityEdge {
          explicitVotes
        }
        node {
          id
          ... on ActivityNode {
            legacy
          }
          ... on BoostNode {
            goalButtonUrl
            goalButtonText
            legacy
          }
          ... on FeedNoticeNode {
            location
            key
            dismissible
          }
          ... on FeedHighlightsConnection {
            edges {
              node {
                id
                legacy
              }
            }
            pageInfo {
              ...PageInfo
            }
          }
          ... on PublisherRecsConnection {
            dismissible
            edges {
              publisherNode: node {
                id
                ... on UserNode {
                  legacy
                }
                ... on BoostNode {
                  legacy
                }
                ... on GroupNode {
                  legacy
                }
              }
            }
            pageInfo {
              ...PageInfo
            }
          }
          ... on FeedHeaderNode {
            text
          }
          ... on FeedExploreTagNode {
            tag
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${PageInfoFragmentDoc}
`;

@Injectable({
  providedIn: 'root',
})
export class FetchNewsfeedGQL extends Apollo.Query<
  FetchNewsfeedQuery,
  FetchNewsfeedQueryVariables
> {
  document = FetchNewsfeedDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CompleteOnboardingStepDocument = gql`
  mutation CompleteOnboardingStep(
    $stepKey: String!
    $stepType: String!
    $additionalData: [KeyValuePairInput!]
  ) {
    completeOnboardingStep(
      stepKey: $stepKey
      stepType: $stepType
      additionalData: $additionalData
    ) {
      userGuid
      stepKey
      stepType
      completedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CompleteOnboardingStepGQL extends Apollo.Mutation<
  CompleteOnboardingStepMutation,
  CompleteOnboardingStepMutationVariables
> {
  document = CompleteOnboardingStepDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetOnboardingStateDocument = gql`
  query GetOnboardingState {
    onboardingState {
      userGuid
      startedAt
      completedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetOnboardingStateGQL extends Apollo.Query<
  GetOnboardingStateQuery,
  GetOnboardingStateQueryVariables
> {
  document = GetOnboardingStateDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetOnboardingStepProgressDocument = gql`
  query GetOnboardingStepProgress {
    onboardingStepProgress {
      userGuid
      stepKey
      stepType
      completedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetOnboardingStepProgressGQL extends Apollo.Query<
  GetOnboardingStepProgressQuery,
  GetOnboardingStepProgressQueryVariables
> {
  document = GetOnboardingStepProgressDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetOnboardingStateDocument = gql`
  mutation SetOnboardingState($completed: Boolean!) {
    setOnboardingState(completed: $completed) {
      userGuid
      startedAt
      completedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetOnboardingStateGQL extends Apollo.Mutation<
  SetOnboardingStateMutation,
  SetOnboardingStateMutationVariables
> {
  document = SetOnboardingStateDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchPaymentMethodsDocument = gql`
  query FetchPaymentMethods($giftCardProductId: GiftCardProductIdEnum) {
    paymentMethods(productId: $giftCardProductId) {
      id
      name
      balance
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchPaymentMethodsGQL extends Apollo.Query<
  FetchPaymentMethodsQuery,
  FetchPaymentMethodsQueryVariables
> {
  document = FetchPaymentMethodsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchSearchDocument = gql`
  query FetchSearch(
    $query: String!
    $filter: SearchFilterEnum!
    $mediaType: SearchMediaTypeEnum!
    $nsfw: [SearchNsfwEnum!]
    $limit: Int!
    $cursor: String
  ) {
    search(
      query: $query
      filter: $filter
      mediaType: $mediaType
      nsfw: $nsfw
      first: $limit
      after: $cursor
    ) {
      edges {
        cursor
        node {
          id
          ... on ActivityNode {
            legacy
          }
          ... on UserNode {
            legacy
          }
          ... on GroupNode {
            legacy
          }
          ... on BoostNode {
            goalButtonUrl
            goalButtonText
            legacy
          }
          ... on FeedNoticeNode {
            location
            key
          }
          ... on PublisherRecsConnection {
            edges {
              publisherNode: node {
                id
                ... on UserNode {
                  legacy
                }
                ... on BoostNode {
                  legacy
                }
                ... on GroupNode {
                  legacy
                }
              }
            }
            pageInfo {
              ...PageInfo
            }
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${PageInfoFragmentDoc}
`;

@Injectable({
  providedIn: 'root',
})
export class FetchSearchGQL extends Apollo.Query<
  FetchSearchQuery,
  FetchSearchQueryVariables
> {
  document = FetchSearchDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CountSearchDocument = gql`
  query CountSearch(
    $query: String!
    $filter: SearchFilterEnum!
    $mediaType: SearchMediaTypeEnum!
    $nsfw: [SearchNsfwEnum!]
    $cursor: String
  ) {
    search(
      query: $query
      filter: $filter
      mediaType: $mediaType
      nsfw: $nsfw
      before: $cursor
    ) {
      count
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${PageInfoFragmentDoc}
`;

@Injectable({
  providedIn: 'root',
})
export class CountSearchGQL extends Apollo.Query<
  CountSearchQuery,
  CountSearchQueryVariables
> {
  document = CountSearchDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}