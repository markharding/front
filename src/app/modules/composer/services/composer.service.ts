import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  race,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mergeAll,
  pairwise,
  share,
  startWith,
  tap,
} from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';
import { ActivityEntity } from '../../newsfeed/activity/activity.service';
import { RichEmbed, RichEmbedService } from './rich-embed.service';
import { Attachment, AttachmentService } from './attachment.service';
import { AttachmentPreviewResource, PreviewService } from './preview.service';
import { VideoPoster } from './video-poster.service';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import { HashtagsFromStringService } from '../../../common/services/parse-hashtags.service';
import {
  AttachmentValidationPayload,
  AttachmentValidatorService,
} from './attachment-validator.service';
import { BoostRecommendationService } from '../../../common/services/boost-recommendation.service';
import { OnboardingV3Service } from '../../onboarding-v3/onboarding-v3.service';
import { UploaderService } from './uploader.service';
import {
  AccessIdSubjectValue,
  AttachmentsMetadataMappedValue,
  AttachmentSubjectValue,
  ComposerSize,
  Data,
  LicenseSubjectValue,
  MessageSubjectValue,
  MonetizationSubjectValue,
  NsfwSubjectValue,
  PendingMonetizationSubjectValue,
  PostToPermawebSubjectValue,
  RemindSubjectValue,
  RichEmbedMetadataMappedValue,
  RichEmbedSubjectValue,
  ScheduleSubjectValue,
  TagsSubjectValue,
  TitleSubjectValue,
} from './composer-data-types';

/**
 * Default values
 */
export const DEFAULT_MESSAGE_VALUE: MessageSubjectValue = '';
export const DEFAULT_TITLE_VALUE: TitleSubjectValue = null;
export const DEFAULT_REMIND_VALUE: RemindSubjectValue = null;
export const DEFAULT_ATTACHMENT_VALUE: AttachmentSubjectValue = null;
export const DEFAULT_VIDEOPOSTER_VALUE: VideoPoster = null;
export const DEFAULT_RICH_EMBED_VALUE: RichEmbedSubjectValue = null;
export const DEFAULT_NSFW_VALUE: NsfwSubjectValue = [];
export const DEFAULT_POST_TO_PERMAWEB_VALUE: PostToPermawebSubjectValue = false;
export const DEFAULT_MONETIZATION_VALUE: MonetizationSubjectValue = null;
export const DEFAULT_PENDING_MONETIZATION_VALUE: PendingMonetizationSubjectValue = null;
export const DEFAULT_TAGS_VALUE: TagsSubjectValue = [];
export const DEFAULT_SCHEDULE_VALUE: ScheduleSubjectValue = null;
export const DEFAULT_ACCESS_ID_VALUE: AccessIdSubjectValue = '2';
export const DEFAULT_LICENSE_VALUE: LicenseSubjectValue = 'all-rights-reserved';
export const DEFAULT_COMPOSER_SIZE: ComposerSize = 'full';

export * from './composer-data-types';

/**
 * Store/process class for activities composer. As it's used as a store it should be injected individually
 * on the components that require it using `providers` array.
 */
@Injectable()
export class ComposerService implements OnDestroy {
  /**
   * Message subject
   */
  public message$: BehaviorSubject<MessageSubjectValue> = new BehaviorSubject<
    MessageSubjectValue
  >(DEFAULT_MESSAGE_VALUE);

  /**
   * Title subject
   */
  readonly title$: BehaviorSubject<TitleSubjectValue> = new BehaviorSubject<
    TitleSubjectValue
  >(DEFAULT_TITLE_VALUE);

  /**
   * NSFW subject
   */
  readonly nsfw$: BehaviorSubject<NsfwSubjectValue> = new BehaviorSubject<
    NsfwSubjectValue
  >(DEFAULT_NSFW_VALUE);

