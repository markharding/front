import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  Input,
} from '@angular/core';
import { CommonModule } from '../../../../../common/common.module';
import {
  ChatRoomEdge,
  ChatRoomMemberEdge,
} from '../../../../../../graphql/generated.engine';
import { ChatRoomUtilsService } from '../../../services/utils.service';
import { MindsAvatarObject } from '../../../../../common/components/avatar/avatar';
import { ChatDatePipe } from '../../../pipes/chat-date-pipe';
import { Router, RouterModule } from '@angular/router';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';

/** Amount of avatars to show for a multi-user chat-room. */
const MULTI_USER_AVATARS_TO_SHOW: number = 2;

/**
 * Individual item in the room list.
 */
@Component({
  selector: 'm-chat__roomListItem',
  templateUrl: './room-list-item.component.html',
  styleUrls: ['./room-list-item.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgCommonModule, ChatDatePipe, RouterModule],
  standalone: true,
  host: {
    '(click)': 'navigateToChat()',
  },
})
export class ChatRoomListItemComponent {
  /** Name of the room. */
  protected roomName: string;

  /** Avatar object of the chat participants. */
  protected avatars: MindsAvatarObject[] = [];

  /** Timestamp of the last message. */
  protected timestamp: number;

  /** Last message sent to the chat. */
  protected lastMessage: string;

  /** GUID of the room. */
  protected roomGuid: string;

  /** True/False if unread messages exist in this room */
  protected unreadMessages: boolean;

  /** Whether the room is active. Binds active class when input value is true. */
  @HostBinding('class.m-chat__roomListItem--active')
  @Input()
  protected active: boolean = false;

  /** Navigation link for on item click. */
  @Input() protected navigationLink: string;

  /**
   * Set class variables based upon the edge passed via input.
   */
  @Input() set edge(edge: ChatRoomEdge) {
    this.roomName = this.chatRoomUtilsService.deriveRoomNameFromMembers(
      edge.members?.edges
    );
    this.avatars = this.getAvatarObjects(edge.members?.edges);

    this.timestamp = Number(
      Boolean(edge.lastMessageCreatedTimestamp)
        ? edge.lastMessageCreatedTimestamp
        : edge.node.timeCreatedUnix
    );

    this.lastMessage = edge.lastMessagePlainText;
    this.roomGuid = edge.node?.guid;
    this.unreadMessages = edge.unreadMessagesCount > 0;
  }

  constructor(
    private chatRoomUtilsService: ChatRoomUtilsService,
    private router: Router,
    @Inject(WINDOW) private window: Window
  ) {}

  /**
   * Get the avatar objects for the chat room.
   * @param { ChatRoomMemberEdge[] } members - The members of the chat room.
   * @returns { MindsAvatarObject[] } - The avatar objects for the chat room.
   */
  private getAvatarObjects(members: ChatRoomMemberEdge[]): MindsAvatarObject[] {
    return (
      members
        ?.slice(0, MULTI_USER_AVATARS_TO_SHOW)
        .map((member: ChatRoomMemberEdge) => {
          return {
            guid: member.node.guid,
            type: 'user', // TODO: in future add group support.
            username: member.node.username,
          };
        }) ?? []
    );
  }

  /**
   * Navigate to the chat room.
   * @returns { void }
   */
  protected navigateToChat(): void {
    this.router.navigateByUrl(
      this.navigationLink ?? `/chat/rooms/${this.roomGuid}`
    );
  }

  /**
   * Handles middle mouse click on an avatar by opening the users channel
   * in a new tab.
   * @returns { void }
   */
  protected openChannelInNewTab(username: string): void {
    this.window.open(`/${username}`, '_blank');
  }
}
