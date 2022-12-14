import { useState } from "react";
import styles from "./UploadCSVModal.module.css";

export default function UploadCSVModal({ displayModal, closeModal, setFileBlob }) {
  const [uploading, setUploading] = useState(false);

  const modalTransition = {
    original: { visibility: "hidden" },
    new: { visibility: "visible" },
  };

  const modalBoxTransition = {
    original: { opacity: 0 },
    new: { opacity: 1 },
  };

  return (
    <div className={styles.Modal} style={displayModal ? modalTransition.new : modalTransition.original}>
      <div className={styles.ModalBox} style={displayModal ? modalBoxTransition.new : modalBoxTransition.original}>
        <div className={styles.ModalCross} onClick={closeModal}>
          &#10006;
        </div>
        <div className={styles.ModalHeader}>UPLOAD A CSV FILE</div>
        <label className={styles.ModalUploadButton} style={uploading ? {} : { cursor: "pointer" }}>
          {uploading ? (
            "Uploading..."
          ) : (
            <>
              <input
                type="file"
                style={{ display: "none" }}
                accept=".csv"
                onChange={async (e) => {
                  closeModal();
                  setUploading(true);
                  const uploadedFile = e.target.files[0];
                  if (uploadedFile) {
                    setFileBlob(uploadedFile);
                  }
                  setUploading(false);
                  e.target.value = null;
                }}
              />
              Select File
            </>
          )}
        </label>
      </div>
    </div>
  );
}
