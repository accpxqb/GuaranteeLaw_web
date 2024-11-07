export interface Refund {
  Id?: number;
  OrderId: number;
  OrderRoomId?: number;
  UserId?: number;
  ManagerId?: number;
  RequestTime?: string;
  RefundReason: string;
  RefundMethod?: number;
  RefundAccount?: string;
  RefundAmount: number;
  RefundStatus?: number;
  Notes: string;
  ApprovedTime?: string;
  FinishTime?: string;
  Pictures: string[];
  IsApproved?: boolean;
  RejectReason?: string;
  InterventionNotes?: string;
}
