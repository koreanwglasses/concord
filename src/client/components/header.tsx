import {
  AppBar,
  Avatar,
  Box,
  Button,
  makeStyles,
  Toolbar,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { routes } from "../../endpoints";
import { resolveEndpoint } from "../../utils";
import { useAPI } from "../hooks/use-api";
import { UnstyledLink } from "./ui/unstyled-link";

const useStyles = makeStyles((theme) => ({
  toolbarTitle: {
    flexGrow: 1,
    fontSize: 36,
  },
  button: {
    margin: theme.spacing(1, 1),
  },
  avatar: {
    margin: theme.spacing(1, 1),
  },
}));

export const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <Title />
      <UserNav />
    </Toolbar>
  </AppBar>
);

const Title = () => {
  const classes = useStyles();
  return (
    <div className={classes.toolbarTitle}>
      <UnstyledLink to={"/"}>
        <Box fontWeight={700} component="span">
          CON
        </Box>
        <Box fontWeight={200} component="span">
          CORD
        </Box>
      </UnstyledLink>
    </div>
  );
};

const UserNav = () => {
  const classes = useStyles();
  const [err, user] = useAPI(routes.apiCurrentUser);
  return (
    <>
      {!err && !user && (
        <>
          <Skeleton
            variant="rect"
            width={140}
            height={35}
            className={classes.button}
          />
          <Skeleton
            variant="rect"
            width={120}
            height={35}
            className={classes.button}
          />
          <Skeleton
            variant="circle"
            width={40}
            height={40}
            className={classes.avatar}
          />
        </>
      )}

      {(err || user) && (
        <Button
          variant="outlined"
          className={classes.button}
          href={resolveEndpoint(routes.invite)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Add to Server
        </Button>
      )}

      {err && <LoginButton />}

      {user && (
        <>
          <Button
            color="secondary"
            variant="contained"
            component={RouterLink}
            to={"/dashboard"}
            className={classes.button}
          >
            Dashboard
          </Button>
          <Avatar
            alt={`${user.username}#${user.discriminator}`}
            src={user.avatarURL}
            className={classes.avatar}
          ></Avatar>
        </>
      )}
    </>
  );
};

export const LoginButton = () => {
  const classes = useStyles();
  return (
    <Button
      color="secondary"
      variant="contained"
      href={resolveEndpoint(routes.auth)}
      className={classes.button}
    >
      Login with Discord
    </Button>
  );
};