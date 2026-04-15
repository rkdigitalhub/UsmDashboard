import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

export interface AppUser {
	userId: string;
	name: string;
	password: string;
	mobile?: string;
	email?: string;
	address?: string;
	pincode?: string;
	location: string;
	bankName: string;
	accountNumber?: string;
	ifscCode?: string;
	branch: string;
	schemeAmount: number;
	schemeName: string;
	tenureMonths: number;
}

export type SafeAppUser = Omit<AppUser, 'password'>;

export interface LoginResult {
	success: boolean;
	message?: string;
	user?: SafeAppUser;
}

@Injectable({
	providedIn: 'root'
})

export class AuthService {
	private users$?: Observable<AppUser[]>;

	constructor(private readonly http: HttpClient) {}

	login(userId: string, password: string): Observable<LoginResult> {
		const normalizedId = userId.trim().toUpperCase();
		const normalizedPassword = password.trim();

		return this.getUsers().pipe(
			map((users) => users.find((user) => user.userId.toUpperCase() === normalizedId && user.password === normalizedPassword)),
			tap((matchedUser) => {
				if (matchedUser) {
					localStorage.setItem('loggedIn', 'true');
					localStorage.setItem('currentUser', JSON.stringify(this.toSafeUser(matchedUser)));
				}
			}),
			map((matchedUser) => matchedUser
				? { success: true, user: this.toSafeUser(matchedUser) }
				: { success: false, message: 'Invalid user ID or password.' })
		);
	}

	getUsers(): Observable<AppUser[]> {
		if (!this.users$) {
			this.users$ = this.http.get<AppUser[]>('assets/mock-users.json').pipe(shareReplay(1));
		}

		return this.users$;
	}

	isLoggedIn(): boolean {
		return localStorage.getItem('loggedIn') === 'true';
	}

	logout(): void {
		localStorage.removeItem('loggedIn');
		localStorage.removeItem('currentUser');
	}

	getCurrentUser(): SafeAppUser | null {
		const stored = localStorage.getItem('currentUser');
		if (!stored) {
			return null;
		}

		try {
			return JSON.parse(stored) as SafeAppUser;
		} catch {
			localStorage.removeItem('currentUser');
			return null;
		}
	}

	private toSafeUser(user: AppUser): SafeAppUser {
		const { password, ...safeUser } = user;
		return safeUser;
	}
}
