import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { FandomsComponent } from './fandoms.component';
import { FandomsRoutingModule } from './fandoms-routing.module';
import { FandomSelectionComponent } from './fandom-selection/fandom-selection.component';
import { AddDialogComponent } from '../shared/components/add-dialog/add-dialog.component';
import { FandomDetailComponent } from './fandom-detail/fandom-detail.component';
import { CreatePostDialogComponent } from './create-post-dialog/create-post-dialog.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { AddCommentDialogComponent } from './add-comment-dialog/add-comment-dialog.component';

@NgModule({
  declarations: [
    FandomsComponent,
    FandomSelectionComponent,
    AddDialogComponent,
    FandomDetailComponent,
    CreatePostDialogComponent,
    PostDetailComponent,
    AddCommentDialogComponent,
  ],
  imports: [CommonModule, CoreModule, SharedModule, FandomsRoutingModule],
})
export class FandomsModule {}
