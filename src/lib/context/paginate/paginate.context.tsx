import { IPaginateContext } from "@/types/app/app.types";
import { IPaginate } from "@/types/server/server.main.types";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

const initialstate: IPaginateContext<unknown> = {
  paginate: {
    page: 1,
    limit: 5,
    globalFilter: null,
    sortBy: [],
    filters: [],
  },
  setPaginate: () => {},
};

const PaginateContext = createContext<IPaginateContext<unknown> | undefined>(
  undefined
);

const PaginateProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [paginate, setPaginate] = useState<IPaginate<unknown>>(
    initialstate.paginate
  );

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
  const context = useContext(PaginateContext) as IPaginateContext<T>;
  if (context === undefined) {
    throw new Error(
      "usePaginateContext must be used within a PaginateProvider"
    );
  }
  return context;
};

export default PaginateProvider;
