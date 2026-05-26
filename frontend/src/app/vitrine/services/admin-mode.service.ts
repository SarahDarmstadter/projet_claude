import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminModeService {
  private readonly _isAdminMode = new BehaviorSubject<boolean>(false);
  readonly isAdminMode$ = this._isAdminMode.asObservable();

  get isAdminMode(): boolean {
    return this._isAdminMode.value;
  }

  toggle(): void {
    this._isAdminMode.next(!this._isAdminMode.value);
  }
}
