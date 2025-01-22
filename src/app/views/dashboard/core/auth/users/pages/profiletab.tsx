import Card from "@/components/shared/Card";
import { Tab } from "react-bootstrap";
import { Link } from "react-router";
import gent from "@/assets/images/avatars/01.png";
import lady from "@/assets/images/avatars/lady.png";
import { UserSingleView } from "@/types/app/core/user.type";
import dayjs from "dayjs";
import { Avatar, Badge, styled } from "@mui/material";
import { IconUpload } from "@tabler/icons-react";
import { useAuth } from "@/hooks/auth/auth.hooks";

type props = {
  user: UserSingleView;
  open: () => void;
};

const SmallAvatar = styled(IconUpload)(({ theme }) => ({
  width: 25,
  height: 25,
  cursor: "pointer",
  color: theme.palette.mode === "dark" ? "grey" : "blue",
}));

const ProfileTab = ({ user, open }: props) => {
  const createdDay = dayjs(user.creationDate, "YYYY-MM-DD");
  const { user: AuthUser } = useAuth();
  return (
    <Tab.Pane eventKey="first" id="profile-profile">
      <Card>
        <Card.Header>
          <div className="header-title">
            <h4 className="card-title">Profile</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="text-center">
            <div className="user-profile">
              {/* <Image
                className="theme-color-default-img  rounded-pill avatar-130 img-fluid"
                src={avatars11}
                alt="profile-pic"
              /> */}
              <Badge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                badgeContent={
                  AuthUser?.id === user.id && (
                    <SmallAvatar
                      onClick={open}
                      className="upload-button"
                      size={30}
                    />
                  )
                }
              >
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  alt={user.userName}
                  src={
                    user.image
                      ? user.image
                      : user.gender.toLowerCase() === "female"
                      ? lady
                      : gent
                  }
                />
              </Badge>
            </div>
            <div className="mt-3">
              <h3 className="d-inline-block">{user.userName}</h3>
              <p className="d-inline-block pl-3"> - {user.position}</p>
              <p className="mb-0">
                {user.userName} {user.gender} created on{" "}
                {createdDay.format("YYYY-MM-DD")} .
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <div className="header-title">
            <h4 className="card-title">About {user.userName}</h4>
          </div>
        </Card.Header>
        <Card.Body>
          {/* <div className="user-bio">
            <p>
              Tart I love sugar plum I love oat cake. Sweet roll caramels I love
              jujubes. Topping cake wafer.
            </p>
          </div> */}
          <div className="mt-2">
            <h6 className="mb-1">Joined:</h6>
            <p>{createdDay.format("YYYY-MM-DD")}</p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Email:</h6>
            <p>
              <Link to="#" className="text-body">
                {" "}
                {user.email}
              </Link>
            </p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Contact:</h6>
            <p>
              <Link to="#" className="text-body">
                {user.tel}
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Tab.Pane>
  );
};

export default ProfileTab;
