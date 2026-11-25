export interface PhotoStorage {
  /** Stores the bytes and returns the URL guests' browsers will load the image from. */
  put(key: string, body: Buffer, mimeType: string): Promise<string>;
  /**
   * Best-effort removal; resolves even if the object is already gone. `url` is the value `put`
   * returned: the Drive driver needs it to find the file id, other drivers ignore it.
   */
  delete(key: string, url?: string): Promise<void>;
}
