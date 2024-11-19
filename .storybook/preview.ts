import type { Preview } from "@storybook/react";
import { withRouter } from "storybook-addon-remix-react-router";

// const SB_USERNAME = import.meta.env.VITE_STORY_BOOK_USER;
// const SB_PASSWORD = import.meta.env.VITE_STORY_BOOK_PASSWORD;

// const inputUsername = window.prompt("Enter username:");
// const inputPassword = window.prompt("Enter password:");

// if (inputUsername !== SB_USERNAME || inputPassword !== SB_PASSWORD) {
//   document.body.innerHTML = "<b>Unauthorized 401. Invalid credentials.</b>";

//   throw new Error("Unauthorized 401. Invalid credentials.");
// }

const preview: Preview = {
  decorators: [withRouter],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
