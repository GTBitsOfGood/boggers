import {useState} from "react";
import styles from "./UploadPhotoModal.module.css";
import axios from "axios";

export default function UploadPhotoModal({closeModal, setImage}) {
  const [uploading, setUploading] = useState(false);
  const convertToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

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
                  const convertedFile = await convertToBase64(uploadedImage);
                  const {data} = await axios.put("/api/image_upload", {
                    image: convertedFile,
                    name: uploadedImage.name,
                    type: uploadedImage.type,
                  });
                  setImage(data.payload.url);
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
