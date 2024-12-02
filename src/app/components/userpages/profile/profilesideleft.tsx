import { Card, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import icon1 from "../../../../assets/images/icons/01.png";
import icon5 from "../../../../assets/images/icons/05.png";

const UserSideLeft = () => {
  return (
    <Col lg="3" className="col-lg-3">
      <Card>
        <Card.Header className="d-flex align-items-center justify-content-between">
          <div className="header-title">
            <h4 className="card-title">Gallery</h4>
          </div>
          <span>132 pics</span>
        </Card.Header>
        <Card.Body>
          <div className="d-grid gap-card grid-cols-3">
            <Link to="#">
              <Image
                src={icon1}
                className="img-fluid bg-soft-info rounded"
                alt="profile-image"
              />
            </Link>
            <Link to="#">
              <Image
                src={icon1}
                className="img-fluid bg-soft-primary rounded"
                alt="profile-image"
              />
            </Link>
            <Link to="#">
              <Image
                src={icon1}
                className="img-fluid bg-soft-info rounded"
                alt="profile-image"
              />
            </Link>
            <Link to="#">
              <Image
                src={icon1}
                className="img-fluid bg-soft-primary rounded"
                alt="profile-image"
              />
            </Link>
            <Link to="#">
              <Image
                src={icon1}
                className="img-fluid bg-soft-warning rounded"
                alt="profile-image"
              />
            </Link>
            <Link to="#">
              <Image
                src={icon1}
                className="img-fluid bg-soft-primary rounded"
                alt="profile-image"
              />
            </Link>
            <Link to="#">
              <Image
                src={icon5}
                className="img-fluid bg-soft-danger rounded"
                alt="profile-image"
              />
            </Link>
            <Link to="#">
              <Image
                src={icon1}
                className="img-fluid bg-soft-primary rounded"
                alt="profile-image"
              />
            </Link>
            <Link to="#">
              <Image
                src={icon1}
                className="img-fluid bg-soft-success rounded"
                alt="profile-image"
              />
            </Link>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <div className="header-title">
            <h4 className="card-title">Twitter Feeds</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="twit-feed">
            <div className="d-flex align-items-center mb-2">
              <Image
                className="rounded-pill img-fluid avatar-50 me-3 p-1 bg-soft-danger ps-2"
                src={icon1}
                alt=""
              />
              <div className="media-support-info">
                <h6 className="mb-0">Figma Community</h6>
                <p className="mb-0">
                  @figma20
                  <span className="text-primary">
                    <svg width="15" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                      />
                    </svg>
                  </span>
                </p>
              </div>
            </div>
            <div className="media-support-body">
              <p className="mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </p>
              <div className="d-flex flex-wrap">
                <Link to="#" className="twit-meta-tag pe-2">
                  #Html
                </Link>
                <Link to="#" className="twit-meta-tag pe-2">
                  #Bootstrap
                </Link>
              </div>
              <div className="twit-date">07 Jan 2021</div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="twit-feed">
            <div className="d-flex align-items-center mb-2">
              <Image
                className="rounded-pill img-fluid avatar-50 me-3 p-1 bg-soft-primary"
                src={icon1}
                alt=""
              />
              <div className="media-support-info">
                <h6 className="mb-0">Flutter</h6>
                <p className="mb-0">
                  @jane59
                  <span className="text-primary">
                    <svg width="15" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                      />
                    </svg>
                  </span>
                </p>
              </div>
            </div>
            <div className="media-support-body">
              <p className="mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </p>
              <div className="d-flex flex-wrap">
                <Link to="#" className="twit-meta-tag pe-2">
                  #Js
                </Link>
                <Link to="#" className="twit-meta-tag pe-2">
                  #Bootstrap
                </Link>
              </div>
              <div className="twit-date">18 Feb 2021</div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="twit-feed">
            <div className="d-flex align-items-center mb-2">
              <Image
                className="rounded-pill img-fluid avatar-50 me-3 p-1 bg-soft-warning pt-2"
                src={icon1}
                alt=""
              />
              <div className="mt-2">
                <h6 className="mb-0">Blender</h6>
                <p className="mb-0">
                  @blender59
                  <span className="text-primary">
                    <svg width="15" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                      />
                    </svg>
                  </span>
                </p>
              </div>
            </div>
            <div className="media-support-body">
              <p className="mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </p>
              <div className="d-flex flex-wrap">
                <Link to="#" className="twit-meta-tag pe-2">
                  #Html
                </Link>
                <Link to="#" className="twit-meta-tag pe-2">
                  #CSS
                </Link>
              </div>
              <div className="twit-date">15 Mar 2021</div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default UserSideLeft;
