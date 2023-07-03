import { Button, Modal, Typography } from "@mui/material";
import { useTxModalsStyles } from "./useTxModalsStyles";
import { useStores } from "@/hooks";
import { observer } from "mobx-react";
import { Loader } from "../Loader";
import { getSolscanTx } from "@/utils";

export const TxModals = observer(() => {
  const { classes } = useTxModalsStyles();
  const { txModals } = useStores();
  const { open, tx, text, isFetching } = txModals;

  return (
    <Modal open={open ?? false} onClose={() => txModals.closeModal()}>
      <div className={classes.root}>
        <div className={classes.header}>
          <div />
          <Button className={classes.close} onClick={() => txModals.closeModal()}>
            Close
          </Button>
        </div>
        <div className={classes.content}>
          {tx ? (
            <Typography className={classes.txText}>
              {isFetching ? (
                <>
                  <Loader size={25} /> Waiting for the{" "}
                  <a href={getSolscanTx(tx)} target="_blank">
                    transaction
                  </a>{" "}
                  finalization...
                </>
              ) : (
                <>The transaction was finalized</>
              )}
            </Typography>
          ) : (
            <Typography>Please, confirm the transaction {text}...</Typography>
          )}
        </div>
      </div>
    </Modal>
  );
});
