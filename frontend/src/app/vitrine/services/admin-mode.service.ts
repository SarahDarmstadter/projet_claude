import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminModeService {
  private readonly _isAdminMode = new BehaviorSubject<boolean>(false);
  readonly isAdminMode$ = this._isAdminMode.asObservable();

  get isAdminMode(): boolean {
    return this._isAdminMode.value;
  }

  enable(): void  { this._isAdminMode.next(true); }
  disable(): void { this._isAdminMode.next(false); }
  toggle(): void  { this._isAdminMode.next(!this._isAdminMode.value); }
}
