import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AddIcon from '@material-ui/icons/Add';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useStateValue } from '../contextAPI/StateProvider';
import axios from '../axios';
import { socket } from '../App';

const useStyles = makeStyles((theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
      position: 'sticky',
      top: 0,
      zIndex: 99,
    },
    appBar: {
      backgroundColor: '#ffffff',
      color: '#3f98bb',
      position: 'relative',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      // display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    links: {
      display: 'flex',
      alignItems: 'center',
    },
    link: {
      marginRight: theme.spacing(4),
      display: 'flex',
      alignItems: 'center',
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    alert: {
      padding: 10,
      margin: theme.spacing(3, 0),
      border: '1px solid',
      position: 'absolute',
      backgroundColor: '#0d8bdf',
      color: '#fff',
      width: 'fit-content',
      fontSize: 15,
      minWidth: 200,
      top: 30,
      right: 15,
    },
    notificationDiv: {
      // borderBottom: '1px solid gray',
      fontSize: 15,
      width: 200,
    },
    notificationsText: {},
  })
);

export function NavBar() {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [navbar, setNavbar] = React.useState(false);
  const [newMessagesArray, setNewMessagesArray] = useState([]);
  const [newNotificationsArray, setNewNotificationsArray] = useState([]);
  const [show, setShow] = useState(false);

  const handleClick = () => {
    if (show) {
      setShow(false);
      setNewNotificationsArray([]);
    } else {
      setShow(true);
    }
  };

  const handleLogout = async () => {
    await axios
      .get('/users/logout', { withCredentials: true })
      .then((response) => {
        window.location.replace('/login');
        dispatch({
          type: 'EMPTY_STATE',
        });
        localStorage.setItem('loggedIn', 'false');
      });
  };

  useEffect(() => {
    socket.on('newMessage', (message) => {
      setNewNotificationsArray((prevNotificationsArray) => [
        ...prevNotificationsArray,
        message,
      ]);
      if (location.pathname !== '/messages') {
        setNewMessagesArray((prevNewMessagesArray) => [
          ...prevNewMessagesArray,
          message,
        ]);
      }
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (location.pathname === '/messages') {
      setNewMessagesArray([]);
    }
    //eslint-disable-next-line
  }, []);

  const handleNavbarShadow = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  window.addEventListener('scroll', handleNavbarShadow);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => window.location.replace('/me')}>Me</MenuItem>
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => history.push('/')}>
        <IconButton aria-label="Find a ride" color="inherit">
          <SearchIcon />
        </IconButton>
        <p>Find a ride</p>
      </MenuItem>
      <MenuItem onClick={() => history.push('/add-trip')}>
        <IconButton aria-label="Publish a ride" color="inherit">
          <AddIcon />
        </IconButton>
        <p>Publish a ride</p>
      </MenuItem>
      <MenuItem onClick={() => window.location.replace('/messages')}>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          {newMessagesArray.length > 0 ? (
            <Badge badgeContent={newMessagesArray.length} color="secondary">
              <MailIcon />
            </Badge>
          ) : (
            <MailIcon />
          )}
        </IconButton>
        <p>Messages </p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar src={user.profilePic} />
        </IconButton>
        <p onClick={() => window.location.replace('/me')}>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <div className={classes.grow}>
        <AppBar
          position="static"
          className={classes.appBar}
          elevation={navbar ? 10 : 0}
        >
          <Toolbar style={{ padding: '0 40px' }}>
            <Typography className={classes.title} variant="h6" noWrap>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <img
                  src="https://res.cloudinary.com/dnh72jcdv/image/upload/v1627148739/logo_ctm8fc.png"
                  style={{ width: 40, height: 40, borderRadius: '50%' }}
                  alt="logo-img"
                />
              </Link>
            </Typography>

            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <div className={classes.links}>
                <div className={classes.link}>
                  <Link
                    to="/add-trip"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <AddCircleOutlineIcon />
                    {'    '}
                    <p>Publish a ride</p>
                  </Link>
                </div>
              </div>
              <IconButton
                color="inherit"
                onClick={() => window.location.replace('/messages')}
              >
                {newMessagesArray.length > 0 ? (
                  <Badge
                    badgeContent={newMessagesArray.length}
                    color="secondary"
                  >
                    <MailIcon />
                  </Badge>
                ) : (
                  <MailIcon />
                )}
              </IconButton>

              <IconButton
                onClick={handleClick}
                aria-label="show new notifications"
                color="inherit"
              >
                <>
                  {!show && newNotificationsArray.length > 0 ? (
                    <Badge
                      badgeContent={newNotificationsArray.length}
                      color="secondary"
                      onClick={handleClick}
                    >
                      <NotificationsIcon />
                    </Badge>
                  ) : (
                    <NotificationsIcon />
                  )}
                  {show ? (
                    <div className={classes.alert}>
                      {newNotificationsArray.length > 0 ? (
                        newNotificationsArray.map((n) => (
                          <div className={classes.notificationDiv}>
                            <p
                              onClick={() => {
                                window.location.replace('/messages');
                              }}
                              className={classes.notificationsText}
                            >
                              {n.senderUsername.charAt(0).toUpperCase() +
                                n.senderUsername.slice(1)}{' '}
                              sent a new message
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No new notifications</p>
                      )}
                    </div>
                  ) : null}
                </>
              </IconButton>

              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar src={user.profilePic} />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                {newMessagesArray.length > 0 ? (
                  <Badge variant="dot" color="secondary">
                    <MenuIcon />
                  </Badge>
                ) : (
                  <MenuIcon />
                )}
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
    </>
  );
}
