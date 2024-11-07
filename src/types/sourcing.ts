import type { Pic } from "./hotel";
import type { Refund } from "./refund";
import type { OrderRoom } from "./room";

export interface Sourcing {
  SourcingId?: string;
  UserId?: number;
  Destination: string;
  Latitude?: number;
  Longitude?: number;
  CheckIn: Date;
  CheckOut: Date;
  Nights: number;
  Rooms: number;
  SingleRooms?: number;
  DoubleRooms?: number;
  Residents: number;
  Adults: number;
  Children?: number;
  Keyword: string;
  HotelLevel?: string;
  Budget?: number;
  Requirements?: string;
  Memo?: string;
  CreateTime?: Date;
  SourcingStatus?: number;
  ManagerId: number;
  ManagerLastName?: string;
  ManagerFirstName?: string;
  IsShowResponse?: boolean;
  Province?: string;
  City?: string;
  Area?: string;
}

export interface Deal extends Sourcing {
  DealId?: number;
  DealStatus: number;
}

export interface Order extends Sourcing {
  Id: number;
  OrderNO?: string;
  ManagerPhotoPath?: string;
  ManagerPhotoName?: string;
  HotelLongitudeLatitude: string;
  HotelDistricts: string;
  HotelAddress: string;
  HotelName: string;
  HotelPicList: Pic[];
  OrderRooms: OrderRoom[];
  TotalAmount: number;
  TimeExpire: number; //订单失效时间 订单支付时间加2小时
  PaymentTime: Date; //订单支付时间
  RefundStatus: number; //退款状态
  RefundNum: number; //申请退款次数
  RefundInfo?: Refund;
  CommentStatus?: number; //评价状态
  RefundAmount?: number; //退款金额
  RevenueAmount?: number; //收益
  ManagerMobile?: string;//经理手机
  ManagerEmail?: string;//经理邮箱
  OrderStatus?: number;//订单状态
  IsSettlement?: number;//是否结算
  CustomerName?: string;//客户姓名
  CustomerMobile?: string;//客户手机
  CustomerEmail?: string;//客户邮箱
}
