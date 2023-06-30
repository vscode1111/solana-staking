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
	const { fetchStatus, fetchError, accounts0, accounts1, accounts2, fetchStatus0, fetchStatus1, fetchStatus2 } = ledger;

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
							{/* <DerivationPathButton
								caption="m/44'/501'"
								accounts={accounts0}
								fetchStatus={fetchStatus0}
								fetchBalance={() => ledger.fetchBalance0()}
								onClick={() => setSelectedAccounts(accounts0)}
							/> */}
							<DerivationPathButton
								caption="m/44'/501'/0'"
								accounts={ledger.accounts1}
								fetchStatus={ledger.fetchStatus1}
								fetchBalance={() => ledger.fetchBalance1()}
								onClick={() => setSelectedAccounts(ledger.accounts1)}
							/>
							{/* <DerivationPathButton
								caption="m/44'/501'/0'/0'"
								accounts={accounts2}
								fetchStatus={fetchStatus2}
								fetchBalance={() => ledger.fetchBalance2()}
								onClick={() => setSelectedAccounts(accounts2)}
							/> */}
						</>
					)}
				</div>
			)}
		</div>
	);
});
