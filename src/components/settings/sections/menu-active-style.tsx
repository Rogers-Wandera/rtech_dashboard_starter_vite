import { memo, Fragment } from "react";
import RadioBtn from "../elements/radio-btn";

// Images

import image11 from "@/assets/images/defaults/settings/dark/06.png";
import image12 from "@/assets/images/defaults/settings/light/06.png";
import image13 from "@/assets/images/defaults/settings/dark/07.png";
import image14 from "@/assets/images/defaults/settings/light/07.png";
import image15 from "@/assets/images/defaults/settings/dark/08.png";
import image16 from "@/assets/images/defaults/settings/light/08.png";
import image17 from "@/assets/images/defaults/settings/dark/09.png";
import image18 from "@/assets/images/defaults/settings/light/09.png";
import { Image } from "react-bootstrap";

const MenuActiveStyle = memo((props: any) => {
  return (
    <Fragment>
      <h5 className="mt-4 mb-3">Sidebar Active Style</h5>
      <div className="d-grid gap-3 grid-cols-2 mb-4">
        <RadioBtn
          btnName="sidebar_menu_style"
          imgComponent={true}
          label="Rounded One Side"
          className="text-center"
          labelclassName="p-0 mb-2"
          id="navs-rounded"
          defaultChecked={props.sidebarMenuStyle}
          value="sidebar-default navs-rounded"
        >
          <Image
            src={image11}
            alt="rounded-one-side"
            className={` mode dark-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
          <Image
            src={image12}
            alt="rounded-one-side"
            className={` mode light-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
        </RadioBtn>
        <RadioBtn
          btnName="sidebar_menu_style"
          imgComponent={true}
          label="Rounded All"
          className="text-center"
          labelclassName="p-0 mb-2"
          id="navs-rounded-all"
          defaultChecked={props.sidebarMenuStyle}
          value="sidebar-default navs-rounded-all"
        >
          <Image
            src={image13}
            alt="pill-one-side"
            className={` mode dark-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
          <Image
            src={image14}
            alt="pill-one-side"
            className={`mode light-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
        </RadioBtn>
        <RadioBtn
          btnName="sidebar_menu_style"
          imgComponent={true}
          label="Pill One Side"
          className="text-center"
          labelclassName="p-0 mb-2"
          id="navs-pill"
          defaultChecked={props.sidebarMenuStyle}
          value="sidebar-default navs-pill"
        >
          <Image
            src={image15}
            alt="pill-one-side"
            className={` mode dark-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
          <Image
            src={image16}
            alt="pill-one-side"
            className={`mode light-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
        </RadioBtn>
        <RadioBtn
          btnName="sidebar_menu_style"
          imgComponent={true}
          label="Pill All"
          className="text-center"
          labelclassName="p-0 mb-2"
          id="navs-pill-all"
          defaultChecked={props.sidebarMenuStyle}
          value="sidebar-default navs-pill-all"
        >
          <Image
            src={image17}
            alt="pill-one-side"
            className={` mode dark-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
          <Image
            src={image18}
            alt="pill-one-side"
            className={`mode light-img img-fluid`}
            height="200"
            width="200"
            loading="lazy"
          />
        </RadioBtn>
      </div>
    </Fragment>
  );
});

MenuActiveStyle.displayName = "MenuActiveStyle";
export default MenuActiveStyle;
