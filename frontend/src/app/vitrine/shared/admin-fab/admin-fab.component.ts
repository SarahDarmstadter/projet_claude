import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { AdminModeService } from '../../services/admin-mode.service';

@Component({
  selector: 'app-admin-fab',
  templateUrl: './admin-fab.component.html',
  styleUrls: ['./admin-fab.component.css']
})
export class AdminFabComponent {
  constructor(
    public auth: AuthService,
    public adminMode: AdminModeService
  ) {}
}
