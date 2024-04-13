import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';

//Additionally we need to import a css-file to bé ablet to show the modal
import '@near-wallet-selector/modal-ui/styles.css';


// Wallet that simplifies using the wallet selector
export class Wallet {
  selector;
  wallet;
  network;
  createAccessKeyFor;

  constructor({ createAccessKeyFor = undefined, network = 'testnet' }) {
    this.network = network;
    this.selector = setupWalletSelector({
      network: this.network,
      modules: [setupMyNearWallet(), setupHereWallet()],
    });
  }

  // To be called when the website loads
  async startUp() {
    const walletSelector = await this.selector;
    const isSignedIn = walletSelector.isSignedIn();

    if (isSignedIn) {
      this.wallet = await walletSelector.wallet();
      this.accountId = walletSelector.store.getState().accounts[0].accountId;
    }
    return isSignedIn;
  }

  // Sign-in method
  async signIn() {
    const description = 'Please select a wallet to sign in.';
    const modal = setupModal(await this.selector, { contractId: this.createAccessKeyFor, description });
    modal.show();
  }

  // Sign-out method
  async signOut() {
    await this.wallet.signOut();
    this.wallet = this.accountId = this.createAccessKeyFor = null;
    window.location.replace(window.location.origin + window.location.pathname);
  }

  
}