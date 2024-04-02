import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatRoomMessageComponent } from './chat-room-message.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ChatDatePipe } from '../../../../pipes/chat-date-pipe';
import { WINDOW } from '../../../../../../common/injection-tokens/common-injection-tokens';
import { MockComponent } from '../../../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { mockChatMessageEdge } from '../../../../../../mocks/chat.mock';

describe('ChatRoomMessageComponent', () => {
  let comp: ChatRoomMessageComponent;
  let fixture: ComponentFixture<ChatRoomMessageComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomMessageComponent],
      providers: [
        ChangeDetectorRef,
        { provide: WINDOW, useValue: jasmine.createSpyObj<Window>(['open']) },
      ],
    }).overrideComponent(ChatRoomMessageComponent, {
      set: {
        imports: [
          NgCommonModule,
          RouterTestingModule,
          ChatDatePipe,
          MockComponent({
            selector: 'minds-avatar',
            inputs: ['object'],
            standalone: true,
          }),
          MockComponent({
            selector: 'm-chatRoomMessage__dropdown',
            inputs: ['isMessageOwner', 'messageEdge', 'hoverSourceElement'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatRoomMessageComponent);
    comp = fixture.componentInstance;

    (comp as any).messageEdge = mockChatMessageEdge;

    (comp as any).cd.detectChanges();
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('isMessageOwner', () => {
    it('should set isMessageOwner to true', () => {
      (comp as any).isMessageOwner = true;
      expect((comp as any)._isFromLoggedInUser).toBe(true);
      expect((comp as any).isLeftAligned).toBe(false);
      expect((comp as any).isRightAligned).toBe(true);
    });

    it('should set isMessageOwner to false', () => {
      (comp as any).isMessageOwner = false;
      expect((comp as any)._isFromLoggedInUser).toBe(false);
      expect((comp as any).isLeftAligned).toBe(true);
      expect((comp as any).isRightAligned).toBe(false);
    });
  });

  describe('handleMessageClick', () => {
    it('should handle message click', () => {
      (comp as any).isNextMessageFromSameSender = true;
      (comp as any).isManuallyExpanded = true;

      (comp as any).handleMessageClick();
      expect((comp as any).isManuallyExpanded).toBe(false);
      (comp as any).handleMessageClick();
      expect((comp as any).isManuallyExpanded).toBe(true);
    });

    it('should not handle message click if next message is not from same sender', () => {
      (comp as any).isNextMessageFromSameSender = false;
      (comp as any).isManuallyExpanded = true;

      (comp as any).handleMessageClick();
      expect((comp as any).isManuallyExpanded).toBe(true);
    });
  });

  it('should open sender channel in a new tab', () => {
    (comp as any).senderUsername = 'test';

    (comp as any).openSenderChannelInNewTab();
    expect((comp as any).window.open).toHaveBeenCalledWith('/test', '_blank');
  });

  describe('Rendering template', () => {
    describe('sender name', () => {
      it('should render sender name appropriately', () => {
        const text: string = 'test';
        (comp as any).senderName = text;
        (comp as any).isMessageOwner = false;
        (comp as any).isPreviousMessageFromSameSender = false;

        fixture.detectChanges();
        (comp as any).cd.detectChanges();

        expect(
          fixture.debugElement.query(By.css('.m-chatRoomMessage__senderName'))
            .nativeElement.textContent
        ).toBe(text);
      });

      it('should NOT render sender name when no sender name is set', () => {
        const text: string = null;
        (comp as any).senderName = text;
        (comp as any).isMessageOwner = false;
        (comp as any).isPreviousMessageFromSameSender = false;

        fixture.detectChanges();
        (comp as any).cd.detectChanges();

        expect(
          fixture.debugElement.query(By.css('.m-chatRoomMessage__senderName'))
        ).toBeFalsy();
      });

      it('should NOT render sender name when message owner is true', () => {
        const text: string = 'test';
        (comp as any).senderName = text;
        (comp as any).isMessageOwner = true;
        (comp as any).isPreviousMessageFromSameSender = false;

        fixture.detectChanges();
        (comp as any).cd.detectChanges();

        expect(
          fixture.debugElement.query(By.css('.m-chatRoomMessage__senderName'))
        ).toBeFalsy();
      });

      it('should NOT render sender name when isPreviousMessageFromSameSender is true', () => {
        const text: string = 'test';
        (comp as any).senderName = text;
        (comp as any).isMessageOwner = false;
        (comp as any).isPreviousMessageFromSameSender = true;

        fixture.detectChanges();
        (comp as any).cd.detectChanges();

        expect(
          fixture.debugElement.query(By.css('.m-chatRoomMessage__senderName'))
        ).toBeFalsy();
      });
    });

    describe('avatar', () => {
      it('should render avatar appropriately', () => {
        (comp as any).isMessageOwner = false;
        (comp as any).isNextMessageFromSameSender = false;

        fixture.detectChanges();
        (comp as any).cd.detectChanges();

        expect(fixture.debugElement.query(By.css('minds-avatar'))).toBeTruthy();
      });

      it('should not render avatar when isMessageOwner is set to true', () => {
        (comp as any).isMessageOwner = true;
        (comp as any).isNextMessageFromSameSender = false;

        fixture.detectChanges();
        (comp as any).cd.detectChanges();

        expect(fixture.debugElement.query(By.css('minds-avatar'))).toBeFalsy();
      });

      it('should not render avatar when isNextMessageFromSameSender is set to true', () => {
        (comp as any).isMessageOwner = false;
        (comp as any).isNextMessageFromSameSender = true;

        fixture.detectChanges();
        (comp as any).cd.detectChanges();

        expect(fixture.debugElement.query(By.css('minds-avatar'))).toBeFalsy();
      });
    });

    it('should have dropdown ellipsis', () => {
      expect(
        fixture.debugElement.query(By.css('m-chatRoomMessage__dropdown'))
      ).toBeTruthy();
    });

    it('should render plain text', () => {
      (comp as any).plainText = mockChatMessageEdge.node.plainText;

      fixture.detectChanges();
      (comp as any).cd.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.m-chatRoomMessage__text'))
          .nativeElement.textContent
      ).toBe(mockChatMessageEdge.node.plainText);
    });
  });
});