  /**
   * Monetization subject
   */
  monetization$: BehaviorSubject<
    MonetizationSubjectValue
  > = new BehaviorSubject<MonetizationSubjectValue>(DEFAULT_MONETIZATION_VALUE);

  /**
   * Pending monetization subject
   */
  readonly pendingMonetization$: BehaviorSubject<
    PendingMonetizationSubjectValue
  > = new BehaviorSubject<PendingMonetizationSubjectValue>(
    DEFAULT_PENDING_MONETIZATION_VALUE
  );

  /**
   * Tags subject
   */
  readonly tags$: BehaviorSubject<TagsSubjectValue> = new BehaviorSubject<
    TagsSubjectValue
  >(DEFAULT_TAGS_VALUE);

  /**
   * Schedule subject
   */
  readonly schedule$: BehaviorSubject<
    ScheduleSubjectValue
  > = new BehaviorSubject<ScheduleSubjectValue>(DEFAULT_SCHEDULE_VALUE);

  /**
   * Access ID subject
   */
  readonly accessId$: BehaviorSubject<
    AccessIdSubjectValue
  > = new BehaviorSubject<AccessIdSubjectValue>(DEFAULT_ACCESS_ID_VALUE);

  /**
   * License subject
   */
  readonly license$: BehaviorSubject<LicenseSubjectValue> = new BehaviorSubject<
    LicenseSubjectValue
  >(DEFAULT_LICENSE_VALUE);

  /**
   * Remind subject
   */
  readonly remind$: BehaviorSubject<RemindSubjectValue> = new BehaviorSubject<
    RemindSubjectValue
  >(DEFAULT_REMIND_VALUE);

  /**
   * Attachments subject
   */
  readonly attachments$: BehaviorSubject<
    AttachmentSubjectValue
  > = new BehaviorSubject<AttachmentSubjectValue>(DEFAULT_ATTACHMENT_VALUE);

  /**
   * Video Poster subject
   */
  videoPoster$: BehaviorSubject<VideoPoster> = new BehaviorSubject(null);

  /**
   * Rich embed subject
   */
  readonly richEmbed$: BehaviorSubject<
    RichEmbedSubjectValue
  > = new BehaviorSubject<RichEmbedSubjectValue>(DEFAULT_RICH_EMBED_VALUE);

  /**
   * Preview subject (state)
   */
  readonly attachmentPreviews$: BehaviorSubject<
    AttachmentPreviewResource[]
  > = new BehaviorSubject<AttachmentPreviewResource[]>([]);

  /**
   * Preview subject (state)
   */
  readonly richEmbedPreview$: BehaviorSubject<RichEmbed | null> = new BehaviorSubject<RichEmbed | null>(
    null
  );

  /**
   * In progress flag subject (state)
   */
  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Is posting flag subject (state)
   */
  readonly isPosting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Attachment error subject (state)
   */
  readonly attachmentError$: BehaviorSubject<
    AttachmentValidationPayload
  > = new BehaviorSubject<AttachmentValidationPayload>(null);

  /**
   * Post-ability check subject (state)
   */
  readonly canPost$: Observable<boolean>;

  /**
   * Is this an edit operation? (state)
   */
  readonly isEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * If we are editing and we have a scheduled value
   */
  readonly canSchedule$ = combineLatest([this.schedule$, this.isEditing$]).pipe(
    map(([schedule, isEditing]) => {
      return !isEditing || schedule * 1000 > Date.now();
    })
  );

  /**
   * Are we currently moving part of this service's state to another place? (i.e. blog editor)
   */
  readonly isMovingContent$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Is group post subject
   */
  isGroupPost$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Too many tags subject
   */
  readonly tooManyTags$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Determines whether content is to be posted to Permaweb.
   */
  readonly postToPermaweb$: BehaviorSubject<boolean> = new BehaviorSubject<
    PostToPermawebSubjectValue
  >(DEFAULT_POST_TO_PERMAWEB_VALUE);

