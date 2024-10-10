import { IPaginateContext } from "@/types/app/app.types";
import { IPaginate } from "@/types/server/server.main.types";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const initialstate: IPaginateContext = {
  paginate: {
    page: 1,
    limit: 5,
    globalFilter: null,
    sortBy: [],
    filters: [],
  },
  setPaginate: () => {},
};

const PaginateContext = createContext<IPaginateContext<any>>(initialstate);

const PaginateProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [paginate, setPaginate] = useState<IPaginate>(initialstate.paginate);
  useEffect(() => {
    setPaginate(initialstate.paginate);
  }, [location.pathname]);
  return (
    <PaginateContext.Provider value={{ paginate, setPaginate }}>
      {children}
    </PaginateContext.Provider>
  );
};

export const usePaginateContext = <T extends Record<string, any>>() => {
  const context = useContext<IPaginateContext<T>>(PaginateContext);
  if (context === undefined) {
    throw new Error(
      "usePaginateContext must be used within a PaginateProvider"
    );
  }
  return context;
};

export default PaginateProvider;
