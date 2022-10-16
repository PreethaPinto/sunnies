import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from 'src/app/admin.service';
import { Admin } from '../admin.component';

@Component({
  selector: 'app-admin-dialog',
  templateUrl: './admin-dialog.component.html',
  styleUrls: ['./admin-dialog.component.scss'],
})
export class AdminDialogComponent implements OnInit {
  constructor(
    private service: AdminService,
    @Inject(MAT_DIALOG_DATA) public admin: Admin
  ) {}

  ngOnInit(): void {}

  adminForm = new FormGroup({
    first_name: new FormControl(this.admin?.first_name, Validators.required),
    last_name: new FormControl(this.admin?.last_name, Validators.required),
    admin_role: new FormControl(this.admin?.admin_role, Validators.required),
    username: new FormControl(this.admin?.username, Validators.required),
    password: new FormControl(
      { disabled: !!this.admin?.first_name, value: '' },
      Validators.required
    ),
  });

  addNewAdmin() {
    this.service.addNewAdmin(this.adminForm.value as Admin).subscribe();
  }
  updateAdmin() {
    var admin: any = this.adminForm.value;
    admin.admin_id = this.admin.admin_id;
    this.service.updateAdmin(this.adminForm.value as Admin).subscribe();
  }
}
