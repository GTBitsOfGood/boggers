import React, { useEffect } from "react";
import { useRouter } from "next/router";
import sendRequest from "../../../utils/sendToBackend";
import urls from "../../../utils/urls";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    (async () => {
      if (token) {
        await sendRequest(urls.api.emailVerification, "POST", { token });
        alert("Email verified");
      }
    })();
  }, [token]);

  return <p>placeholder page</p>;
}
