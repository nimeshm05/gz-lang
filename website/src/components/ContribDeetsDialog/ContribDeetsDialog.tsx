import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import linkedinIcon from "../../../assets/icons/linkedin.svg";
import githubIcon from "../../../assets/icons/github.svg";
import { Button } from "../Button/Button";
import { PREMIUM_EASE } from "../../motion";
import "./ContribDeetsDialog.css";

const LINKEDIN_HREF = "https://www.linkedin.com/in/nimeshm-work/";
const GITHUB_HREF = "https://github.com/nimeshm05";

const DIALOG_TRANSITION = { duration: 0.25, ease: PREMIUM_EASE } as const;

type ContribDeetsDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ContribDeetsDialog({ open, onClose }: ContribDeetsDialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.button
          key="contrib-deets-backdrop"
          type="button"
          className="contrib-deets-dialog-backdrop"
          aria-label="Close contrib deets"
          onClick={onClose}
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={DIALOG_TRANSITION}
        />
      ) : null}

      {open ? (
        <motion.div
          key="contrib-deets-dialog"
          className="contrib-deets-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ scale: 0.9, opacity: 0, x: "-50%", y: "-50%" }}
          animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
          exit={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
          transition={DIALOG_TRANSITION}
        >
          <div className="contrib-deets-dialog-header">
            <h2 id={titleId} className="contrib-deets-dialog-title">
              Contrib Deets
            </h2>
          </div>

          <div className="contrib-deets-dialog-body">
            <div className="contrib-deets-dialog-content">
              <p className="contrib-deets-dialog-copy">Developed by OG Nimesh.</p>
              <div className="contrib-deets-dialog-links">
                <a
                  className="contrib-deets-dialog-link"
                  href={LINKEDIN_HREF}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="contrib-deets-dialog-link-icon"
                    src={linkedinIcon}
                    alt=""
                    width={20}
                    height={20}
                  />
                  <span>LinkedIn</span>
                </a>
                <a
                  className="contrib-deets-dialog-link"
                  href={GITHUB_HREF}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="contrib-deets-dialog-link-icon"
                    src={githubIcon}
                    alt=""
                    width={20}
                    height={20}
                  />
                  <span>Github</span>
                </a>
              </div>
            </div>

            <Button
              label="Close"
              variant="secondary"
              className="contrib-deets-dialog-close"
              onClick={onClose}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
