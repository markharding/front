import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '../../../../../common/common.module';
import { EmojiPickerModule } from '../../../../../common/components/emoji-picker/emoji-picker.module';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {
  ChatMessageEdge,
  CreateChatMessageGQL,
  CreateChatMessageMutation,
  GetChatMessagesDocument,
  GetChatMessagesQuery,
} from '../../../../../../graphql/generated.engine';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { MutationResult } from 'apollo-angular';
import { ToasterService } from '../../../../../common/services/toaster.service';
import {
  ChatMessagesService,
  PAGE_SIZE,
} from '../../../services/chat-messages.service';
import { InMemoryCache } from '@apollo/client';
import { cloneDeep } from '@apollo/client/utilities';

/**
 * Bottom bar for chat room.
 */
@Component({
  selector: 'm-chatRoom__bottom',
  styleUrls: ['./chat-room-bottom-bar.component.ng.scss'],
  templateUrl: './chat-room-bottom-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgCommonModule,
    CommonModule,
    ReactiveFormsModule,
    EmojiPickerModule,
  ],
  standalone: true,
})
export class ChatRoomBottomBarComponent implements OnInit {
  /** Form group containing the text area. */
  protected formGroup: FormGroup;

  protected readonly sendInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  @Input() protected roomGuid: string;

  @Output() protected messageSent: EventEmitter<ChatMessageEdge> =
    new EventEmitter<ChatMessageEdge>();

  /** Text area viewchild */
  @ViewChild('textArea') protected textArea: ElementRef<HTMLTextAreaElement>;

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToasterService,
    private createMessageGQL: CreateChatMessageGQL,
    private chatMessageService: ChatMessagesService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      message: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Todo, fires on emoji add.
   * @param { EmojiData } emoji - The emoji data.
   * @returns { void }
   */
  protected onEmojiAdd(emoji: EmojiData): void {
    const selectionStart: number = this.textArea.nativeElement.selectionStart;
    const currentMessage: string = this.formGroup.get('message').value;
    const preText = currentMessage.substring(0, selectionStart);
    const postText = currentMessage.substring(selectionStart);
    this.formGroup.get('message').setValue(preText + emoji.native + postText);
    this.textArea.nativeElement.focus();
  }

  /**
   * Handle enter key press - submit message unless shift is pressed (new line).
   * @param { KeyboardEvent } $event - The keyboard event.
   */
  protected onEnterPress($event: KeyboardEvent): void {
    if (!$event?.shiftKey) {
      $event.preventDefault();
      this.onSubmit();
    }
  }

  /**
   * Handle submit button click / message send.
   * @returns { Promise<void> }
   */
  protected async onSubmit(): Promise<void> {
    // This prevents mobile keyboards from closing on submit.
    this.textArea.nativeElement.focus();

    const formControl: AbstractControl<string> = this.formGroup.get('message');
    const message = formControl.value.trim();

    if (!message?.length) {
      return;
    }

    try {
      if (this.sendInProgress$.getValue() || formControl.disabled) {
        return;
      }

      this.sendInProgress$.next(true);

      const result: MutationResult<CreateChatMessageMutation> =
        await lastValueFrom(
          this.createMessageGQL.mutate(
            {
              plainText: message,
              roomGuid: this.roomGuid,
            },
            {
              update: this.handleCreateMessageUpdate.bind(this),
            }
          )
        );

      if (!result) {
        throw new Error('Failed to send message');
      }

      if (result.errors?.length) {
        throw new Error(result.errors[0].message);
      }

      if (result.data.createChatMessage) {
        this.chatMessageService.requestScrollToBottom();
        formControl.setValue('');
        formControl.markAsPristine();
        formControl.markAsUntouched();
      }
    } catch (e) {
      this.toaster.error(e);
      console.error(e);
    } finally {
      this.sendInProgress$.next(false);
    }
  }

  /**
   * Handle create message update. Will update the cache with the new message.
   * @param { InMemoryCache } cache - cache.
   * @param { MutationResult<CreateChatMessageMutation> } result - result of the updating mutation.
   * @param { unknown } options - options.
   * @returns { void }
   */
  private handleCreateMessageUpdate(
    cache: InMemoryCache,
    result: MutationResult<CreateChatMessageMutation>,
    options: unknown
  ): void {
    let newValue: GetChatMessagesQuery = cloneDeep(
      cache.readQuery<GetChatMessagesQuery>({
        query: GetChatMessagesDocument,
        variables: {
          first: PAGE_SIZE,
          roomGuid: this.roomGuid,
        },
      })
    );

    newValue.chatMessages.edges.push(
      result.data.createChatMessage as ChatMessageEdge
    );

    cache.writeQuery({
      query: GetChatMessagesDocument,
      variables: {
        first: PAGE_SIZE,
        roomGuid: this.roomGuid,
      },
      data: newValue,
    });
  }
}
