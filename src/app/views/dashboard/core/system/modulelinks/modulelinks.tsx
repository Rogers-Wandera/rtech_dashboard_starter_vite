import RouteRoles from "@/hocs/verifyroles";
import LinkCard from "./linkcard";
import { Card, Col } from "react-bootstrap";
import {
  IconArrowLeft,
  IconClipboardPlus,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router";
import {
  Alert,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Pagination,
  Text,
  Title,
} from "@mantine/core";
import { SearchInput } from "@/components/shared/inputs/search";
import { useFetchPaginate } from "@/hooks/usefetch.hook";
import { useEffect, useState } from "react";
import { helpers } from "@/lib/utils/helpers/helper";
import { ModuleLinkType, ModuleType } from "@/types/app/core/system.types";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { useAppContext } from "@/lib/context/app/app.context";
import { useDisclosure } from "@mantine/hooks";
import LinkModal from "./linkmodal";

const ModuleLinks = () => {
  const [manual, setManual] = useState(false);
  const [activePage, setPage] = useState(1);
  const [editData, setEditData] = useState<ModuleLinkType | null>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [opened, { open, close }] = useDisclosure(false);
  const { state } = useAppContext();
  const moduleId = helpers.decryptUrl(String(params.id));
  const module = state.page.pageState as ModuleType;
  const dispatch = useAppDispatch();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    setPaginate,
    paginate,
    refetch,
  } = useFetchPaginate<ModuleLinkType>({
    endPoint: `core/system/modulelinks/${moduleId}`,
    queryKey: "modulelinks" + moduleId,
    manual: manual,
    limit: 4,
  });

  const HandleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (!isFetching || !isLoading || isError) {
      setManual(false);
      dispatch(setLoading(false));
    }

    if (isFetching || isLoading) {
      dispatch(setLoading(true));
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
    <div>
      {data && Object.keys(state.page.pageState).length > 0 && (
        <Box mb={20}>
          <LinkModal
            opened={opened}
            close={close}
            refetch={refetch}
            moduleId={moduleId}
            setEditData={setEditData}
            editData={editData}
          />
          <Col lg="12">
            <Card>
              <Card.Body>
                <Flex
                  direction={{ base: "row", sm: "row" }}
                  gap={{ base: "sm", sm: "lg" }}
                  justify={{ sm: "center", md: "space-between" }}
                >
                  <Group>
                    <Text>
                      <IconArrowLeft
                        color="blue"
                        size={30}
                        onClick={() => navigate(-1)}
                        style={{ cursor: "pointer" }}
                      />
                    </Text>
                    <Title className="me-2" order={2}>
                      {module.name}
                    </Title>

                    <SearchInput value={search} onChange={HandleSearchChange} />
                  </Group>
                  <Text>
                    <Button leftSection={<IconClipboardPlus />} onClick={open}>
                      Add
                    </Button>
                  </Text>
                </Flex>
              </Card.Body>
            </Card>
            <Flex justify="flex-end" mb={20}>
              <Pagination
                disabled={data.totalPages <= 1}
                total={data.totalPages}
                withEdges
                onChange={setPage}
              />
            </Flex>
          </Col>
          <Grid>
            {data.docs.map((link) => (
              <Grid.Col span={{ base: 12, sm: 6, lg: 6, md: 6 }} key={link.id}>
                <LinkCard
                  refetch={refetch}
                  link={link}
                  setEditData={setEditData}
                  open={open}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      )}
      {!data ||
        (Object.keys(state.page.pageState).length <= 0 && (
          <Container mt={40}>
            <Alert
              variant="light"
              color="blue"
              title="Oops, looks like you hit a broken link"
              icon={<IconInfoCircle />}
            >
              This may happen when there is a network problem or some
              configurations have failed to run.
              <Text>
                Please click the button to go back.
                <Button onClick={() => navigate(-1)}>Click</Button>
              </Text>
            </Alert>
          </Container>
        ))}
    </div>
  );
};

export default RouteRoles(ModuleLinks);
