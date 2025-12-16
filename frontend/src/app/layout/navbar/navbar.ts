import { Component, computed, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { faChartSimple, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { AuthFacade } from '../../pages/auth/facades/auth.facade';

@Component({
  selector: 'app-navbar',
  imports: [
    AvatarModule, 
    AvatarGroupModule, 
    FontAwesomeModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  authFacade = inject(AuthFacade);
  faChartSimple = faChartSimple;
  faArrowRightFromBracket = faArrowRightFromBracket

  userInitial = computed(() => {
    const fullName = this.authFacade.getUser()?.full_name;
    return fullName ? fullName.charAt(0).toUpperCase() : 'U';
  });

  firstName = computed(() => {
    const fullName = this.authFacade.getUser()?.full_name;
    return fullName ? fullName.split(' ')[0] : 'Usuário';
  });
}
