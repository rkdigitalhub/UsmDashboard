import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { ApiService } from '../core/api/api.service';

export interface AppUser {
	userId: string;
	name: string;
	password: string;
	role?: 'admin' | 'member';
	mobile?: string;
	email?: string;
	address?: string;
	accountNumber?: string;
	ifscCode?: string;
	location: string;
	bankName: string;
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
	private readonly currentUserState = signal<SafeAppUser | null>(this.restoreCurrentUser());
	private users$?: Observable<AppUser[]>;

	constructor(private readonly api: ApiService) {}

	login(userId: string, password: string): Observable<LoginResult> {
		const normalizedId = userId.trim().toUpperCase();
		const normalizedPassword = password.trim();

		return this.getUsers().pipe(
			map((users) => users.find((user) => user.userId.toUpperCase() === normalizedId && user.password === normalizedPassword)),
			tap((matchedUser) => {
				if (matchedUser) {
					this.persistCurrentUser(this.toSafeUser(matchedUser));
				}
			}),
			map((matchedUser) => matchedUser
				? { success: true, user: this.toSafeUser(matchedUser) }
				: { success: false, message: 'Invalid user ID or password.' })
		);
	}

	getUsers(): Observable<AppUser[]> {
		if (!this.users$) {
			this.users$ = this.api.getAsset<AppUser[]>('mock-users.json').pipe(shareReplay(1));
		}

		return this.users$;
	}

	isLoggedIn(): boolean {
		return this.currentUserState() !== null;
	}

	logout(): void {
		localStorage.removeItem('loggedIn');
		localStorage.removeItem('currentUser');
		this.currentUserState.set(null);
	}

	getCurrentUser(): SafeAppUser | null {
		return this.currentUserState();
	}

	hasRole(role: 'admin' | 'member'): boolean {
		const currentUser = this.currentUserState();
		return !!currentUser && (currentUser.role ?? 'member') === role;
	}

	private toSafeUser(user: AppUser): SafeAppUser {
		const { password, ...safeUser } = user;
		return safeUser;
	}

	private persistCurrentUser(user: SafeAppUser): void {
		localStorage.setItem('loggedIn', 'true');
		localStorage.setItem('currentUser', JSON.stringify(user));
		this.currentUserState.set(user);
	}

	private restoreCurrentUser(): SafeAppUser | null {
		const stored = localStorage.getItem('currentUser');
		if (!stored) {
			return null;
		}

		try {
			return JSON.parse(stored) as SafeAppUser;
		} catch {
			localStorage.removeItem('loggedIn');
			localStorage.removeItem('currentUser');
			return null;
		}
	}
}
