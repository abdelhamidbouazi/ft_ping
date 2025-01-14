import React, { useState, useEffect } from "react";
import { twofa_generated, get_me_server } from "@/utils/GET_me server";
import QRCode from "react-qr-code";
import axios from "../../../app/api/axios";
import { Button } from "@nextui-org/react";
import { toast } from "react-toastify";
import Link from "next/link";

const TwoFactorAuth = ({onClose}) => {
  const [me, setMe] = useState(null);
  const [code, setCode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await get_me_server();
        setMe(userData);

        if (userData.isTwoFactorEnable === false) {
          const generatedCode = await twofa_generated();

          setCode(generatedCode.secret);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleActivate = async (e) => {
    e.preventDefault();
    try {
      const ret = await axios
        .post(
          `/auth/2fa_activate`,
          {
            two_fa_code: e.target.two_fa_code.value,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.status == 200) {
            onClose();
            toast.success("2fa activated",
            {
                toastId: 'success1'
            })
          }
        });
    } catch (error) {
      toast.error("Error activating 2fa: Wrong code",
      {
          toastId: 'error1'
      })
    }
  };

  const handleDeactivate = async (e) => {
    e.preventDefault();
    try {
      const ret = await axios.post(
        `/auth/2fa_deactivate`,
        {
          two_fa_code: e.target.two_fa_code.value,
        },
        {
          withCredentials: true,
        }
      );
      if (ret.status == 200) {
        onClose();
        toast.success("2fa desactivated",
        {
            toastId: 'success1'
        })
      }
    } catch (error) {
      toast.error("Error desactivating 2fa: Wrong code",
      {
          toastId: 'error1'
      })
    }
  };

  if (!me) {
    return <div>Loading...</div>;
  }

  if (code) {
    return (
      <div className="flex flex-col items-center gap-4">
        <QRCode value={`otpauth://totp/${me.username}?secret=${code}`} />
        <h2 className="ms-2 font-semibold text-gray-500 dark:text-gray-400">
          DOWNLOAD AN AUTHENTICATOR APP SETTINGS
        </h2>
        <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400">
          Download and install <Link href="https://support.google.com/accounts/answer/1066447?hl=en" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Google Authenticator</Link> for your phone or tablet.
        </p>
        <form onSubmit={handleActivate}>
          <input
            type="text"
            name="two_fa_code"
            required
            autoComplete="off"
            id="default-search"
            className="block w-full p-2 my-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="000 000"
          />
          <br />
          <Button className="bg-midnight text-midnight-secondary" type="submit">
            Activate 2fa
          </Button>
        </form>
      </div>
    );
  } else if (me.isTwoFactorEnable === true) {
    return (
      <div className="flex flex-col items-center">
        <form onSubmit={handleDeactivate}>
          <input
            type="text"
            name="two_fa_code"
            required
            autoComplete="off"
            id="default-search"
            className="block w-full p-2 my-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="000 000"
          />
          <br />
          <Button className="bg-midnight text-midnight-secondary" type="submit">
            Deactivate 2fa
          </Button>
        </form>
      </div>
    );
  } else {
  }
};

export default TwoFactorAuth;
