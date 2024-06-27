import { createContext, useContext, useState } from "react";
import { User } from "../../__generated__/graphql";

interface pushUpContext {
    pushUpId: number | null
    pushUp: (data: any) => void
  }
const PushUpContext = createContext< pushUpContext| null>(null);

export const PushUp = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const pushUp = (data: any) => {
      setPushUpId(data)
    }
    const [pushUpId, setPushUpId] = useState<number | null>(null)
    return (
        <PushUpContext.Provider value={{ pushUpId: pushUpId, pushUp: pushUp }}>
            {children}
        </PushUpContext.Provider>
    )
}
export const usePushUp = () => useContext(PushUpContext);
