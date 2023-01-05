import React, { useState } from "react";
import { useRouter } from "next/router";
import sendRequest from "../../../utils/sendToBackend";
import urls from "../../../utils/urls";
import styles from "./ResetPassword.module.css";
import { checkAccountRecovery } from "../../server/mongodb/actions/AccountRecovery";
import connectMongo from "../../server/mongodb/connectMongo";

export default function ResetPassword({ exists, token }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function changePassword(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      // empty
    } else {
      await sendRequest(urls.api.resetPassword, "POST", { password, token });
      alert("Password changed successfully");
    }
  }

  console.log(exists, token, useRouter, styles, setPassword, setConfirmPassword, changePassword);

  return <></>;
}

export const getServerSideProps = async (context) => {
  const { token } = context.params;
  const mongoRes = await connectMongo();
  if (!mongoRes.success) {
    return {
      props: { exists: false, token },
    };
  }
  return {
    props: { exists: await checkAccountRecovery(token), token },
  };
};
