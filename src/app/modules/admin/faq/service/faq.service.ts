import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable, map, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FaqService {
    // delete(id: any) {
    //     throw new Error('Method not implemented.');
    // }

    constructor(private _httpClient: HttpClient) { }

    getPage(dataTablesParameters: any): Observable<any> {
        return this._httpClient
            .post(
                environment.baseURL + '/api/faq_page',
                dataTablesParameters
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    create(formData: FormData): Observable<any> {
        return this._httpClient
            .post(environment.baseURL + '/api/faq', formData)
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
            .get(environment.baseURL + `/api/faq/${Id}`)
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    update(item: any, id: any): Observable<any> {
        return this._httpClient
            .put(environment.baseURL + `/api/faq/${id}`, item)
            .pipe();
    }

    // update(Id: any, data: FormData): Observable<any> {
    //     return this._httpClient
    //         .put(environment.baseURL + `api/customer/${Id}`, data)
    //         .pipe();
    // }

    delete(Id: any): Observable<any> {
        return this._httpClient
            .delete(environment.baseURL + `/api/faq/${Id}`)
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
    // getById(Id: any): Observable<any> {
    //   return this._httpClient
    //   .get<any>(environment.baseURL + '/api/news/' + Id)
    //   .pipe(
    //   map((resp: any) => {
    //   return resp.data;
    //   })
    //   );
    //   }
}
