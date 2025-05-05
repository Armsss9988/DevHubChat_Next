declare global {
  interface FileData {
    buffer: number[];
    mimetype: string;
    originalname: string;
  }
}
export {};
