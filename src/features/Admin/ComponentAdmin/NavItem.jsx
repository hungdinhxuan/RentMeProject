import { Button, ListItem } from "@material-ui/core";
import PropTypes from "prop-types";
import { NavLink as RouterLink, useLocation } from "react-router-dom";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import BlockOutlinedIcon from "@material-ui/icons/BlockOutlined";
import { useState } from "react";

const NavItem = ({ href, icon: Icon, title, ...rest }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const active = href ? href === location.pathname : false;
  const banned = location.pathname === "/admin/players/banned" ? true : false;
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      {title === "Players Management" ? (
        <>
          <ListItem
            disableGutters
            sx={{
              display: "flex",
              py: 0,
            }}
            {...rest}
            button
            onClick={handleClick}
          >
            <Button
              component={RouterLink}
              sx={{
                color: "text.secondary",
                fontWeight: "medium",
                justifyContent: "flex-start",
                letterSpacing: 0,
                py: 1.25,
                textTransform: "none",
                width: "100%",
                ...(active && {
                  color: "primary.main",
                }),
                "& svg": {
                  mr: 1,
                },
              }}
              to={href}
            >
              {Icon && <Icon size="20" />}
              <span>{title}</span>
            </Button>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ListItem disableGutters {...rest} style={{ marginLeft: "12px" }}>
              <Button
                component={RouterLink}
                sx={{
                  color: "text.secondary",
                  fontWeight: "medium",
                  justifyContent: "flex-start",
                  letterSpacing: 0,
                  py: 1.25,
                  textTransform: "none",
                  width: "100%",
                  ...(banned && {
                    color: "primary.main",
                  }),
                  "& svg": {
                    mr: 1,
                  },
                }}
                to={`${href}/banned`}
              >
                <BlockOutlinedIcon size="20" />
                <span>Banned Players</span>
              </Button>
            </ListItem>
          </Collapse>
        </>
      ) : (
        <ListItem
          disableGutters
          sx={{
            display: "flex",
            py: 0,
          }}
          {...rest}
        >
          <Button
            component={RouterLink}
            sx={{
              color: "text.secondary",
              fontWeight: "medium",
              justifyContent: "flex-start",
              letterSpacing: 0,
              py: 1.25,
              textTransform: "none",
              width: "100%",
              ...(active && {
                color: "primary.main",
              }),
              "& svg": {
                mr: 1,
              },
            }}
            to={href}
          >
            {Icon && <Icon size="20" />}
            <span>{title}</span>
          </Button>
        </ListItem>
      )}
    </>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string,
};

export default NavItem;
