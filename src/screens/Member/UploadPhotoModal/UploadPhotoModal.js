import { useState } from "react";
import styles from "./UploadPhotoModal.module.css";

export default function UploadPhotoModal({ displayModal, closeModal, setDeleteImage, setImageUrl, setImageBlob }) {
  const [uploading, setUploading] = useState(false);

  const modalTransition = {
    original: { visibility: "hidden" },
    new: { visibility: "visible" },
  };

  const modalBoxTransition = {
    original: { opacity: 0 },
    new: { opacity: 1 },
  };

  const removePhotoHandler = (e) => {
    e.preventDefault();
    setImageBlob(null);
    setImageUrl("/Avatar.png");
    setDeleteImage(true);
    closeModal();
  };

  return (
    <div className={styles.Modal} style={displayModal ? modalTransition.new : modalTransition.original}>
      <div className={styles.ModalBox} style={displayModal ? modalBoxTransition.new : modalBoxTransition.original}>
        <div className={styles.ModalCross} onClick={closeModal}>
          &#10006;
        </div>
        <div className={styles.ModalHeader}>UPLOAD A PHOTO</div>
        <div className={styles.ModalButtonContainer}>
          <label className={styles.ModalUploadButton} style={uploading ? {} : { cursor: "pointer" }}>
            {uploading ? (
              "Uploading..."
            ) : (
              <>
                <input
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={async (e) => {
                    setUploading(true);
                    const uploadedImage = e.target.files[0];
                    if (!uploadedImage) {
                      setUploading(false);
                      return;
                    }
                    const imageUrl = URL.createObjectURL(uploadedImage);
                    setImageBlob(uploadedImage);
                    setImageUrl(imageUrl);
                    setDeleteImage(false);
                    setUploading(false);
                    closeModal();
                  }}
                />
                Select File
              </>
            )}
          </label>
          <label className={styles.ModalUploadButton} style={{ cursor: "pointer" }} onClick={removePhotoHandler}>
            Remove Photo
          </label>
        </div>
      </div>
    </div>
  );
}
