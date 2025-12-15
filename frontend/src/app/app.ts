import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer/footer';
import { Navbar } from './layout/navbar/navbar';
import { AuthFacade } from './pages/auth/facades/auth.facade';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  schemas: []
})
export class App {
  protected readonly title = signal('PetroAnalytics');
  authFacade = inject(AuthFacade);
}
