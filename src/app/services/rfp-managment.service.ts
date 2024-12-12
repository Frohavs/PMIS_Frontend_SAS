import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RfpManagementService {

  API_USERS_URL = `${environment.apiUrl}`;
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
  }

  // RFP methods
  getRfpList(pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 10
      }
    }
    const url = `${this.API_USERS_URL}/Rfp/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRFPById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Rfp/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getRFPLogsById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Rfp/GetLogs/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRFPManagement(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Rfp/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  getAllInitialChecks(rfpId: number, pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      rfpId: rfpId,
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 20
      }
    }
    const url = `${this.API_USERS_URL}/Rfp/GetRfpInitialChecks`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  updateIntialCheckRfp(body: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    const url = `${this.API_USERS_URL}/Rfp/UpdateIntialCheckRfp`;
    return this.http.put<any>(url, body, {
      headers: httpHeaders
    });
  }
  moveRfpIntialCheck(body: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    const url = `${this.API_USERS_URL}/Rfp/MoveRfpIntialCheck`;
    return this.http.put<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRfpOwnerChecks(rfpId: number, pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      rfpId: rfpId,
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 20
      }
    }
    const url = `${this.API_USERS_URL}/Rfp/GetRfpOwnerChecks`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  updateOwnerCheckRfp(body: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    const url = `${this.API_USERS_URL}/Rfp/UpdateOwnerCheckRfp`;
    return this.http.put<any>(url, body, {
      headers: httpHeaders
    });
  }
  mMoveRfpOwnerCheck(body: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    const url = `${this.API_USERS_URL}/Rfp/MoveRfpOwnerCheck`;
    return this.http.put<any>(url, body, {
      headers: httpHeaders
    });
  }
  // RfpAdministrator methods
  getAllAdministrator(pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 10
      }
    }
    const url = `${this.API_USERS_URL}/RfpAdministrator/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRFPAdministratorById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpAdministrator/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRFPAdministrator(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpAdministrator/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updateAdministrator(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpAdministrator/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  // RfpClassification methods
  getAllClassification(pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 10
      }
    }
    const url = `${this.API_USERS_URL}/RfpClassification/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRFPClassificationById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpClassification/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRFPClassification(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpClassification/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updateClassification(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpClassification/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }

  // RfpDepartment methods
  getAllDepartment(pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 10
      }
    }
    const url = `${this.API_USERS_URL}/RfpDepartment/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRFPDepartmentById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpDepartment/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRFPDepartment(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpDepartment/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updateDepartment(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpDepartment/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  // RfpPostion methods
  getAllPosition(pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 10
      }
    }
    const url = `${this.API_USERS_URL}/RfpPostion/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRFPPositionById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpPostion/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRFPPosition(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpPostion/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updatePosition(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpPostion/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  // RfpSection methods
  getAllRfpSections(pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 10
      }
    }
    const url = `${this.API_USERS_URL}/RfpSection/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRfpSectionById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpSection/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRfpSection(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpSection/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updateRfpSection(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpSection/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  // RfpInitialCheck methods
  getAllInitialCheck(pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 10
      }
    }
    const url = `${this.API_USERS_URL}/RfpInitialCheck/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRfpInitialCheckById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpInitialCheck/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRfpInitialCheck(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpInitialCheck/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updateRfpInitialCheck(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpInitialCheck/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  // RfpOwnerCheck methods
  getAllOwnerCheck(pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 10
      }
    }
    const url = `${this.API_USERS_URL}/RfpOwnerCheck/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRfpOwnerCheckById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpOwnerCheck/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRfpOwnerCheck(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpOwnerCheck/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updateRfpOwnerCheck(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpOwnerCheck/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  // RfpType methods
  getAllTypes(pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 10
      }
    }
    const url = `${this.API_USERS_URL}/RfpType/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRfpTypeById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpType/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRfpType(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpType/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updateRfpType(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpType/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }
}
