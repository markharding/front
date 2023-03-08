import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { themeServiceMock } from '../../../mocks/common/services/theme.service-mock.spec';
import { EarnModalService } from '../../../modules/blockchain/earn/earn-modal.service';
import { BuyTokensModalService } from '../../../modules/blockchain/token-purchase/v2/buy-tokens-modal.service';
import { Web3WalletService } from '../../../modules/blockchain/web3-wallet.service';
import { BoostModalLazyService } from '../../../modules/boost/modal/boost-modal-lazy.service';
import { SupermindExperimentService } from '../../../modules/experiments/sub-services/supermind-experiment.service';
import { Session } from '../../../services/session';
import { MockComponent, MockService } from '../../../utils/mock';
import { ThemeService } from '../../services/theme.service';
import { SidebarNavigationService } from '../sidebar/navigation.service';
import { SidebarMoreComponent } from './sidebar-more.component';

describe('SidebarMoreComponent', () => {
  let component: SidebarMoreComponent;
  let fixture: ComponentFixture<SidebarMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SidebarMoreComponent,
        MockComponent({
          selector: 'm-icon',
        }),
        MockComponent({
          selector: 'a',
          inputs: ['routerLink', 'data-ref'],
        }),
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
        { provide: ThemeService, useValue: themeServiceMock },
        {
          provide: Web3WalletService,
          useValue: MockService(Web3WalletService),
        },
        {
          provide: BuyTokensModalService,
          useValue: MockService(BuyTokensModalService),
        },
        {
          provide: EarnModalService,
          useValue: MockService(EarnModalService),
        },
        {
          provide: BoostModalLazyService,
          useValue: MockService(BoostModalLazyService),
        },
        {
          provide: SidebarNavigationService,
          useValue: MockService(SidebarNavigationService),
        },
        {
          provide: SupermindExperimentService,
          useValue: MockService(SupermindExperimentService),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarMoreComponent);
    component = fixture.componentInstance;

    (component as any).supermindExperiment.isActive.and.returnValue(true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return that supermind option should be shown when experiment is on', () => {
    (component as any).supermindExperiment.isActive.and.returnValue(true);
    expect(component.shouldShowSupermindOption()).toBeTrue();
    expect((component as any).supermindExperiment.isActive).toHaveBeenCalled();
  });

  it('should return that supermind option should NOT be shown when experiment is off', () => {
    (component as any).supermindExperiment.isActive.and.returnValue(false);
    expect(component.shouldShowSupermindOption()).toBeFalse();
    expect((component as any).supermindExperiment.isActive).toHaveBeenCalled();
  });

  it('should navigate to supermind console', () => {
    component.openSupermindConsole();
    expect((component as any).router.navigate).toHaveBeenCalledWith([
      '/supermind/inbox',
    ]);
  });
});
