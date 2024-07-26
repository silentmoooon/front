export interface BaseData<T> {
  // User's unique identifier
  // 用户的唯一标识符
  code: number;

  // User's username
  // 用户名
  message: string;

  // User's phone number
  // 手机号
  data: T | null;

  page?: Page | null;

}
interface Page {
  totalPage: number;
  totalPageSize: number;
  size: number;
  page: number;
}
