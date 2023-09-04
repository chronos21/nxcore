import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard {

	constructor(public router: Router) {
	}

	canActivate(): Observable<boolean> | Promise<boolean> | boolean {
		if (!localStorage.getItem('accessToken')) {
			this.router.navigate(['/login']);
			return false;
		}
		return true;
	}
}

@Injectable()
export class LoginGuard {

	constructor(public router: Router) {
	}

	canActivate(): Observable<boolean> | Promise<boolean> | boolean {
		if (localStorage.getItem('accessToken')) {
			this.router.navigate(['/']);
			return false;
		}
		return true;
	}
}
