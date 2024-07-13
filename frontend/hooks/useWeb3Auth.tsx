import web3auth from "@/lib/web3auth/provider";
import { IProvider } from "@web3auth/base";
import { useEffect, useState } from "react";

export default function useWeb3AuthCustomProvider(){
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();
                setProvider(web3auth.provider);
                if (web3auth.connected) {
                    setLoggedIn(true);
                }
            } catch (error) {
                console.error(error);
            }
        };
        init();
    }, []);

    return { provider, setProvider, loggedIn, setLoggedIn };
} 