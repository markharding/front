import { Injectable, Injector, createNgModuleRef } from '@angular/core';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { IsTenantService } from '../../../common/services/is-tenant.service';
import { SiteMembershipsPageComponent } from '../components/memberships-page/site-memberships-page.component';

/**
 * Service that loads and presents
 * the site memberships page component as a modal
 *
 * e.g. to be shown after tenant user registration
 */
@Injectable({ providedIn: 'root' })
export class SiteMembershipsPageModal {
  constructor(
    protected modalService: ModalService,
    private injector: Injector,
    private isTenant: IsTenantService
  ) {}

  /**
   * Presents the modal.
   * @returns { Promise<ModalRef<SiteMembershipsPageComponent>> }
   */
  public async open(): Promise<ModalRef<SiteMembershipsPageComponent>> {
    // Only show on tenant sites
    if (!this.isTenant.is()) {
      return;
    }
    const { SiteMembershipsLazyModule } = await import(
      '../site-memberships-lazy.module'
    );

    const moduleRef = createNgModuleRef(
      SiteMembershipsLazyModule,
      this.injector
    );

    const siteMembershipsPageComponent =
      moduleRef.instance.resolveSiteMembershipsPageComponent();

    const modal = this.modalService.present(siteMembershipsPageComponent, {
      data: {
        isModal: true,
        onJoinClick: () => {
          this.dismiss();
        },
      },
      injector: this.injector,
      size: 'lg',
      windowClass: 'm-modalV2__mobileFullCover',
    });

    return modal;
  }

  /**
   * Dismisses the modal
   */
  dismiss() {
    this.modalService.dismissAll();
  }
}