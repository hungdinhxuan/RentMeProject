import React, { Fragment } from "react";
import MessengerCustomerChat from "react-messenger-customer-chat"

export function PublicLayout({ children, ...rest }) {
  return <Fragment>
    {children}
    <MessengerCustomerChat
          pageId={process.env.REACT_APP_FACEBOOK_PAGE_ID}
          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
          htmlRef={process.env.REACT_APP_FACEBOOK_HTML_REF}
      />
    </Fragment>;
}
