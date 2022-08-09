import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  ComposerService,
  DEFAULT_RICH_EMBED_VALUE,
} from '../../services/composer.service';

/**
 * Composer preview wrapper. Renders a user-friendly preview of
 * the embedded media/rich-embed.
 *
 * Also allows user to change the video
 * thumbnails and delete the embed.
 *
 * Previews for quote posts are elsewhere, in the composer base.
 */
@Component({
  selector: 'm-composer__previewWrapper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'preview-wrapper.component.html',
})
export class PreviewWrapperComponent {
  /**
   * The attachment preview metadata subject from the service
   */
  attachmentPreview$ = this.service.attachmentPreview$;

  /**
   * The rich embed preview metadata subject from the service
   */
  richEmbedPreview$ = this.service.richEmbedPreview$;

  /**
   * The extracted URL from the message
   */
  messageUrl$ = this.service.messageUrl$;

  /**
   * Are we posting?
   */
  isPosting$ = this.service.isPosting$;

  /**
   * Is the media in portrait mode?
   */
  portrait: boolean = false;

  /**
   * Are we editing?
   */
  isEditing$ = this.service.isEditing$;

  /**
   * Constructor.
   * @param service
   * @param cd
   */
  constructor(
    protected service: ComposerService,
    protected cd: ChangeDetectorRef
  ) {}

  /**
   * Sets the portrait mode
   * @param portrait
   */
  setPortrait(portrait: boolean) {
    if (portrait !== this.portrait) {
      this.portrait = portrait;
    }
  }

  /**
   * Removes the attachment using the service
   */
  removeAttachment() {
    // TODO: Implement a nice themed modal confirmation
    if (confirm("Are you sure? There's no UNDO.")) {
      this.service.removeAttachment();
    }
  }

  /**
   * Removes the rich embed using the service
   */
  removeRichEmbed() {
    this.service.removeRichEmbed();
  }

  /**
   * Detects changes
   */
  detectChanges() {
    this.cd.detectChanges();
    this.cd.markForCheck();
  }
}