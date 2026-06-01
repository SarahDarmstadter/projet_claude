import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  message: string;
  error: boolean;
  emittedAt: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private subject = new BehaviorSubject<ToastMessage | null>(null);
  toast$ = this.subject.asObservable();

  success(message: string): void {
    this.subject.next({ message, error: false, emittedAt: Date.now() });
  }

  error(message: string): void {
    this.subject.next({ message, error: true, emittedAt: Date.now() });
  }
}
