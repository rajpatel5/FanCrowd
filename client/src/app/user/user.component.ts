import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { UserService } from '../core/services/user.service';
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';
import UserProfileDTO from '../shared/models/user-dto';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { UserIdentity } from '../shared/models/user-identity-token';
import UserFandomRes from '../shared/models/user-fandom-res';
import { IEventSummary } from '../shared/models/event-summary';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass'],
})
export class UserComponent implements OnInit, OnDestroy {
  userSubscription!: Subscription;
  user: UserProfileDTO | null = null;
  loggedInUser: UserIdentity | null = null;
  events: IEventSummary[] = [];
  fandoms: UserFandomRes[] = [];

  isUserBanned = false;

  constructor(
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog,
    private _authService: AuthService
  ) {}

  ngOnInit() {
    this._activatedRoute.params.subscribe((params) => {
      const username = params['username'];
      this._userService.getUserByUsername(username).subscribe((user) => {
        this.user = user;
      });

      this._userService
        .getUserEventsByUsername(username)
        .subscribe((events) => {
          this.events = events;
        });

      this._userService
        .getUserFandomsByUsername(username)
        .subscribe((fandoms) => {
          this.fandoms = fandoms;
        });

      if (!this.user) {
        this._router.navigate(['../']);
      }
    });

    this.userSubscription = this._authService.currentUser.subscribe(
      (user) => (this.loggedInUser = user)
    );
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  deleteUser() {
    this._userService
      .deleteUserByUsername(this.user!.username)
      .subscribe(() => {
        this._authService.logOut();
        this._router.navigate(['/login']);
      });
  }

  toggleUserBan() {
    this._userService
      .banUserByUsername(this.user!.username)
      .subscribe(() => (this.user!.isBanned = !this.user!.isBanned));
  }

  openEditAccountDialog() {
    const dialogRef = this._dialog.open(EditUserDialogComponent, {
      data: { ...this.user },
      autoFocus: false,
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((updatedUser: UserProfileDTO) => {
      if (updatedUser) {
        this.user = updatedUser;
        if (!this._authService.currentUser.value) {
          return;
        }
        this._authService.currentUser.next({
          ...this._authService.currentUser.value,
          username: updatedUser.username,
          profileURL: updatedUser.profileURL,
        });
      }
    });
  }

  openDeleteAccountDialog() {
    this._dialog.open(DeleteDialogComponent, {
      data: {
        title: 'Delete Account Confirmation',
        details: 'Are you sure you want to delete your account?',
        onConfirmCb: this.deleteUser.bind(this),
      },
      width: '360px',
      height: '180px',
      autoFocus: false,
      disableClose: true,
    });
  }

  openBanUserAccountDialog() {
    this._dialog.open(DeleteDialogComponent, {
      data: {
        title: `${this.user!.isBanned ? 'Unban' : 'Ban'} User Confirmation`,
        details: `Are you sure you want to ${
          this.user!.isBanned ? 'unban' : 'ban'
        } ${this.user!.username}?`,
        onConfirmCb: this.toggleUserBan.bind(this),
      },
      width: '360px',
      height: '180px',
      autoFocus: false,
    });
  }

  isFandomEmpty(): boolean {
    return !this.fandoms;
  }

  isBioEmpty(): boolean {
    return !this.user?.bio;
  }

  isEventsEmpty(): boolean {
    return !this.events.length;
  }

  isSelf(): boolean {
    return this.user?.username == this.loggedInUser?.username;
  }
}
