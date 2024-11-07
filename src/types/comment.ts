import type { PageRequest } from "./page-request";

export interface CommentModel {
  Id?: number;
  OrderId?: number;
  PicUrlList: string[];
  CommentContent?: string;
  EnvironmentalScore: number;
  HealthScore: number;
  ServiceScore: number;
  FacilityScore: number;
  IsFollowUp?: boolean;
  IsPositive?: boolean;
  IsReply?: boolean;
  ManagerId?: number;
  CreateTime?: string;
}

interface UserInfo {
  LastName?: string;
  FirstName?: string;
  PhotoName?: string;
  PhotoPath?: string;
  FullName: string;
  NickName?: string;
}

export interface CommentWithReply {
  UserInfo: UserInfo;
  CommentInfo: CommentModel;
  ReplyInfo?: CommentModel;
}

export interface CommentInfo extends CommentWithReply {
  FollowUpInfo?: CommentWithReply;
}

export interface CommentPageRequest extends PageRequest {
  ManagerId?: number;
  ManagerType?: number;
}
