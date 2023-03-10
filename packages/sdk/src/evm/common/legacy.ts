import IWeb3sdksContractABI from "@web3sdks/contracts-js/dist/abis/IWeb3sdksContract.json";
import { ethers } from "ethers";

export async function getPrebuiltInfo(
  address: string,
  provider: ethers.providers.Provider,
): Promise<{ type: string; version: number } | undefined> {
  try {
    const contract = new ethers.Contract(
      address,
      IWeb3sdksContractABI,
      provider,
    );
    const [type, version] = await Promise.all([
      ethers.utils
        .toUtf8String(await contract.contractType()) // eslint-disable-next-line no-control-regex
        .replace(/\x00/g, ""),
      await contract.contractVersion(),
    ]);
    return {
      type,
      version,
    };
  } catch (e) {
    return undefined;
  }
}