  /**
   * Tag count subject
   */
  readonly tagCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  /**
   * Size of composer
   */
  readonly size$: BehaviorSubject<ComposerSize> = new BehaviorSubject<
    ComposerSize
  >(DEFAULT_COMPOSER_SIZE);

  /**
   * URL in the message
   */
  readonly messageUrl$: Observable<string>;

  /**
   * Data structure observable
   */
  readonly data$: Observable<Data>;

  /**
   * Subscription to data structure observable
   */
  protected readonly dataSubscription: Subscription;

  /**
   * Subscription to pending monetization observable
   */
  protected readonly pendingMonetizationSubscription: Subscription;

  /**
   * Subscription to a rich embed extractor observable
   */
  protected readonly richEmbedExtractorSubscription: Subscription;

  /**
   * Container GUID for this instance
   */
  protected containerGuid: string | null = null;

  /**
   * If we're editing, this holds a clone of the original activity
   */
  public entity: any = null;

  /**
   * Current payload to be consumed by DTO builder
   */
  protected payload: any = null;

  /**
   * message input selection range
   */
  public selection$: BehaviorSubject<{
    start: number;
    end: number;
  }> = new BehaviorSubject({ start: 0, end: 0 });

  /**
   * Sets up data observable and its subscription
   *
   * @param api
   * @param attachment
   * @param richEmbed
   * @param preview
   */
  constructor(
    protected api: ApiService,
    protected attachment: AttachmentService,
    protected richEmbed: RichEmbedService,
    protected preview: PreviewService,
    protected feedsUpdate: FeedsUpdateService,
    private hashtagsFromString: HashtagsFromStringService,
    private attachmentValidator: AttachmentValidatorService,
    private boostRecommendationService: BoostRecommendationService,
    private onboardingService: OnboardingV3Service,
    private uploaderService: UploaderService
  ) {
    // Setup data stream using the latest subject values
    // This should emit whenever any subject changes.

    this.data$ = combineLatest<
      [
        MessageSubjectValue,
        TitleSubjectValue,
        NsfwSubjectValue,
        MonetizationSubjectValue,
        TagsSubjectValue,
        ScheduleSubjectValue,
        AccessIdSubjectValue,
        LicenseSubjectValue,
        AttachmentsMetadataMappedValue,
        RichEmbedMetadataMappedValue,
        VideoPoster,
        PostToPermawebSubjectValue,
        RemindSubjectValue
      ]
    >([
      this.message$.pipe(distinctUntilChanged()),
      this.title$.pipe(distinctUntilChanged()),
      this.nsfw$, // TODO: Implement custom distinctUntilChanged comparison
      this.monetization$, // TODO: Implement custom distinctUntilChanged comparison
      this.tags$, // TODO: Implement custom distinctUntilChanged comparison
      this.schedule$, // TODO: Implement custom distinctUntilChanged comparison
      this.accessId$.pipe(
        distinctUntilChanged(),
        tap(accessId => {
          // This will trigger a warning about an illegal access ID operation
          if (this.containerGuid && this.containerGuid !== accessId) {
            console.warn(
              "Access ID will be overriden by container's GUID",
              this.containerGuid
            );
          }
        })
      ),
      this.license$.pipe(distinctUntilChanged()),
      /**
       * Builds attachments guids
       */
      combineLatest([
        this.uploaderService.files$.pipe(
          startWith([]), // will not ever resolve combineLatest unless we do this
          map(fileUpload => {
            if (!fileUpload) return [];

            this.setPreview(fileUpload);

            return fileUpload.map(fileUpload => fileUpload.guid);
          })
        ),
        this.attachments$.pipe(
          map(attachments => {
            if (!attachments) return [];

            this.setPreview(attachments);

            return attachments.map(attachment => attachment.guid);
          })
        ),
      ]).pipe(
        map(([uploadedGuids, existingGuids]) => [
          ...uploadedGuids,
          ...existingGuids,
        ])
      ),
      /**
       * Builds rich embed
       */
      this.richEmbed$.pipe(
        // Only react to rich-embed URL changes
        distinctUntilChanged(),

        // Trigger in progress state of indeterminate length.
        tap(() => this.setProgress(true)),

        // Call the engine endpoint to resolve the URL, debouncing the request to avoid server overload,
        this.richEmbed.resolve(200),

        // Set preview
        tap((richEmbed: RichEmbed) => this.richEmbedPreview$.next(richEmbed)),

        // Set in progress state to null.
        tap(() => this.inProgress$.next(null))

        // Value will be either a RichEmbed interface object or null
      ),
      this.videoPoster$.pipe(distinctUntilChanged()),
      this.postToPermaweb$,
      this.remind$.pipe(distinctUntilChanged()),
    ]).pipe(
      map(
        // Create an JSON object based on an array of Subject values
        ([
          message,
          title,
          nsfw,
          monetization,
          tags,
          schedule,
          accessId,
          license,
          attachmentGuids,
          richEmbed,
          videoPoster,
          postToPermaweb,
          remind,
        ]) => ({
          message,
          title,
          nsfw,
          monetization,
          tags,
          schedule,
          accessId,
          license,
          attachmentGuids,
          richEmbed,
          videoPoster,
          postToPermaweb,
          remind,
        })
      ),
      tap(values => {
        ////
        // TODO: move this to its own pipe, it shouldn't be in a tap!
        ////

        // get tags from title and body.
        const bodyTags = this.hashtagsFromString
          .parseHashtagsFromString(values.message)
          .concat(
            this.hashtagsFromString.parseHashtagsFromString(values.title)
          );

        const cashTags = this.hashtagsFromString
          .parseCashtagsFromString(values.message)
          .concat(
            this.hashtagsFromString.parseCashtagsFromString(values.title)
          );

        // merge into one array.
        const tags = [...bodyTags, ...values.tags, ...cashTags];

        // get unique tags.
        const uniqueTags = tags.filter(function(item, pos) {
          return tags.indexOf(item) == pos;
        });

        const tagCount = uniqueTags.length;

        this.tagCount$.next(tagCount);

        const tooManyTags = tagCount > 5;

        this.tooManyTags$.next(tooManyTags);
      }),
      share()
    );

    /**
     * Below is the logic which determines the state of the post button
     */
    this.canPost$ = combineLatest([
      this.tooManyTags$,
      this.data$,
      this.uploaderService.isUploadingFinished$,
    ]).pipe(
      map(([tooManyTags, data, isUploadingFinished]) => {
        return Boolean(
          !tooManyTags &&
            isUploadingFinished &&
            (data.message || data.richEmbed || data.attachmentGuids?.length)
        );
      })
    );

    // Subscribe to data stream and re-build API payload when it changes

    this.dataSubscription = this.data$.subscribe(data => {
      return this.buildPayload(data);
    });

    // Subscribe to pending monetization and format monetization$
    this.pendingMonetizationSubscription = this.pendingMonetization$.subscribe(
      pendingMonetization => {
        if (pendingMonetization) {
          this.monetization$.next({
            support_tier: pendingMonetization.support_tier,
          });
        } else {
          this.monetization$.next(null);
        }
      }
    );

    // Subscribe to message and extract any URL it finds
    this.messageUrl$ = this.message$.pipe(
      map(message => this.richEmbed.extract(message))
    );

    // Subscribe to message URL and rich embed in order to know if a URL should be resolved

    this.richEmbedExtractorSubscription = combineLatest([
      this.messageUrl$.pipe(distinctUntilChanged()),
      // get last 2 emissions - start with '' for first emission.
      this.richEmbed$.pipe(distinctUntilChanged(), startWith(''), pairwise()),
      this.attachments$.pipe(distinctUntilChanged()),
      this.remind$.pipe(distinctUntilChanged()),
    ])
      .pipe(debounceTime(500))
      .subscribe(
        ([messageUrl, [previousRichEmbed, richEmbed], attachment, remind]) => {
          // Use current message URL when:
          // a) there's no rich embed already set; or
          // b) rich embed's type is a string (locally extracted); or
          // c) loaded activity don't have the entity GUID set (which mean is a blog)
          //
          // It won't emit an empty extraction to allow keeping embeds when deleting text
          // thanks to debounceTime pipe above.
          //
          // Be very careful, as it depends on the same observable we're modifying
          if (
            (!richEmbed ||
              typeof richEmbed === 'string' ||
              !richEmbed.entityGuid) &&
            !attachment &&
            !remind
          ) {
            if (!this.canEditMetadata()) {
              return;
            }

            if (messageUrl && messageUrl !== previousRichEmbed) {
              this.richEmbed$.next(messageUrl);
            }
          }

          // If there is an attachment already provided then reset the rich embed
          // as we can't have both values
          if ((richEmbed && attachment) || (richEmbed && remind)) {
            this.richEmbed$.next(DEFAULT_RICH_EMBED_VALUE);
          }
        }
      );
  }

