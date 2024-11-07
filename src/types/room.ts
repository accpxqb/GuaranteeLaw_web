import type { Pic } from "./hotel";

export interface Room {
  RoomName: number;
  UnitPrice: number;
  BedNumber: number;
  RoomSize: number;
  RoomType: number;
  BedSize: number;
  PicList: Pic[];
  AllType: [];
  RoomProfile: string;
}

export interface SourcingRoom extends Room {
  Id: number;
  HotelId: number;
  HotelRoomId: number;
  Amenitys: string;
  DaysIn: number;
}

export interface OrderRoom extends Room {
  Id: number;
  Amount: number;
  LOS: number;
  SourcingRoomId: number;
}

export interface RoomExpand extends SourcingRoom {
  HotelName: string;
  Address: string;
  Districts: string;
  HotelProfile: string;
  HotelPicList: Pic[];
  RoomPicList: Pic[];
  LongitudeLatitude: string;
}
