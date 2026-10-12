export interface PhotoStorage {
  /** Stores the bytes and returns the URL guests' browsers will load the image from. */
  put(key: string, body: Buffer, mimeType: string): Promise<string>;
  /** Best-effort removal; resolves even if the object is already gone. */
  delete(key: string): Promise<void>;
}
