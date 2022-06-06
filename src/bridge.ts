import { getBridgeContract } from "./contracts";
import { toBN } from "starknet/utils/number";
import { bnToUint256 } from "starknet/utils/uint256";
import { IStarknetWindowObject } from "get-starknet";
import { GetTransactionStatusResponse } from "starknet";

/**
 * @dev this function withdraws staticATokens on l2 and bridges them back to their corresponding l1 aTokens
 * @param StarnetWallet the connected starknet wallet provided by the @argent/get-starknet package
 * @param l2_token the staticAToken address on Starknet
 * @param l1_recipient the l1 recipient address
 * @param amount to withdraw
 */
export async function withdraw(
  StarknetWallet: IStarknetWindowObject,
  l2_token: bigint,
  l1_recipient: string,
  amount: string
): Promise<GetTransactionStatusResponse> {
  try {
    const bridge = getBridgeContract(StarknetWallet);

    const { transaction_hash: withdrawTxHash } = await bridge.initiate_withdraw(
      l2_token,
      l1_recipient,
      bnToUint256(toBN(amount))
    );

    await StarknetWallet.provider.waitForTransaction(withdrawTxHash);
    return StarknetWallet.provider.getTransactionStatus(withdrawTxHash);
  } catch (err: any) {
    throw new Error(err.message);
  }
}

/**
 * @dev function called to redeem the rewards Aave token on l2 against the rewards tokens on l1
 * @param StarnetWallet the connected starknet wallet provided by the @argent/get-starknet package
 * @param l1_recipient the l1 recipient address
 * @param amount to bridge
 */
export async function bridgeRewards(
  StarknetWallet: IStarknetWindowObject,
  l1_recipient: string,
  amount: string
): Promise<GetTransactionStatusResponse> {
  try {
    const bridge = getBridgeContract(StarknetWallet);

    const { transaction_hash: bridgeRewardsTxHash } =
      await bridge.bridge_rewards(l1_recipient, bnToUint256(toBN(amount)));

    await StarknetWallet.provider.waitForTransaction(bridgeRewardsTxHash);

    return StarknetWallet.provider.getTransactionStatus(bridgeRewardsTxHash);
  } catch (err: any) {
    throw new Error(err.message);
  }
}
