export interface ApiListResponse<T> {
  currentPage: number;
  skippedRecords: number;
  totalPages: number;
  hasNext: boolean;
  content: T[];
  payloadSize: number;
  totalRecords: number;
}
