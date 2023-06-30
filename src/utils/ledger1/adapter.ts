import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import type { default as Transport } from "@ledgerhq/hw-transport";
import type { WalletName } from "@solana/wallet-adapter-base";
import {
  BaseSignerWalletAdapter,
  WalletConnectionError,
  WalletDisconnectedError,
  WalletDisconnectionError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletPublicKeyError,
  WalletReadyState,
  WalletSignTransactionError,
} from "@solana/wallet-adapter-base";
import type {
  PublicKey,
  Transaction,
  TransactionVersion,
  VersionedTransaction,
} from "@solana/web3.js";
import "./polyfills/index.js";
import { getDerivationPath, getPublicKey, signTransaction } from "./util";
import { LedgerHDWalletAccount, LedgerHDWalletPath } from "./types";

type OnConnectingFn = (adapter: LedgerWalletAdapter1) => Promise<LedgerHDWalletAccount | undefined>;

export interface LedgerWalletAdapterConfig {
  derivationPath?: Buffer;
  onConnecting?: OnConnectingFn;
}

export const LedgerWalletName = "Ledger" as WalletName<"Ledger">;

export class LedgerWalletAdapter1 extends BaseSignerWalletAdapter {
  name = LedgerWalletName;
  url = "https://ledger.com";
  icon =
    "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzUgMzUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZiI+PHBhdGggZD0ibTIzLjU4OCAwaC0xNnYyMS41ODNoMjEuNnYtMTZhNS41ODUgNS41ODUgMCAwIDAgLTUuNi01LjU4M3oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUuNzM5KSIvPjxwYXRoIGQ9Im04LjM0MiAwaC0yLjc1N2E1LjU4NSA1LjU4NSAwIDAgMCAtNS41ODUgNS41ODV2Mi43NTdoOC4zNDJ6Ii8+PHBhdGggZD0ibTAgNy41OWg4LjM0MnY4LjM0MmgtOC4zNDJ6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDUuNzM5KSIvPjxwYXRoIGQ9Im0xNS4xOCAyMy40NTFoMi43NTdhNS41ODUgNS41ODUgMCAwIDAgNS41ODUtNS42di0yLjY3MWgtOC4zNDJ6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMS40NzggMTEuNDc4KSIvPjxwYXRoIGQ9Im03LjU5IDE1LjE4aDguMzQydjguMzQyaC04LjM0MnoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUuNzM5IDExLjQ3OCkiLz48cGF0aCBkPSJtMCAxNS4xOHYyLjc1N2E1LjU4NSA1LjU4NSAwIDAgMCA1LjU4NSA1LjU4NWgyLjc1N3YtOC4zNDJ6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDExLjQ3OCkiLz48L2c+PC9zdmc+";
  supportedTransactionVersions: ReadonlySet<TransactionVersion> = new Set(["legacy", 0]);

  private _derivationPath: Buffer;
  private _onConnecting: OnConnectingFn | undefined;

  private _connecting: boolean;
  private _transport: Transport | null;
  private _publicKey: PublicKey | null;
  private _readyState: WalletReadyState =
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof navigator === "undefined" ||
    !navigator.hid
      ? WalletReadyState.Unsupported
      : WalletReadyState.Loadable;

  constructor(config: LedgerWalletAdapterConfig = {}) {
    super();
    this._derivationPath = config.derivationPath || getDerivationPath(0, 0);
    this._onConnecting = config.onConnecting;
    this._connecting = false;
    this._transport = null;
    this._publicKey = null;
  }

  get publicKey() {
    return this._publicKey;
  }

  get connecting() {
    return this._connecting;
  }

  get readyState() {
    return this._readyState;
  }

  async connect(): Promise<void> {
    try {
      if (this.connected || this.connecting) return;
      if (this._readyState !== WalletReadyState.Loadable) throw new WalletNotReadyError();

      this._connecting = true;

      // It doesn't work
      // let TransportWebHIDClass: typeof TransportWebHID;
      // try {
      //     TransportWebHIDClass = (await import('@ledgerhq/hw-transport-webhid')).default;
      // } catch (error: any) {
      //     throw new WalletLoadError(error?.message, error);
      // }

      let transport: Transport;
      let onConnectingAccount: LedgerHDWalletAccount | undefined;
      try {
        // transport = await TransportWebHIDClass.create();
        transport = await TransportWebUSB.create();
        this._transport = transport;
        if (this._onConnecting) {
          onConnectingAccount = await this._onConnecting(this);
          if (!onConnectingAccount) {
            throw new Error("No external account during connection interruption");
          }
        }
      } catch (error: any) {
        throw new WalletConnectionError(error?.message, error);
      }

      let publicKey: PublicKey;
      try {
        publicKey = onConnectingAccount
          ? onConnectingAccount.publicKey
          : await getPublicKey(transport, this._derivationPath);
      } catch (error: any) {
        throw new WalletPublicKeyError(error?.message, error);
      }

      transport.on("disconnect", this._disconnected);

      this._publicKey = publicKey;

      this.emit("connect", publicKey);
    } catch (error: any) {
      this.emit("error", error);
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    const transport = this._transport;
    if (transport) {
      transport.off("disconnect", this._disconnected);

      this._transport = null;
      this._publicKey = null;

      try {
        await transport.close();
      } catch (error: any) {
        this.emit("error", new WalletDisconnectionError(error?.message, error));
      }
    }

    this.emit("disconnect");
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
    try {
      const transport = this._transport;
      const publicKey = this._publicKey;
      if (!transport || !publicKey) throw new WalletNotConnectedError();

      try {
        const signature = await signTransaction(transport, transaction, this._derivationPath);
        transaction.addSignature(publicKey, signature);
      } catch (error: any) {
        throw new WalletSignTransactionError(error?.message, error);
      }

      return transaction;
    } catch (error: any) {
      this.emit("error", error);
      throw error;
    }
  }

  private _disconnected = () => {
    const transport = this._transport;
    if (transport) {
      transport.off("disconnect", this._disconnected);

      this._transport = null;
      this._publicKey = null;

      this.emit("error", new WalletDisconnectedError());
      this.emit("disconnect");
    }
  };

  async fetchAccountsForPaths(paths: LedgerHDWalletPath[]): Promise<LedgerHDWalletAccount[]> {
    if (!this._transport) {
      return [];
    }

    try {
      const result: LedgerHDWalletAccount[] = [];
      for (const path of paths) {
        const derivationPath = getDerivationPath(path.account, path.change);
        const publicKey = await getPublicKey(this._transport, derivationPath);
        result.push({
          ...path,
          publicKey,
        });
      }
      return result;
    } catch (error) {
      throw new Error(error?.message);
    } finally {
      // await this._transport?.close();
    }
  }
}
