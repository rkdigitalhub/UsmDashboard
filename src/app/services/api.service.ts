import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = '/api/lucky';

  constructor(private http: HttpClient) {}

  login(userId: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('username', userId)
      .set('password', password);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post<any>(`${this.baseUrl}/login_exe.php`, body.toString(), { headers });
  }

  getIndex(): Observable<string> {
    return this.http.get(`${this.baseUrl}/index.php`, { responseType: 'text' });
  }

  getProfilePage(): Observable<string> {
    return this.http.get(`${this.baseUrl}/profile.php`, { responseType: 'text' });
  }

  getBankPage(): Observable<string> {
    return this.http.get(`${this.baseUrl}/bank.php`, { responseType: 'text' });
  }

  getDirectReferralsPage(): Observable<string> {
    return this.http.get(`${this.baseUrl}/direct.php`, { responseType: 'text' });
  }

  getGroupPage(): Observable<string> {
    return this.http.get(`${this.baseUrl}/group.php`, { responseType: 'text' });
  }
}
