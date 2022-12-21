import React, {useEffect} from "react";
import {useRouter} from "next/router";

export default function ResetPassword() {
  const router = useRouter();
  const {token} = router.query;

  useEffect(() => {
    if (token) {
      fetch("/api/email_verification", {
        method: "POST",
        body: JSON.stringify({
          token,
        }),
      }).then(() => alert("Email verified"));
    }
  }, [token]);

  return <p>placeholder page</p>;
}
