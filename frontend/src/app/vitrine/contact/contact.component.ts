import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { TexteService } from '../services/texte.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  form: FormGroup;
  sent = false;
  sending = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private titleService: Title,
    private meta: Meta,
    public textes: TexteService
  ) {
    this.form = this.fb.group({
      prenom:   ['', Validators.required],
      nom:      ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      sujet:    [''],
      message:  ['', Validators.required],
      honeypot: ['']
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Contact — Pierre Darmstadter');
    this.meta.updateTag({ name: 'description', content: 'Contacter Pierre Darmstadter pour toute demande concernant une œuvre ou une exposition.' });
    this.meta.updateTag({ property: 'og:title', content: 'Contact — Pierre Darmstadter' });
    this.meta.updateTag({ property: 'og:description', content: 'Contacter Pierre Darmstadter pour toute demande concernant une œuvre ou une exposition.' });
  }

  submit(): void {
    if (this.form.invalid) return;
    if (this.form.get('honeypot')?.value) {
      this.sent = true;
      return;
    }
    this.sending = true;
    this.error = '';
    const { honeypot: _, ...payload } = this.form.value;
    this.http.post(`${environment.apiUrl}/public/contact`, payload).subscribe({
      next: () => { this.sent = true; this.sending = false; },
      error: () => {
        this.sending = false;
        this.error = "Une erreur est survenue. Veuillez réessayer ou écrire directement par email.";
      }
    });
  }
}
