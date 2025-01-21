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
import Image401 from "@/assets/images/error/401.jpg";
import classes from "./styles.module.css";
import { NavigateFunction, useNavigate } from "react-router";

type props = {
  title?: string;
  message?: string;
  type?: "400" | "401" | "404" | "500";
  ctx?: {
    title?: string;
    link?: string | ((navigate: NavigateFunction) => void);
  };
};
export function ErrorPage({ title, message, ctx, type = "500" }: props) {
  const navigate = useNavigate();

  const HandleCtx = () => {
    if (ctx?.link) {
      if (typeof ctx.link === "function") {
        ctx.link(navigate);
      } else {
        navigate(ctx.link);
      }
    } else {
      navigate(-1);
    }
  };
  let imageToShow = Image500;

  switch (type) {
    case "400":
      imageToShow = Image400;
      break;
    case "404":
      imageToShow = Image404;
      break;
    case "401":
      imageToShow = Image401;
      break;
    default:
      imageToShow = Image500;
      break;
  }

  return (
    <Container className={classes.root}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image
          src={imageToShow}
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
          src={imageToShow}
          className={classes.desktopImage}
          alt={`image-` + type}
        />
      </SimpleGrid>
    </Container>
  );
}