  /**
   * Runs when dependant component is destroyed
   */
  ngOnDestroy(): void {
    this.tearDown();
  }

  /**
   * Destroys the service and its state
   */
  tearDown(): void {
    // Reset state and free resources
    this.reset();

    // Unsubscribe to data stream
    this.dataSubscription.unsubscribe();

    // Unsubscribe from pending monetization
    this.pendingMonetizationSubscription.unsubscribe();

    // Unsubscribe from rich embed extractor
    this.richEmbedExtractorSubscription.unsubscribe();
  }

  /**
   * Sets the container GUID for this instance
   * @param containerGuid
   */
  setContainerGuid(containerGuid: string | null) {
    this.containerGuid = containerGuid || null;
    if (containerGuid) {
      this.isGroupPost$.next(true);
    }
    return this;
  }

  /**
   * Gets the container GUID for this instance
   */
  getContainerGuid(): string | null {
    return this.containerGuid || null;
  }

  /**
   * Resets composer data and state
   */
  reset(): void {
    // Reset data
    this.message$.next(DEFAULT_MESSAGE_VALUE);
    this.title$.next(DEFAULT_TITLE_VALUE);
    this.nsfw$.next(DEFAULT_NSFW_VALUE);
    this.monetization$.next(DEFAULT_MONETIZATION_VALUE);
    this.tags$.next(DEFAULT_TAGS_VALUE);
    this.schedule$.next(DEFAULT_SCHEDULE_VALUE);
    this.accessId$.next(DEFAULT_ACCESS_ID_VALUE);
    this.license$.next(DEFAULT_LICENSE_VALUE);
    this.attachments$.next(DEFAULT_ATTACHMENT_VALUE);
    this.richEmbed$.next(DEFAULT_RICH_EMBED_VALUE);
    this.videoPoster$.next(DEFAULT_VIDEOPOSTER_VALUE);
    this.remind$.next(DEFAULT_REMIND_VALUE);

    // Reset state
    this.inProgress$.next(false);
    this.isPosting$.next(false);
    this.attachmentError$.next(null);
    this.isEditing$.next(false);
    this.isMovingContent$.next(false);
    this.isGroupPost$.next(false);

    // Reset preview (state + blob URL)
    this.setPreview(null);

    // Reset rich embed preview
    this.richEmbedPreview$.next(null);

    this.postToPermaweb$.next(false);

    // Reset upload state
    this.uploaderService.reset();

    // Reset original source
    this.entity = null;
  }

