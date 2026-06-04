import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ToastService, ToastMessage } from './toast.service';

const TOAST_TTL = 3000;

@Component({
  selector: 'app-admin-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-toast" *ngIf="current" [class.admin-toast--error]="current.error">
      <span>{{ current.error ? '✕' : '✓' }}</span>
      <span>{{ current.message }}</span>
    </div>
  `,
  styles: [`
    .admin-toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: .6rem;
      padding: .75rem 1.4rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      background: #1a1a1a;
      color: #fff;
      box-shadow: 0 4px 20px rgba(0,0,0,.3);
      pointer-events: none;
      white-space: nowrap;
      z-index: 1000;
      animation: toast-appear .2s ease;
    }
    .admin-toast--error { background: #b71c1c; }
    @keyframes toast-appear {
      from { opacity: 0; transform: translateX(-50%) translateY(8px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `]
})
export class AdminToastComponent implements OnInit, OnDestroy {
  current: ToastMessage | null = null;
  private timer: any;
  private sub!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toastService.toast$.pipe(
      // Ignore les valeurs null et les toasts périmés (émis il y a > 3s)
      filter(t => t !== null && Date.now() - t!.emittedAt < TOAST_TTL)
    ).subscribe(t => {
      clearTimeout(this.timer);
      this.current = t;
      const remaining = TOAST_TTL - (Date.now() - t!.emittedAt);
      this.timer = setTimeout(() => { this.current = null; }, remaining);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    clearTimeout(this.timer);
    // Pas de clear() ici : le BehaviorSubject doit conserver la valeur pour
    // que la page suivante (ex: liste après création) puisse afficher le toast
  }
}
