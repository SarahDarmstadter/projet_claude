import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TexteService } from '../services/texte.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  form: FormGroup;
  sent = false;
  sending = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public textes: TexteService
  ) {
    this.form = this.fb.group({
      prenom:  ['', Validators.required],
      nom:     ['', Validators.required],
      email:   ['', [Validators.required, Validators.email]],
      sujet:   [''],
      message: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.sending = true;
    this.error = '';
    this.http.post(`${environment.apiUrl}/public/contact`, this.form.value).subscribe({
      next: () => { this.sent = true; this.sending = false; },
      error: () => {
        this.sending = false;
        this.error = "Une erreur est survenue. Veuillez réessayer ou écrire directement par email.";
      }
    });
  }
}