  /**
   * Loads an activity from API payload
   *
   * @param activity
   */
  load(activity: any) {
    if (!activity) {
      return;
    }

    this.reset();

    // Save a clone of the original activity that was loaded
    this.entity = JSON.parse(JSON.stringify(activity));

    // Build the fields
    const message = activity.message || DEFAULT_MESSAGE_VALUE;
    const title = activity.title || DEFAULT_TITLE_VALUE;
    const nsfw = activity.nsfw || DEFAULT_NSFW_VALUE;
    const monetization = activity.wire_threshold || DEFAULT_MONETIZATION_VALUE;
    const tags = activity.tags || DEFAULT_TAGS_VALUE;
    const schedule =
      activity.time_created && activity.time_created * 1000 > Date.now() + 15000
        ? activity.time_created
        : null;
    const accessId =
      activity.access_id !== null
        ? activity.access_id
        : DEFAULT_ACCESS_ID_VALUE;
    const license = activity.license || DEFAULT_LICENSE_VALUE;

    // Build attachment and rich embed data structure

    let attachments: AttachmentSubjectValue = DEFAULT_ATTACHMENT_VALUE;
    let richEmbed: RichEmbedSubjectValue = DEFAULT_RICH_EMBED_VALUE;
    let videoPoster: VideoPoster;

    if (activity.custom_type === 'batch') {
      attachments = activity.custom_data.map(item => {
        return {
          type: 'image',
          guid: item.guid,
        } as Attachment;
      });
    } else if (activity.custom_type === 'video') {
      attachments = [
        {
          type: 'video',
          guid: activity.entity_guid,
        } as Attachment,
      ];
      videoPoster = { url: activity.custom_data.thumbnail_src };
    } else if (activity.entity_guid || activity.perma_url) {
      // Rich embeds (blogs included)
      richEmbed = {
        entityGuid: activity.entity_guid || null,
        url: activity.perma_url,
        title: activity.title || '',
        description: activity.blurb || '',
        thumbnail: activity.thumbnail_src || '',
      };
    }

    // Priority service state elements

    this.remind$.next(activity.remind_object || null);
    this.attachments$.next(attachments);
    this.richEmbed$.next(richEmbed);
    this.videoPoster$.next(videoPoster);

    // Apply them to the service state

    this.message$.next(message);
    this.title$.next(title);
    this.nsfw$.next(nsfw);
    this.monetization$.next(monetization);
    this.tags$.next(tags);
    this.schedule$.next(schedule);
    this.accessId$.next(accessId);
    this.license$.next(license);

    // Define container

    if (typeof activity.container_guid !== 'undefined') {
      this.setContainerGuid(activity.containerGuid);
      this.isGroupPost$.next(true);
    }

    this.isEditing$.next(true);
  }

