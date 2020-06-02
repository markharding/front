import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { LanguageModalComponent } from './language-modal/language-modal.component';
import { LanguageBarComponent } from './language-bar.component';
import { LanguageService } from './language.service';
import { LanguageModalService } from './language-modal/language-modal.service';

@NgModule({
  imports: [NgCommonModule],
  declarations: [LanguageModalComponent, LanguageBarComponent],
  exports: [LanguageBarComponent],
  providers: [LanguageService, LanguageModalService],
})
export class LanguageModule {}