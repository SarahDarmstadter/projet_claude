import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html'
})
export class TwoFactorComponent implements OnInit {

  form: FormGroup;
  email = '';
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
    const nav = this.router.getCurrentNavigation();
    this.email = nav?.extras?.state?.['email'] ?? '';
  }

  ngOnInit(): void {
    if (!this.email) {
      this.router.navigate(['/login']);
    }
  }

  submit(): void {
    if (this.form.invalid) { return; }
    this.loading = true;
    this.error = '';

    this.authService.verifyTwoFactor(this.email, this.form.value.code).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: () => {
        this.error = 'Code invalide ou expiré';
        this.loading = false;
      }
    });
  }
}
