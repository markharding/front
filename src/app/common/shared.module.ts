import { NgModule, PLATFORM_ID } from '@angular/core';
import { PageLayoutService } from './layout/page-layout.service';
import { ConfigsService } from './services/configs.service';
import { AuthModalService } from '../modules/auth/modal/auth-modal.service';
import { Web3ModalModule, Web3ModalService } from '@mindsorg/web3modal-angular';
import { createWeb3ModalConfig } from '../helpers/web3modal-configuration';
import { TransactionOverlayService } from '../modules/blockchain/transaction-overlay/transaction-overlay.service';
import { Web3WalletService } from '../modules/blockchain/web3-wallet.service';
import { UniswapModalService } from '../modules/blockchain/token-purchase/uniswap/uniswap-modal.service';
import { EarnModalService } from '../modules/blockchain/earn/earn-modal.service';
import { ToasterService } from './services/toaster.service';
import { SupermindOnboardingModalService } from '../modules/supermind/onboarding-modal/onboarding-modal.service';

@NgModule({
  imports: [Web3ModalModule],
  providers: [
    ConfigsService,
    PageLayoutService,
    UniswapModalService,
    AuthModalService,
    EarnModalService,
    SupermindOnboardingModalService,
    {
      provide: Web3ModalService,
      useFactory: () => {
        const config = createWeb3ModalConfig();

        return new Web3ModalService(config);
      },
    },
    {
      provide: Web3WalletService,
      useFactory: Web3WalletService._,
      deps: [
        TransactionOverlayService,
        PLATFORM_ID,
        ConfigsService,
        Web3ModalService,
        ToasterService,
      ],
    },
  ],
})
export class SharedModule {}
