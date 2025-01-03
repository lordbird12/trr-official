import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  userdata: any;
  private _data: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.userdata = JSON.parse(localStorage.getItem('user'))
  }

  getMessages(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJiaXIiLCJhdWQiOjEsImx1biI6eyJpZCI6MSwicGVybWlzc2lvbl9pZCI6MiwiY29kZSI6IjAwMDAxIiwidXNlcl9pZCI6ImFkbWluIiwibmFtZSI6IlRoYXdhdGNoYWkiLCJlbWFpbCI6ImRlbW9ucmlkZXJjb3MyMjJAZ21haWwuY29tIiwidGVsIjoiMDY1NDEyODc0IiwicmVnaXN0ZXJfZGF0ZSI6IjIwMjMtMDctMjciLCJpbWFnZSI6Imh0dHBzOlwvXC9iaXIuZGV2LWFzaGEuY29tXC9pbWFnZXNcL3VzZXJzXC8xY2JkY2M1MzYxZmQ5YTA1ZjdmZGFjZDI1NGZlZGM1OS5qcGciLCJzdGF0dXMiOiJZZXMiLCJjcmVhdGVfYnkiOiJhZG1pbiIsInVwZGF0ZV9ieSI6ImFkbWluIiwiY3JlYXRlZF9hdCI6IjIwMjMtMDctMDVUMDg6Mjk6NTQuMDAwMDAwWiIsInVwZGF0ZWRfYXQiOiIyMDIzLTEyLTEyVDA3OjU5OjQxLjAwMDAwMFoiLCJ0eXBlIjoidXNlciIsInBlcm1pc3Npb24iOnsiaWQiOjIsIm5hbWUiOiJBZG1pbiIsImNyZWF0ZV9ieSI6ImFkbWluIiwidXBkYXRlX2J5IjoiYWRtaW4iLCJjcmVhdGVkX2F0IjoiMjAyMy0wNy0wNVQwODoyOTo1NC4wMDAwMDBaIiwidXBkYXRlZF9hdCI6IjIwMjQtMDMtMjZUMTM6MjM6MTkuMDAwMDAwWiJ9fSwiaWF0IjoxNzE4MTAxNjY2LCJleHAiOjE3NDk2NTg1OTIsIm5iZiI6MTcxODEwMTY2Nn0.OnEV087UO_5_EKEMmwXhIagZaPbRmsIAOEdS5QbiIpc`
    });
    return this.http.post(environment.baseURL + `/api/chat_page`, {
      "member_id": this.userdata.id,
      "draw": 1,
      "columns": [],
      "order": [
        {
          "column": 0,
          "dir": "asc"
        }
      ],
      "start": 0,
      "length": 100,
      "search": {
        "value": "",
        "regex": false
      }
    }, { headers: headers });
  }

  getMembers(search: string, facID: string = '0', year: number = 6768): Observable<any> {
    const apiUrl = 'https://canegrow.com:28099/api/profile_farmer';

    const params = {
      search,
      FacID: facID,
      Year: year,
      page: '1',
      skip: '1',
      take: 100000,
    };

    return this.http.post(apiUrl, params);
  }

  sendMessages(chatId: number, message: string, userid: number, type: string): Observable<any> {
    return this.http.post(environment.baseURL + `/api/chat_msg`, {
      "chat_id": chatId,
      "user_id": userid,
      "message": message,
      "type": type
    });
  }

  uploadFile(chatId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', '/files/asset_chat_smg/');
    return this.http.post(environment.baseURL + `/api/upload_file`, formData);
  }

  uploadImage(chatId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('path', '/images/asset_chat_smg/');
    return this.http.post(environment.baseURL + `/api/upload_images`, formData);
  }



  deleteMessage(messageId: number): Observable<any> {
    return this.http.delete(environment.baseURL + `/api/chat_msg/${messageId}`);
  }


  updateChatStatus(id: any): Observable<any> {
    return this.http
      .get<any>(environment.baseURL + '/api/update_chat_status/' + id)
      .pipe(
        tap((result) => {
          this._data.next(result);
        })
      );
  }

  createChat(id: any, name: any): Observable<any> {
    return this.http
      .get<any>(environment.baseURL + '/api/create_chat/' + id + '/' + name)
      .pipe(
        tap((result) => {
          this._data.next(result);
        })
      );
  }
}


