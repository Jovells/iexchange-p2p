import { Client } from "@xmtp/xmtp-js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useConnect } from "wagmi";
import { useEthersSigner as useSigner } from "./useEthersSigner";
import { getAppVersion, getEnv, loadKeys, storeKeys } from "@/common/helpers";
import { useClient, useCanMessage } from "@xmtp/react-sdk";
import { Signer } from "ethers";
import { useUser } from "../contexts/UserContext";
import { reset } from "viem/actions";
import { ixToast } from "@/lib/utils";

type ClientStatus = "new" | "created" | "enabled";

type ResolveReject<T = void> = (value: T | PromiseLike<T>) => void;

/**
 * This is a helper function for creating a new promise and getting access
 * to the resolve and reject callbacks for external use.
 */
const makePromise = <T = void>() => {
  let reject: ResolveReject<T> = () => {};
  let resolve: ResolveReject<T> = () => {};
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return {
    promise,
    reject,
    resolve,
  };
};

// XMTP client options
const clientOptions = {
  apiUrl: process.env.NEXT_PUBLIC_XMTP_API_URL,
  env: getEnv(),
  appVersion: getAppVersion(),
};

console.log("qf client options", clientOptions);

const useInitXmtpClient = () => {
  // track if onboarding is in progress
  const onboardingRef = useRef(false);
  const signerRef = useRef<Signer | null>();
  // XMTP address status
  const [status, setStatus] = useState<ClientStatus | undefined>();
  const [preInit, setPreInit] = useState(true);
  // is there a pending signature?
  const [signing, setSigning] = useState(false);
  const signer = useSigner();
  const { isConnected } = useUser();
  const { connect: connectWallet } = useConnect();
  const [reset, setReset] = useState(false);

  /**
   * In order to have more granular control of the onboarding process, we must
   * create promises that we can resolve externally. These promises will allow
   * us to control when the user is prompted for signatures during the account
   * creation process.
   */

  // create promise, callback, and resolver for controlling the display of the
  // create account signature.
  const { createResolve, preCreateIdentityCallback, resolveCreate } = useMemo(() => {
    const { promise: createPromise, resolve: createResolve } = makePromise();
    return {
      createResolve,
      preCreateIdentityCallback: () => createPromise,
      // executing this function will result in displaying the create account
      // signature prompt
      resolveCreate: async () => {
        setSigning(true);
        createResolve();
        enableResolve();
        return postEnablePromise;
      },
    };
    // if the signer changes during the onboarding process, reset the promise
  }, [signer, reset]);

  // create promise, callback, and resolver for controlling the display of the
  // enable account signature.
  const {
    enableResolve,
    preEnableIdentityCallback,
    postEnableReject,
    resolveEnable,
    postEnableResolve,
    postEnablePromise,
  } = useMemo(() => {
    const { promise: postEnablePromise, reject: postEnableReject, resolve: postEnableResolve } = makePromise();
    const { promise: enablePromise, resolve: enableResolve } = makePromise();
    return {
      postEnableResolve,
      postEnablePromise,
      postEnableReject,
      enableResolve,
      // this is called right after signing the create identity signature
      preEnableIdentityCallback: () => {
        setSigning(false);
        setStatus("created");
        return enablePromise;
      },
      // executing this function will result in displaying the enable account
      // signature prompt
      resolveEnable: async () => {
        enableResolve();
        setSigning(true);
        await postEnablePromise;
      },
    };
    // if the signer changes during the onboarding process, reset the promise
  }, [signer, reset]);

  const { client, isLoading, disconnect, initialize } = useClient();
  const { canMessageStatic: canMessageUser } = useCanMessage();

  useEffect(() => {
    console.log("qf once useeffect", client);
    if (!client) {
      setStatus(undefined);
    }
  }, []);

  // the code in this effect should only run once
  useEffect(() => {
    console.log("qg client only once", client, signer?.address);
    console.log(
      "qg promises",
      "precreate",
      preCreateIdentityCallback(),
      "postenable",
      postEnablePromise,
      "preenable",
      preEnableIdentityCallback(),
    );
    const updateStatus = async () => {
      // onboarding is in progress
      if (onboardingRef.current) {
        // the signer has changed, restart the onboarding process
        if (signer !== signerRef.current) {
          setStatus(undefined);
          setSigning(false);
        } else {
          // onboarding in progress and signer is the same, do nothing
          return;
        }
      }
      // skip this if we already have a client and ensure we have a signer
      console.log("qg skip if there's a client", client);
      if (!client && signer) {
        onboardingRef.current = true;
        const address = await signer.getAddress();
        let keys = loadKeys(address);
        console.log("qg load keys", keys);
        // check if we already have the keys
        if (keys) {
          // resolve client promises
          createResolve();
          enableResolve();
          // no signatures needed
          setStatus("enabled");
        } else {
          // demo mode, wallet won't require any signatures
          // no keys found, but maybe the address has already been created
          // let's check

          const canMessage = await canMessageUser(address, clientOptions);
          console.log("qg can message", canMessage);
          if (canMessage) {
            // resolve client promise
            createResolve();
            // identity has been created
            setStatus("created");
          } else {
            // no identity on the network
            setStatus("new");
          }

          // get client keys
          console.log("qg getting keys", { address, status });

          setPreInit(false);

          try {
            keys = await Client.getKeys(signer, {
              ...clientOptions,
              // we don't need to publish the contact here since it
              // will happen when we create the client later
              skipContactPublishing: true,
              // we can skip persistence on the keystore for this short-lived
              // instance
              persistConversations: false,
              preCreateIdentityCallback,
              preEnableIdentityCallback,
            });
          } catch (error: any) {
            onboardingRef.current = false;
            ixToast.error(error.message);
            postEnableReject(error);
            return setReset(!reset);
          }
          console.log("qg keys", keys);
          // all signatures have been accepted
          setStatus("enabled");
          setSigning(false);
          // persist client keys
          storeKeys(address, keys);
        }

        // initialize client
        console.log("qg initializing client", keys, clientOptions, signer.address);
        await initialize({ keys, options: clientOptions, signer });
        onboardingRef.current = false;
        postEnableResolve();
      }
    };
    updateStatus();
  }, [client, signer, reset]);

  // it's important that this effect runs last
  useEffect(() => {
    signerRef.current = signer;
  }, [signer]);

  console.log("qg stat", status);

  return {
    client,
    isLoading: isLoading || signing,
    preInit,
    resolveCreate,
    resolveEnable,
    disconnect,
    status,
    reset,
    setStatus,
  };
};

export default useInitXmtpClient;
