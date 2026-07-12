import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoadingService } from './core/services/loading.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet , HeaderComponent , FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('movieverse');
  loadingService = inject(LoadingService);
}
