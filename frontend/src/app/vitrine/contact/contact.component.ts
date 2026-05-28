import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  form: FormGroup;
  sent = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sujet: [''],
      message: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.sent = true;
    }
  }
}
