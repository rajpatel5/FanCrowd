import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import UserProfileDTO from 'src/app/shared/models/user-dto';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.sass'],
})
export class EditUserDialogComponent implements OnInit {
  usernameBeforeUpdate: string;

  isUpdating = false;
  errorMsg: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: UserProfileDTO,
    private userService: UserService
  ) {
    this.usernameBeforeUpdate = user.username;
  }

  ngOnInit() {}

  onUpdateUser() {
    this.isUpdating = true;
    this.userService
      .updateUserById(this.user, this.user._id!)
      .pipe(finalize(() => (this.isUpdating = false)))
      .subscribe(
        (updatedUser) => this.dialogRef.close(updatedUser),
        (err) => (this.errorMsg = err.error.message)
      );
  }
}
