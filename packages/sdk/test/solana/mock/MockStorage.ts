import {
  MockUploader,
  MockDownloader,
  Web3sdksStorage,
} from "@web3sdks/storage";

export function MockStorage(): Web3sdksStorage {
  // Store mapping of URIs to files/objects
  const storage = {};

  const uploader = new MockUploader(storage);
  const downloader = new MockDownloader(storage);
  return new Web3sdksStorage({ uploader, downloader });
}
