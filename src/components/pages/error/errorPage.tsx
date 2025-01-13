import {
  Button,
  Container,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import Image400 from "@/assets/images/error/400.jpg";
import Image404 from "@/assets/images/error/404_image.jpg";
import Image500 from "@/assets/images/error/500_image.jpg";
import classes from "./styles.module.css";
import { useNavigate } from "react-router";

type props = {
  title?: string;
  message?: string;
  type?: "400" | "404" | "500";
  ctx?: {
    title?: string;
    link?: string;
  };
};
export function ErrorPage({ title, message, ctx, type = "500" }: props) {
  const navigate = useNavigate();

  const HandleCtx = () => {
    if (ctx?.link) {
      navigate(ctx.link);
    } else {
      navigate(-1);
    }
  };
  return (
    <Container className={classes.root}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image
          src={type === "400" ? Image400 : type === "404" ? Image404 : Image500}
          className={classes.mobileImage}
          alt={`image-` + type}
        />
        <div>
          <Title className={classes.title}>
            {title ? title : `Something is not right...`}
          </Title>
          <Text c="dimmed" size="lg">
            {message
              ? message
              : `Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.`}
          </Text>
          <Button
            variant="outline"
            size="md"
            mt="xl"
            className={classes.control}
            onClick={HandleCtx}
          >
            {ctx?.title ? ctx.title : "Go back"}
          </Button>
        </div>
        <Image
          src={type === "400" ? Image400 : type === "404" ? Image404 : Image500}
          className={classes.desktopImage}
          alt={`image-` + type}
        />
      </SimpleGrid>
    </Container>
  );
}
