import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { RouterHistoryService } from '../../../common/services/router-history.service';
import { PopoverComponent } from '../popover-validation/popover.component';
import { CaptchaComponent } from '../../captcha/captcha.component';
import isMobileOrTablet from '../../../helpers/is-mobile-or-tablet';
import { PASSWORD_VALIDATOR } from '../password.validator';
import { UsernameValidator } from '../username.validator';
import { PasswordRiskValidator } from '../password-risk.validator';

export type Source = 'auth-modal' | 'other' | null;

@Component({
  selector: 'minds-form-register',
  templateUrl: 'register.html',
  styleUrls: ['./register.ng.scss'],
})
export class RegisterForm implements OnInit {
  @Input() referrer: string;
  @Input() parentId: string = '';
  @Input() showTitle: boolean = false;
  @Input() showBigButton: boolean = false;
  @Input() showPromotions: boolean = true;
  @Input() showLabels: boolean = false;
  @Input() showInlineErrors: boolean = false;
  @Input() source: Source = null;

  @Output() done: EventEmitter<any> = new EventEmitter();
  @Output() showLoginForm: EventEmitter<any> = new EventEmitter();

  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  inProgress: boolean = false;
  captcha: string;
  usernameValidationTimeout: any;

  passwordRiskCheckStatus: string;

  alphanumericPattern = '^[a-zA-Z0-9_]+$';

  showFbForm: boolean = false;

  form: FormGroup;
  fbForm: FormGroup;

  @ViewChild('popover') popover: PopoverComponent;
  @ViewChild(CaptchaComponent) captchaEl: CaptchaComponent;

  constructor(
    public session: Session,
    public client: Client,
    public fb: FormBuilder,
    public zone: NgZone,
    private routerHistoryService: RouterHistoryService,
    private usernameValidator: UsernameValidator,
    private passwordRiskValidator: PasswordRiskValidator
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        username: [
          '',
          // sync
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(50),
          ],
          // async
          [this.usernameValidator.existingUsernameValidator()],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          // sync
          [Validators.required, PASSWORD_VALIDATOR],
          // async
          [this.passwordRiskValidator.riskValidator()],
        ],
        password2: ['', [Validators.required]],
        tos: [false, Validators.requiredTrue],
        exclusive_promotions: [true],
        captcha: [''],
        previousUrl: this.routerHistoryService.getPreviousUrl(),
      },
      { validators: [this.passwordsMatchValidator] }
    );

    this.form.get('password').valueChanges.subscribe(str => {
      this.popover.show();
    });

    this.form.get('password').statusChanges.subscribe((status: any) => {
      this.passwordRiskCheckStatus = status;
    });
  }

  // Confirm the two passwords match each other
  passwordsMatchValidator(c: AbstractControl): ValidationErrors | null {
    if (c.get('password').value !== c.get('password2').value) {
      return { passwordsMatch: true };
    }
  }

  register(e) {
    e.preventDefault();
    this.errorMessage = '';
    if (!this.form.value.tos) {
      this.errorMessage =
        'To create an account you need to accept terms and conditions.';
      return;
    }

    // re-enable cookies
    document.cookie =
      'disabled_cookies=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    if (this.form.value.password !== this.form.value.password2) {
      this.errorMessage = 'Passwords must match.';
      return;
    }

    this.form.value.referrer = this.referrer;
    this.form.value.parentId = this.parentId;

    this.inProgress = true;

    let opts = { ...this.form.value };

    this.client
      .post('api/v1/register', opts)
      .then((data: any) => {
        // TODO: [emi/sprint/bison] Find a way to reset controls. Old implementation throws Exception;

        this.inProgress = false;
        this.session.login(data.user);
        this.done.next(data.user);
      })
      .catch(e => {
        console.log(e);
        this.inProgress = false;

        this.captchaEl.refresh();

        if (e.status === 'failed') {
          // incorrect login details
          this.errorMessage = 'RegisterException::AuthenticationFailed';
          this.session.logout();
        } else if (e.status === 'error') {
          // two factor?
          switch (e?.message) {
            case 'registration:notemail':
              this.errorMessage = 'Invalid Email';
              break;
            default:
              this.errorMessage = e.message ?? 'An unknown error has occurred';
          }

          this.session.logout();
        } else {
          this.errorMessage = 'Sorry, there was an error. Please try again.';
        }

        return;
      });
  }

  onPasswordFocus() {
    if (this.form.value.password.length > 0) {
      this.popover.show();
    }
  }

  onPasswordBlur() {
    if (!isMobileOrTablet()) {
      this.popover.hide();
    }
  }

  onShowLoginFormClick() {
    this.showLoginForm.emit();
  }

  setCaptcha(code) {
    this.form.patchValue({ captcha: code });
  }

  showError(field: string) {
    return (
      this.showInlineErrors &&
      this.form.get(field).invalid &&
      this.form.get(field).touched &&
      this.form.get(field).dirty
    );
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('username');
  }
}
