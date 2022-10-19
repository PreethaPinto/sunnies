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

  hide: Boolean = true;

  ngOnInit(): void {}

  adminForm = new FormGroup({
    firstName: new FormControl(this.admin?.firstName, Validators.required),
    lastName: new FormControl(this.admin?.lastName, Validators.required),
    adminRole: new FormControl(this.admin?.adminRole, Validators.required),
    username: new FormControl(this.admin?.username, Validators.required),
    password: new FormControl(this.admin?.password, Validators.required),
  });

  addNewAdmin() {
    this.service.addNewAdmin(this.adminForm.value as Admin).subscribe();
  }
  updateAdmin() {
    var admin: any = this.adminForm.value;
    admin.adminId = this.admin.adminId;
    this.service.updateAdmin(this.adminForm.value as Admin).subscribe();
  }
}
