import { Component, computed, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { faChartPie, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuModule } from 'primeng/menu';
import { AuthFacade } from '../../pages/auth/facades/auth.facade';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  imports: [
    AvatarModule, 
    AvatarGroupModule, 
    FontAwesomeModule,
    TieredMenuModule,
    MenuModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  authFacade = inject(AuthFacade);
  faChartPie = faChartPie;
  faAngleDown = faAngleDown
  menuUsuarioItems: MenuItem[] = [];

  ngOnInit(): void {
    this.menuUsuarioItems = [
      {
        label: 'Deslogar',
        icon: 'pi pi-sign-out',
        command: () => this.authFacade.logout()
      }
    ];
  }

  userInitial = computed(() => {
    const fullName = this.authFacade.getUser()?.full_name;
    return fullName ? fullName.charAt(0).toUpperCase() : 'U';
  });

  firstName = computed(() => {
    const fullName = this.authFacade.getUser()?.full_name;
    return fullName ? fullName.split(' ')[0] : 'Usuário';
  });
}
