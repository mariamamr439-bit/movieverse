import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  private readonly router = inject(Router);

  goBack(): void {
    this.router.navigate(['/home']);
  }
}