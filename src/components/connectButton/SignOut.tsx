import React, { Fragment, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { useDisconnect } from "wagmi";
import { getImage, shortenAddress } from "@/lib/utils";
import { useModal } from "@/common/contexts/ModalContext";
import { useUser } from "@/common/contexts/UserContext";
import { useRouter } from "next/navigation";
import { HOME_PAGE } from "@/common/page-links";
import { useAuthModal, useLogout, useSignerStatus, useUser as useAlchemyUser } from "@account-kit/react";
import Button from "../ui/Button";
import ToolTip from "../toolTip";
import { LogOut } from "lucide-react";

const SignOutButton = () => {
  const { address, signUserOut, isInitializing } = useUser();
  const { isPending } = useDisconnect();
  const { showModal, hideModal } = useModal();
  const router = useRouter();
  const user = useAlchemyUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();

  function handleDisconnect() {
    console.log("Disconnecting...");
    router.push(HOME_PAGE);
    signUserOut();
  }

  //sign out
  useEffect(() => {
    if (isPending) {
      showModal(<div>loading...</div>);
    } else {
      hideModal();
    }
  }, [isPending]);

  return (
    <Fragment>
      {address && (
        <div className=" flex flex-col justify-between gap-1 text-black dark:text-white py-2">
          <span>{shortenAddress(address)}</span>
          <Button
            className="p2 text-gray-50 dark:text-gray-900 bg-black dark:bg-gray-50"
            onClick={() => handleDisconnect()}
            text="Sign Out"
            icon={<LogOut />}
          ></Button>
        </div>
      )}
      {!address && (
        <Button
          loading={isInitializing}
          className="p2 text-gray-50 dark:text-gray-900 bg-black dark:bg-gray-50"
          onClick={openAuthModal}
        >
          Sign In
        </Button>
      )}
    </Fragment>
  );
};

export default SignOutButton;