  /**
   * Updates the preview. Frees resources, if needed.
   * @param attachment
   */
  setPreview(attachments: AttachmentSubjectValue) {
    const currentPreviews = this.attachmentPreviews$.getValue();

    for (let i in currentPreviews) {
      this.preview.prune(currentPreviews[i]);
    }

    this.attachmentPreviews$.next(this.preview.build(attachments));
  }

  /**
   * Deletes the current attachment, if any
   */
  removeAttachment() {
    if (!this.canEditMetadata()) {
      return;
    }

    const payload = this.payload;

    // Clean up attachment ONLY if the new entity GUID is different from the original source, if any
    if (
      payload &&
      payload.entity_guid &&
      !this.isOriginalEntity(payload.entity_guid)
    ) {
      this.attachment.prune(payload.entity_guid);
    }

    this.attachments$.next(null);
    this.videoPoster$.next(null);
    this.title$.next(null);
  }

  /**
   * Deletes the current rich embed
   */
  removeRichEmbed(): void {
    if (!this.canEditMetadata()) {
      return;
    }

    this.richEmbed$.next(DEFAULT_RICH_EMBED_VALUE);
  }

  /**
   * Used to prevent original entity deletion when editing an activity. That operation is handled in the engine.
   * @param entityGuid
   */
  protected isOriginalEntity(entityGuid): boolean {
    if (!this.entity || typeof this.entity.entity_guid === 'undefined') {
      return false;
    }

    return (entityGuid || '') === (this.entity.entity_guid || '');
  }

