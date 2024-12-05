import { UserSingleView } from "@/types/app/core/user.type";
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router";

type props = {
  user: UserSingleView;
};

const ProfileRight = ({ user }: props) => {
  return (
    <Col lg="3">
      <Card>
        <Card.Header>
          <div className="header-title">
            <h4 className="card-title">About</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <p>Email: {user.email}</p>
          <div className="mb-1">
            Position:{" "}
            <Link to="#" className="ms-3">
              {user.position}
            </Link>
          </div>
          <div className="mb-1">
            Phone:{" "}
            <Link to="#" className="ms-3">
              {user.tel}
            </Link>
          </div>
          <div>
            Location: <span className="ms-3">USA</span>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProfileRight;
