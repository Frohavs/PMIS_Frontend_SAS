export interface CommitteeManager {
  id: number;
  name: string;
  email: string;
  position: string;
}

export interface ProjectDeliverListDetails {
  id: number | null;
  status: any;
  brief: string;
  noticeDate: string;  // Use `Date` type if you plan to work with Date objects
  referenceNumber: string;
  deliveryDate: string;  // Use `Date` if required
  registeredDecisionNumber: number | null;
  registeredDecisionDate: string;  // Use `Date` if required
  achievementDate: string;  // Use `Date` if required
  attachment: string;
  fixingDuration: number | null;
  deliveryDuration: number | null;
  imagePlan: number | null;
  imagePlanCopies: number | null;
  projectId: number | null;
  mangerId: number | null;
  approved: boolean;
  committeeMangers: CommitteeManager[];
}
