//业务类型
export enum ManagerType {
  乐住 = 1,
  乐玩 = 2,
  乐食 = 3,
}
/**
 * 需求状态
 */
export enum SourcingStatus {
  /* 已取消*/
  Canceled = -1,
  /* 待接单*/
  Pending = 0,
  /* 已接单*/
  Received = 1,
  /* 已付款*/
  Paid = 2,
  /**
   * 支付中
   */
  Progress = 4,
}

/**
 * 订单状态
 */
export enum OrderStatus {
  /**
   * 已取消
   */
  Canceled = -1,
  /**
   * 待付款
   */
  Pending = 0,
  /**
   * 已付款
   */
  Paid = 1,
  /**
   * 已完成
   */
  Completed = 2,
  /**
   * 已退款
   */
  Refunded = 3,
  /**
   * 支付中
   */
  Progress = 4,
  /**
   * 入住中
   */
  CheckIn = 5,
}

/**
 * 订单退款状态
 * @enum {number}
 * @readonly
 * @property {number} NoRefund 未退款
 * @property {number} Refunding 正在申请退款
 * @property {number} RefundPass 审核通过
 * @property {number} Refunded 已退款
 * @property {number} RefundCancel 取消申请退款
 */
export enum OrderRefundStatus {
  /**
   * 未退款
   */
  NoRefund = 0,
  /**
   * 正在申请退款
   */
  Refunding = 1,
  /**
   * 审核通过
   */
  RefundPass = 2,
  /**
   * 已退款
   */
  Refunded = 3,
  /**
   * 取消申请退款
   */
  RefundCancel = 4,
  /**
   * 拒绝退款
   */
  RefundReject = 5,

  /**
   * 客服介入
   */
  CsIntervention = 6,
  /**
   * 客服拒绝
   */
  CsReject = 7,
}

export enum RefundStatus {
  /**
   * 待处理
   */
  Pending = 0,
  /**
   * 已同意
   */
  Approved = 1,
  /**
   * 被驳回
   */
  Rejected = 2,
  /**
   * 已取消
   */
  Canceled = 3,
  /**
   * 退款成功
   */
  Success = 4,
  /**
   * 客服介入
   */
  Intervention = 5,
  /**
   * 客服介入通过
   */
  InterventionApproved = 6,
  /**
   * 客服介入驳回
   */
  InterventionRejected = 7,
  /**
   * 客服介入退款成功
   */
  InterventionSuccess = 8,
}

export enum CommentStatus {
  /**
   * 未评论
   */
  UnComment = 0,
  /**
   * 已评论
   */
  Commented = 1,
  /**
   * 已追评
   */
  FollowUp = 2,
}

export enum VerificationStatus {
  //无验证
  None = 0,
  //通过
  Approved = 1,
  //驳回
  Rejected = 2,
  //待审核
  Pending = 3,
}

export enum BusinessType {
  common = 0,
  hotel = 1,
  play = 2,
  eat = 3,
}


export enum LicenseVerifyStatus {
  //无验证
  None = 0,
  //待审核
  Pending = 1,
  //通过
  Approved = 2,
  //驳回
  Rejected = 3,
}

export enum IdVerifyStatus {
  //无验证
  None = 0,
  //通过
  Approved = 1,
  //待审核
  Pending = 2,
  //驳回
  Rejected = 3,
}