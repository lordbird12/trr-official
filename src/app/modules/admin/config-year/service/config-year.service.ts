import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable, map, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PdpaService {
    // delete(id: any) {
    //     throw new Error('Method not implemented.');
    // }

    constructor(private _httpClient: HttpClient) {}

    getPage(dataTablesParameters: any): Observable<any> {
        return this._httpClient
            .post(environment.baseURL + '/api/configyear_page', dataTablesParameters)
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    getPageRegister(dataTablesParameters: any): Observable<any> {
        return this._httpClient
            .post(environment.baseURL + '/api/configyear_page', dataTablesParameters)
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    
    create(formData: FormData): Observable<any> {
        return this._httpClient
            .post(environment.baseURL + '/api/configyear', formData)
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    getPermission(): Observable<any> {
        return this._httpClient
            .get(environment.baseURL + 'api/get_permission')
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
    getById(Id: any): Observable<any> {
        return this._httpClient
            .get(environment.baseURL + `/api/configyear/${Id}`)
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    // update(formData: FormData): Observable<any> {
    //     return this._httpClient
    //         .post(environment.baseURL + `/api/pdpa`, formData)
    //         .pipe();
    // }

    update(data: FormData,Id: any): Observable<any> {
        return this._httpClient
            .put(environment.baseURL + `/api/configyear/${Id}`, data)
            .pipe();
    }

    delete(Id: any): Observable<any> {
        return this._httpClient
            .delete(environment.baseURL + `/api/configyear/${Id}`)
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
}
