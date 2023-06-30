import { observer } from "mobx-react";
import { useLedgerDialogStyles } from "./useLedgerDialogStyles";
import { useInitEffect, useStores } from "@/hooks";
import { Button, Typography } from "@mui/material";
import { Loader } from "../Loader";
import { LedgerHDWalletAccount, printError } from "@/utils";
import { DerivationPathButton } from "./components";
import { useState } from "react";
import { uid } from "react-uid";

export const LedgerDialog = observer(() => {
  const { classes } = useLedgerDialogStyles();
  const [selectedAccounts, setSelectedAccounts] = useState<LedgerHDWalletAccount[] | null>();
  const { ledger, modals } = useStores();
  const { fetchStatus, fetchError, accounts0, accounts1, accounts2 } = ledger;

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
              <Button className={classes.button} onClick={() => setSelectedAccounts(null)}>
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
                  {account.publicKey.toBase58()}
                </Button>
              ))}
            </>
          ) : (
            <>
              {accounts0 && accounts0.length > 0 && (
                <DerivationPathButton
                  caption="m/44'/501'"
                  accounts={accounts0}
                  onClick={() => setSelectedAccounts(accounts0)}
                />
              )}
              {accounts1 && accounts1.length > 0 && (
                <DerivationPathButton
                  caption="m/44'/501'/0'"
                  accounts={accounts1}
                  onClick={() => setSelectedAccounts(accounts1)}
                />
              )}
              {accounts2 && accounts2.length > 0 && (
                <DerivationPathButton
                  caption="m/44'/501'/0'/0'"
                  accounts={accounts2}
                  onClick={() => setSelectedAccounts(accounts2)}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
});
