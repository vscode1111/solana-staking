import { Button, Modal } from "@mui/material";
import { useModalsStyles } from "./useModalsStyles";
import { useStores } from "@/hooks";
import { observer } from "mobx-react";

export const Modals = observer(() => {
  const { classes } = useModalsStyles();
  const { modals } = useStores();
  const { render } = modals;

  if (!render) {
    return null;
  }

  return (
    <Modal open onClose={() => modals.closeModal()}>
      <div className={classes.root}>
        <div className={classes.header}>
          <div />
          <Button className={classes.close} onClick={() => modals.closeModal()}>
            Close
          </Button>
        </div>
        {render()}
      </div>
    </Modal>
  );
});
