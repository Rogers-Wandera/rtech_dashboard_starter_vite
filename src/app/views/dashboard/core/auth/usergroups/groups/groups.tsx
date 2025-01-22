import { useAppDispatch } from "@/hooks/store.hooks";
import { useFetchPaginate } from "@/hooks/data/usefetch.hook";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { UserGroup } from "@/types/app/core/user.type";
import { Alert, Box, Flex, Grid, Pagination } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import GroupCard from "./groupcard";
import GroupModal from "../modals/groupmodal";

type props = {
  search: string;
  opened: boolean;
  open: () => void;
  close: () => void;
};
const UserGroupsPage = ({ search, opened, close, open }: props) => {
  const dispatch = useAppDispatch();
  const [activePage, setPage] = useState(1);
  const [group, setGroup] = useState<UserGroup | null>(null);
  const {
    data,
    isLoading,
    isFetching,
    isError,
    setPaginate,
    paginate,
    refetch,
  } = useFetchPaginate<UserGroup>({
    queryKey: "user-groups",
    endPoint: "core/auth/usergroups",
    limit: 6,
  });

  useEffect(() => {
    if (!isFetching || !isLoading || isError) {
      dispatch(setLoading(false));
    }

    if (isFetching || isLoading) {
      dispatch(setLoading(true));
    }
  }, [isLoading, isFetching, isError]);

  useEffect(() => {
    setPaginate({ ...paginate, globalFilter: search });
  }, [search]);

  useEffect(() => {
    setPaginate({ ...paginate, page: activePage });
  }, [activePage]);

  return (
    <Box mb={10}>
      {!data && (
        <Alert
          variant="light"
          color="red"
          title="No Groups"
          icon={<IconInfoCircle />}
        >
          No user groups found at the moment. click the <b>Add Group</b> button
          to add groups
        </Alert>
      )}
      {data && (
        <Box>
          <GroupModal
            opened={opened}
            close={close}
            refetch={refetch}
            group={group}
            setGroup={setGroup}
          />
          <Flex justify="flex-end" mb={20}>
            <Pagination
              total={data.totalPages}
              withEdges
              disabled={data.totalPages <= 1}
              onChange={setPage}
            />
          </Flex>
          <Grid>
            {data.docs.map((group) => (
              <Grid.Col
                key={group.id}
                span={{
                  base: 12,
                  sm: 6,
                  lg: data.docs.length >= 3 ? 4 : 6,
                  md: 6,
                }}
              >
                <GroupCard
                  key={group.id}
                  group={group}
                  setGroup={setGroup}
                  open={open}
                  refetch={refetch}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default UserGroupsPage;
