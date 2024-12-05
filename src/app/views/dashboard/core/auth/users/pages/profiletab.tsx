import Card from "@/components/shared/Card";
import { Image, Tab } from "react-bootstrap";
import { Link } from "react-router";
import avatars11 from "@/assets/images/avatars/01.png";
import { UserSingleView } from "@/types/app/core/user.type";

type props = {
  user: UserSingleView;
};

const ProfileTab = ({}: props) => {
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
              <Image
                className="theme-color-default-img  rounded-pill avatar-130 img-fluid"
                src={avatars11}
                alt="profile-pic"
              />
            </div>
            <div className="mt-3">
              <h3 className="d-inline-block">Austin Robertson</h3>
              <p className="d-inline-block pl-3"> - Web developer</p>
              <p className="mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <div className="header-title">
            <h4 className="card-title">About User</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="user-bio">
            <p>
              Tart I love sugar plum I love oat cake. Sweet roll caramels I love
              jujubes. Topping cake wafer.
            </p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Joined:</h6>
            <p>Feb 15, 2021</p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Lives:</h6>
            <p>United States of America</p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Email:</h6>
            <p>
              <Link to="#" className="text-body">
                {" "}
                austin@gmail.com
              </Link>
            </p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Url:</h6>
            <p>
              <Link to="#" className="text-body" target="_blank">
                {" "}
                www.bootstrap.com{" "}
              </Link>
            </p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Contact:</h6>
            <p>
              <Link to="#" className="text-body">
                (001) 4544 565 456
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Tab.Pane>
  );
};

export default ProfileTab;
