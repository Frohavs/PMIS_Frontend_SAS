export interface CommitteeManager {
  id: number;
  name: string;
  email: string;
  position: string;
}

export interface ProjectDeliverListDetails {
  id: number | null;
  isPartially: boolean;
  brief: string;
  registeredDecisionDate: string; // `Date` type is an option too
  registeredDecisionNumber: number | null;
  deliveryDate: string; // Similarly, you can use `Date` type
  referenceNumber: string;
  noticeDate: string; // You could also use `Date` here if you plan to handle it as a Date object
  committeeMangers: CommitteeManager[];
  achievementDate: string; // `Date` type is an option
  attachment: string;
  fixingDuration: number | null;
  deliveryDuration: number | null;
  imagePlanCopies: number | null;
  imagePlan: number | null;

  projectId: number | null;
  managerId: number | null;
  approved: boolean;
}
