import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../admin.service';
import { AdminDialogComponent } from './admin-dialog/admin-dialog.component';

export interface Admin {
  admin_id: number;
  first_name: string;
  last_name: string;
  admin_role: string;
  username: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  constructor(public dialog: MatDialog, private service: AdminService) {}

  displayedColumns: string[] = [
    'admin_id',
    'first_name',
    'last_name',
    'admin_role',
    'username',
    'delete',
    'edit',
  ];

  dataSource: any;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getAdmin().subscribe((data) => {
      this.dataSource = data;
    });
  }

  addNewAdmin() {
    this.dialog
      .open(AdminDialogComponent, { width: '50vw' })
      .afterClosed()
      .subscribe((result) => {
        this.refreshList();
      });
  }

  deleteAdmin(admin_id: number) {
    this.service.deleteAdmin(admin_id).subscribe((admin) => {
      this.refreshList();
    });
  }

  editAdmin(admin: Admin) {
    this.dialog
      .open(AdminDialogComponent, { data: admin, width: '50vw' })
      .afterClosed()
      .subscribe((result) => {
        this.refreshList();
      });
  }
}
