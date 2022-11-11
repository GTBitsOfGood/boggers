import styles from "./UploadPhotoModal.module.css";

export default function UploadPhotoModal({closeModal}) {
  return (
    <div className={styles.Modal}>
      <div className={styles.ModalBox}>
        <div className={styles.ModalCross} onClick={closeModal}>
          &#10006;
        </div>
        <div className={styles.ModalHeader}>UPLOAD A PHOTO</div>
        <div className={styles.ModalUploadButton}>Select File</div>
      </div>
    </div>
  );
}
