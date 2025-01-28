import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  API_USERS_URL = `${environment.apiUrl}/Lookup`;
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
  }

  getProjects(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetProjects`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getUsers(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetUserType`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getManagerUsers(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetUserType?role=1`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  allUsers(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetUserType`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getUnits() {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetUnits`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getVats() {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetVats`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getVendorType(id: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetCompanyVendors?vendorTypeId=${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getCashFlowYears(projectId: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetYears?projectId=${projectId}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getStackHolders(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetStakeHolders`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getSubContractors(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetSubContractors`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getYears(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetYears`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getMonths(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetMonths`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getAdministrators(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetRfpAdministrators`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getRfpSignatureCategories(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetRfpSignatureCategories`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getRfpSignatureSubCategories(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetRfpSignatureSubCategories`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getTimeScheduleTypes(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetTimeScheduleTypes`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getBoqsByProjectId(id: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetBoqs/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getEvaluationScales(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetEvaluationScales`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getRiskCategories(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetRiskCategories`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getRiskConsequences(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetRiskConsequences`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getRiskEffectiveParties(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetRiskEffectiveParties`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getRiskTypes(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetRiskTypes`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getFactoryCRS(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetFactoryCRS`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getFactoryFields(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetFactoryFields`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getInitialDeliverableSteps(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetInitialDeliverableSteps`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getInitialDeliverables(phaseId: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetInitialDeliverables/${phaseId}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getAttachmentCategories(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetAttachmentCategories`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getAttachmentSubCategories(id: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetAttachmentSubCategories/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getAttachmentClassifications(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetAttachmentClassifications`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getAttachmentSubClassifications(id: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetAttachmentSubClassifications/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getAttachmentPurposes(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetAttachmentPurposes`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getAttachmentStatuses(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetAttachmentStatuses`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getFindingCategories(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetFindingCategories`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getFindingClassifications(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetFindingClassifications`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getIntialDeliveryStatusSteps(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetIntialDeliveryStatusSteps`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getFinalDeliveryStatusSteps(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetFinalDeliveryStatusSteps`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getStumbledImpactLevels(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetStumbledImpactLevels`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getStumbledImpactTypes(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetStumbledImpactTypes`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getStumbledReasonTypes(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetStumbledReasonTypes`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getStumbledResponsibilities(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetStumbledResponsibilities`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getStumbledStatuses(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetStumbledStatuses`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getMIRStatuses(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      LanguageCode: 'ar'
    });
    const url = `${this.API_USERS_URL}/GetMIRStatuses`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getMIRTypes(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      LanguageCode: 'ar'
    });
    const url = `${this.API_USERS_URL}/GetMIRTypes`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getMIRNoteTypes(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      LanguageCode: 'ar'
    });
    const url = `${this.API_USERS_URL}/GetMIRNoteTypes`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getRfpAdministrators(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      LanguageCode: 'ar'
    });
    const url = `${this.API_USERS_URL}/GetRfpAdministrators`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getRfpClassifications(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      LanguageCode: 'ar'
    });
    const url = `${this.API_USERS_URL}/GetRfpClassifications`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getRfpRequestWays(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      LanguageCode: 'ar'
    });
    const url = `${this.API_USERS_URL}/GetRfpRequestWays`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getRfpTypes(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      LanguageCode: 'ar'
    });
    const url = `${this.API_USERS_URL}/GetRfpTypes`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getRFIStatuses(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      LanguageCode: 'ar'
    });
    const url = `${this.API_USERS_URL}/GetRFIStatuses`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getRFITypes(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      LanguageCode: 'ar'
    });
    const url = `${this.API_USERS_URL}/GetRFITypes`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getRFINoteTypes(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      LanguageCode: 'ar'
    });
    const url = `${this.API_USERS_URL}/GetRFINoteTypes`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getCorrespondenceTypes(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      LanguageCode: 'ar'
    });
    const url = `${this.API_USERS_URL}/GetCorrespondenceTypes`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getProjectStages(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      LanguageCode: 'ar'
    });
    const url = `${this.API_USERS_URL}/GetProjectStages`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  


}
