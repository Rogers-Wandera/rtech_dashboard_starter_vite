import { InputWithButton } from "@/components/shared/inputwithbutton";
import { useFetchPaginate } from "@/hooks/data/usefetch.hook";
import { UserGroup, UserSingleView } from "@/types/app/core/user.type";
import {
  Table,
  Card,
  Title,
  ScrollArea,
  Pagination,
  Flex,
  Text,
  Alert,
} from "@mantine/core";
import RolePage from "./rolepage";
import { ServerRoles } from "@/types/app/auth/auth.types";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { IconInfoCircle } from "@tabler/icons-react";

type user_roles = {
  type: "user";
  data: UserSingleView;
};

type group_roles = {
  type: "group";
  data: UserGroup;
};

type props = user_roles | group_roles;

const ManageRoles = ({ type, data }: props) => {
  const [activePage, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const dispatch = useAppDispatch();
  const queryKey = type === "user" ? "user_roles" : "group_roles";
  const endpoint = type === "user" ? "user" : "group";
  const {
    data: rolesData,
    isLoading,
    isFetching,
    isError,
    setPaginate,
    paginate,
    refetch,
  } = useFetchPaginate<ServerRoles>({
    queryKey: `${queryKey}-${type === "user" ? data.id : data.id}`,
    endPoint: `core/auth/linkroles/${endpoint}/serverroles/${
      type === "user" ? data.id : String(data.id)
    }`,
  });

  const HandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const HasExpiredRoles = useCallback(() => {
    if (rolesData && rolesData?.docs?.length > 0) {
      const res =
        rolesData.docs.filter(
          (role) => role.links.filter((lk) => lk.expired === 1).length
        ).length >= 1
          ? "Yes"
          : "No";
      return res;
    }
    return "No";
  }, [rolesData]);

  const AssignedRoles = useCallback(() => {
    if (rolesData && rolesData?.docs?.length > 0) {
      const res = rolesData.docs.filter(
        (role) => role.links.filter((lk) => lk.is_assigned === 1).length
      ).length;
      return res;
    }
    return 0;
  }, [rolesData]);

  useEffect(() => {
    if (isLoading || isFetching) {
      dispatch(setLoading(true));
    }
    if (!isLoading || !isFetching || isError) {
      dispatch(setLoading(false));
    }
  }, [isLoading, isFetching, isError]);

  useEffect(() => {
    if (search) {
      setPaginate({ ...paginate, globalFilter: search });
    }
  }, [search]);

  useEffect(() => {
    setPaginate({ ...paginate, page: activePage });
  }, [activePage]);

  return (
    <ScrollArea h={400}>
      {rolesData && rolesData?.docs?.length > 0 && (
        <Card>
          <InputWithButton
            value={search}
            placeholder="Search Module"
            onChange={HandleSearch}
          />
          <Flex justify="space-between" mt={10}>
            <Text>
              <span>Has Expired Roles: {HasExpiredRoles()}</span> <br />
              <span>Assigned Roles: {AssignedRoles()}</span>
            </Text>
            <Pagination
              withEdges
              total={rolesData.totalPages}
              disabled={rolesData.totalPages <= 1}
              onChange={setPage}
            />
          </Flex>
          <Table.ScrollContainer minWidth={300}>
            <Table verticalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>
                    <Title order={3}>Modules</Title>
                  </Table.Th>
                  <Table.Th>
                    <Title order={3}>Assign Roles</Title>
                  </Table.Th>
                  <Table.Th>
                    <Title order={3}>View</Title>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {type === "user" &&
                  rolesData.docs.map((role) => (
                    <RolePage
                      type="user"
                      key={role.module}
                      role={role}
                      data={data}
                      refetch={refetch}
                    />
                  ))}
                {type === "group" &&
                  rolesData.docs.map((role) => (
                    <RolePage
                      type="group"
                      key={role.module}
                      role={role}
                      data={data}
                      refetch={refetch}
                    />
                  ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      )}
      {(!rolesData || !rolesData?.docs || rolesData?.docs?.length === 0) && (
        <Card>
          <Alert
            variant="light"
            color="blue"
            title="Roles not set"
            icon={<IconInfoCircle />}
          >
            {`No ${
              type === "user"
                ? "user roles"
                : "group roles found, contact admin or systems administrator"
            } found`}
          </Alert>
        </Card>
      )}
    </ScrollArea>
  );
};

export default ManageRoles;
