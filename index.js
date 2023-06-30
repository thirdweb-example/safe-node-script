import { LocalWallet, SafeWallet } from "@thirdweb-dev/wallets";
import { config } from "dotenv";
import {
  activeChain,
  editionDropAddress,
  editionDropTokenId,
  safeAddress,
} from "./const/yourDetails.js";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

config();

(async () => {
  // Initialize the local wallet with private key
  const localWallet = new LocalWallet({ chain: activeChain });
  await localWallet.import({
    privateKey: process.env.WALLET_PRIVATE_KEY,
    encryption: false,
  });
  await localWallet.connect();

  const localWalletAddress = await localWallet.getAddress();
  console.log(`✨ Local wallet address: ${localWalletAddress}`);

  // Initialize the safe with the local wallet
  const safe = new SafeWallet();
  await safe.connect({
    chain: activeChain,
    personalWallet: localWallet,
    safeAddress: safeAddress,
  });

  console.log(`✨ Safe address: ${safeAddress}`);

  // Initialize thirdweb SDK with Safe wallet
  // (or you can get signer using safe.getSigner())
  const sdk = await ThirdwebSDK.fromWallet(safe, activeChain);

  try {
    // Claiming access NFT
    const contract = await sdk.getContract(editionDropAddress);
    console.log("🚦 Claiming NFT...");
    const claimTxn = await contract.erc1155.claim(editionDropTokenId, 1);
    console.log(
      `🪄 Access NFT claimed! Txn hash: ${claimTxn.receipt.transactionHash}`
    );
  } catch (error) {
    console.error(`❌ Error claiming NFT: ${error.message}`);
  }
})();
