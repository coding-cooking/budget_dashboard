'use client'

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type UserContextInterface = {
    user: {
        value: string,
        label: string,
    }
    setUser: Dispatch<SetStateAction<{
        value: string,
        label: string,
}>>
}

export const userContext = createContext<UserContextInterface>({
    user: {
        value: '91235',
        label: '91235',
    },
    setUser: () => {}
});

type UserProviderProps = {
    children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<UserContextInterface>({
        value: '91235',
        label: '91235',
    });
    const value = { user, setUser };
    return (
        <userContext.Provider value={ value}>
            {children}
        </userContext.Provider>
    );
}

export const useUserContext = () => useContext(userContext);


