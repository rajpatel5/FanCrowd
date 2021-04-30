import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { FandomService } from '../core/services/fandom.service';
import { GlobalService } from '../core/services/global.service';
import { AddDialogComponent } from '../shared/components/add-dialog/add-dialog.component';
import Category from '../shared/models/category';

@Component({
  selector: 'app-fandoms',
  templateUrl: './fandoms.component.html',
  styleUrls: ['./fandoms.component.sass'],
})
export class FandomsComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  isAdmin = false;
  isLoading = true;
  userSubscription!: Subscription;

  constructor(
    private _fandomService: FandomService,
    private _authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _globalService: GlobalService
  ) {}

  ngOnInit() {
    this.fetchCategories();
    this.userSubscription = this._authService.currentUser.subscribe(
      (user) => (this.isAdmin = user?.role === 'admin')
    );
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  fetchCategories() {
    this._fandomService
      .getCategories()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.categories = res;
      });
  }

  openCreateCategoryDialog() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: {
        title: 'Category',
        isCategory: true,
      },
      width: '360px',
      height: '300px',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((newCategory: Category) => {
      if (newCategory) {
        this.categories.push(newCategory);
        this._snackBar.open(
          `${this._globalService.toTitleCase(
            newCategory.name
          )} category has been created!`,
          'X',
          {
            panelClass: ['snackbar'],
            horizontalPosition: 'left',
            duration: 2500,
          }
        );
      }
    });
  }
}
