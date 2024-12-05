import Card from "@/components/shared/Card";
import { UserSingleView } from "@/types/app/core/user.type";
import { Col } from "react-bootstrap";
import { Link } from "react-router";

type props = {
  user: UserSingleView;
};
const ProfileLeft = ({}: props) => {
  return (
    <Col lg="3" className="col-lg-3">
      <Card>
        <Card.Header>
          <div className="header-title">
            <h4 className="card-title">News</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <ul className="list-inline m-0 p-0">
            <li className="d-flex mb-2">
              <div className="news-icon me-3">
                <svg width="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z"
                  />
                </svg>
              </div>
              <p className="news-detail mb-0">
                there is a meetup in your city on fryday at 19:00.{" "}
                <Link to="#">see details</Link>
              </p>
            </li>
            <li className="d-flex">
              <div className="news-icon me-3">
                <svg width="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z"
                  />
                </svg>
              </div>
              <p className="news-detail mb-0">
                20% off coupon on selected items at pharmaprix{" "}
              </p>
            </li>
          </ul>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProfileLeft;
