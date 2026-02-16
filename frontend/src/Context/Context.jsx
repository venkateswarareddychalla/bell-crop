import { useContext } from "react";
import { createContext } from "react";

export const appContext = createContext();

export const AppContextProvider = ({children}) => {
    const value = {}
    return (
        <appContext.Provider value={value}>
            {children}
        </appContext.Provider>
    )
}

export const useAppContext = () => useContext(appContext);