  /**
   * Can metadata be edited? Only if the original activity doesn't have both a URL and an entity_guid, or it's not a remind
   */
  canEditMetadata(): boolean {
    if (!this.entity) {
      return true;
    } else if (this.entity.remind_object) {
      return false;
    }

    return !this.entity.perma_url || !this.entity.entity_guid;
  }

  /**
   * Builds the API payload and sets to a property
   * @param message
   * @param title
   * @param attachmentGuids
   * @param nsfw
   * @param monetization
   * @param tags
   * @param accessId
   * @param license
   * @param schedule
   * @param richEmbed
   * @param videoPoster
   * @param postToPermaweb
   * @param remind
   */
  buildPayload({
    message,
    title,
    nsfw,
    monetization,
    tags,
    schedule,
    accessId,
    license,
    attachmentGuids,
    richEmbed,
    videoPoster,
    postToPermaweb,
    remind,
  }: Data): any {
    if (this.containerGuid) {
      // Override accessId if there's a container set
      accessId = this.containerGuid;
      this.isGroupPost$.next(true);
    }

    // Preventing paywallception: you cannot paywall an already paywalled remind
    const monetized = !remind?.paywall && monetization;

    this.payload = {
      message: message || '',
      wire_threshold: monetized ? monetization : null,
      paywall: monetized,
      time_created: schedule || null,
      mature: nsfw && nsfw.length > 0,
      nsfw: nsfw || [],
      tags: tags || [],
      access_id: accessId,
      license: license,
      post_to_permaweb: postToPermaweb,
    };

    if (remind) {
      this.payload.remind_guid = remind.guid;
    }

    if (this.canEditMetadata()) {
      if (attachmentGuids?.length > 0) {
        this.payload.title = title; // Only media post can have titles

        this.payload.attachment_guids = attachmentGuids;

        this.payload.is_rich = false; // Can never have rich embed with media posts

        //this.payload.entity_guid_update = true;
      } else if (richEmbed && !richEmbed.entityGuid) {
        this.payload.url = richEmbed.url;
        this.payload.title = richEmbed.title;
        this.payload.description = richEmbed.description;
        this.payload.thumbnail = richEmbed.thumbnail;
        this.payload.is_rich = true;

        if (!this.isOriginalEntity(richEmbed.entityGuid)) {
          this.payload.entity_guid_update = true;
        }
      } else if (!this.isOriginalEntity(null)) {
        this.payload.entity_guid_update = true;
      }
    }

    if (this.containerGuid) {
      this.payload.container_guid = this.containerGuid;
    }

    if (videoPoster && videoPoster.fileBase64) {
      this.payload.video_poster = videoPoster.fileBase64;
    }
  }

  /**
   * Sets the current progress state
   *
   * @param inProgress
   * @param progress
   * @private
   */
  setProgress(inProgress: boolean, progress: number = 1): void {
    this.inProgress$.next(inProgress);
  }

  /**
   * Posts a new activity
   */
  async post(): Promise<ActivityEntity> {
    this.isPosting$.next(true);
    this.setProgress(true);

    const editing = this.entity && this.entity.guid;

    try {
      let activity;

      if (editing) {
        activity = await this.api
          .post(`api/v3/newsfeed/activity/${this.entity.guid}`, this.payload)
          .toPromise();
      } else {
        // New activity
        activity = await this.api
          .put(`api/v3/newsfeed/activity`, this.payload)
          .toPromise();

        this.feedsUpdate.postEmitter.emit(activity);
        this.onboardingService.forceCompletion('CreatePostStep');
      }

      this.reset();
      this.isPosting$.next(false);
      setTimeout(
        () => this.boostRecommendationService.recommendBoost(activity.guid),
        1000
      );
      this.setProgress(false);

      activity.boostToggle = true;
      return activity;
    } catch (e) {
      this.isPosting$.next(false);
      this.setProgress(false);
      throw e; // Re-throw
    }
  }
}
