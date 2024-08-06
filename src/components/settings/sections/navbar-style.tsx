import { memo, Fragment } from "react";
import RadioBtn from "../elements/radio-btn";

// Images
import image1 from "@/assets/images/defaults/settings/dark/01.png";
import image2 from "@/assets/images/defaults/settings/light/01.png";
import image19 from "@/assets/images/defaults/settings/dark/10.png";
import image20 from "@/assets/images/defaults/settings/light/10.png";
import image23 from "@/assets/images/defaults/settings/dark/12.png";
import image24 from "@/assets/images/defaults/settings/light/12.png";
import { Image } from "react-bootstrap";

const NavbarStyle = memo((props: any) => {
  return (
    <Fragment>
      <h5 className="mt-4 mb-3">Navbar Style</h5>
      <div className="d-grid gap-3 grid-cols-2 mb-4">
        <RadioBtn
          btnName="header_navbar"
          imgComponent={true}
          label="Glass"
          className="text-center"
          labelclassName="p-0 overflow-hidden mb-2"
          id="nav-glass"
          defaultChecked={props.headerNavbar}
          value="nav-glass"
        >
          <Image
            src={image19}
            alt="image1"
            className={` mode dark-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
          <Image
            src={image20}
            alt="image2"
            className={` mode light-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
        </RadioBtn>
        <RadioBtn
          btnName="header_navbar"
          imgComponent={true}
          label="Color"
          className="text-center"
          labelclassName="p-0 overflow-hidden mb-2"
          id="navs-color"
          defaultChecked={props.headerNavbar}
          value="navs-color"
        >
          <Image
            src={image1}
            alt="image1"
            className={` mode dark-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
          <Image
            src={image2}
            alt="image2"
            className={` mode light-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
        </RadioBtn>
        <RadioBtn
          btnName="header_navbar"
          imgComponent={true}
          label="Sticky"
          className="text-center"
          labelclassName="p-0 overflow-hidden mb-2"
          id="navs-sticky"
          defaultChecked={props.headerNavbar}
          value="navs-sticky"
        >
          <Image
            src={image23}
            alt="image1"
            className={` mode dark-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
          <Image
            src={image24}
            alt="image2"
            className={` mode light-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
        </RadioBtn>
        <RadioBtn
          btnName="header_navbar"
          imgComponent={true}
          label="Transparent"
          className="text-center"
          labelclassName="p-0 overflow-hidden mb-2"
          id="navs-transparent"
          defaultChecked={props.headerNavbar}
          value="navs-transparent"
        >
          <Image
            src={image23}
            alt="image1"
            className={` mode dark-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
          <Image
            src={image24}
            alt="image2"
            className={` mode light-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
        </RadioBtn>
      </div>
    </Fragment>
  );
});

NavbarStyle.displayName = "NavbarStyle";
export default NavbarStyle;
