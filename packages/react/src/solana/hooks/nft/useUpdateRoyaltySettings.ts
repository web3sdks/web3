import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import {
  requiredParamInvariant,
  RequiredParam,
} from "../../../core/query-utils/required-param";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  NFTCollection,
  NFTDrop,
  UpdateRoyaltySettingsInput,
} from "@web3sdks/sdk/solana";

/**
 * Update the royalty for an NFT program
 * @param program - The NFT program instance to update the royalty for
 *
 * @example
 * ```jsx
 * import { useProgram, useUpdateRoyaltySettings } from "@web3sdks/react/solana";
 *
 * export default function Component() {
 *   const { program } = useProgram("{{program_address}}");
 *   const { mutateAsync: updateRoyalties, isLoading, error } = useUpdateRoyaltySettings(program);
 *
 *   return (
 *     <button
 *       onClick={() => updateRoyalties(300)}
 *     >
 *       Update Royalties
 *     </button>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useUpdateRoyaltySettings(
  program: RequiredParam<NFTCollection | NFTDrop>,
) {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ sellerFeeBasisPoints, updateAll }: UpdateRoyaltySettingsInput) => {
      requiredParamInvariant(program, "program is required");
      return await program.updateRoyalty(sellerFeeBasisPoints, updateAll);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}
