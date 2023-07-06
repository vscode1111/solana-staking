import { observer } from "mobx-react";
import { useLedgerDialogStyles } from "./useLedgerDialogStyles";
import { useInitEffect, useStores } from "@/hooks";
import { Button, Typography } from "@mui/material";
import { Loader } from "../Loader";
import { LedgerHDWalletAccount, printError, printSol } from "@/utils";
import { DerivationPathButton } from "./components";
import { useState } from "react";
import { uid } from "react-uid";
import { toJS } from "mobx";

export const LedgerDialog = observer(() => {
  const { classes } = useLedgerDialogStyles();
  const [selectedAccounts, setSelectedAccounts] = useState<LedgerHDWalletAccount[] | null>();
  const { ledger, modals } = useStores();
  const {
    fetchStatus,
    fetchError,
    accounts0,
    accounts1,
    accounts2,
    accounts3,
    fetchStatus0,
    fetchStatus1,
    fetchStatus2,
    fetchStatus3,
  } = ledger;

  useInitEffect(() => {
    ledger.init();
  });

  if (fetchStatus === "fetching") {
    return <Loader />;
  }

  return (
    <div className={classes.root}>
      {fetchError ? (
        <Typography color="red">{printError(fetchError)}</Typography>
      ) : (
        <div className={classes.content}>
          {selectedAccounts ? (
            <>
              <Button className={classes.back} onClick={() => setSelectedAccounts(null)}>
                Back
              </Button>
              {selectedAccounts?.map((account) => (
                <Button
                  key={uid(account)}
                  className={classes.button}
                  onClick={() => {
                    ledger.setSelectedAccount(account);
                    modals.closeModal();
                  }}
                >
                  {/* <Typography>{`${account.publicKey.toBase58()} - ${account.account}/${
                    account.change
                  }`}</Typography> */}
                  <Typography>{`${account.publicKey.toBase58()}`}</Typography>
                  <Typography>{printSol(account.balance)}</Typography>
                </Button>
              ))}
            </>
          ) : (
            <>
              <DerivationPathButton
                caption="m/44'/501+'"
                accounts={toJS(accounts0)}
                fetchStatus={fetchStatus0}
                onClick={() => setSelectedAccounts(accounts0)}
              />
              <DerivationPathButton
                caption="m/44'/501'/0'"
                accounts={toJS(accounts1)}
                fetchStatus={fetchStatus1}
                onClick={() => setSelectedAccounts(accounts1)}
              />
              <DerivationPathButton
                caption="m/44'/501'/0'/0'"
                accounts={toJS(accounts2)}
                fetchStatus={fetchStatus2}
                onClick={() => setSelectedAccounts(accounts2)}
              />
              <DerivationPathButton
                caption="m/44'/501'/0'/X'"
                accounts={toJS(accounts3)}
                fetchStatus={fetchStatus3}
                hideNullBalance
                onClick={() => setSelectedAccounts(accounts3)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
});
