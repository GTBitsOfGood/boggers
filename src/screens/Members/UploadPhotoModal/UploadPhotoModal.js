import {useState} from "react";
import styles from "./UploadPhotoModal.module.css";

export default function UploadPhotoModal({closeModal, setImage, setImageBlob}) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className={styles.Modal}>
      <div className={styles.ModalBox}>
        <div className={styles.ModalCross} onClick={closeModal}>
          &#10006;
        </div>
        <div className={styles.ModalHeader}>UPLOAD A PHOTO</div>
        <label className={styles.ModalUploadButton} style={uploading ? {} : {cursor: "pointer"}}>
          {uploading ? (
            "Uploading..."
          ) : (
            <>
              <input
                type="file"
                style={{display: "none"}}
                accept="image/*"
                onChange={async (e) => {
                  setUploading(true);
                  const uploadedImage = e.target.files[0];
                  const imageUrl = URL.createObjectURL(uploadedImage);
                  setImageBlob(uploadedImage);
                  setImage(imageUrl);
                  setUploading(false);
                  closeModal();
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
