// src/components/common/Navbar.jsx
import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import { AccountCircle, Store, Dashboard } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser, isAdmin, isStoreOwner, isNormalUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // console.log(currentUser,"sdfjuifgefvwhdkajslbhxkj");
  

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
              Store Rating System
            </Link>
          </Typography>
          
          {currentUser ? (
            <>
              {isAdmin && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/admin/dashboard"
                  startIcon={<Dashboard />}
                >
                  Dashboard
                </Button>
              )}
              
              {isStoreOwner && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/store-owner/dashboard"
                  startIcon={<Store />}
                >
                  My Store
                </Button>
              )}
              
              {isNormalUser && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/user/stores"
                  startIcon={<Store />}
                >
                  Stores
                </Button>
              )}
              
              <Box sx={{ ml: 2 }}>
                <IconButton
                  size="large"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                    {currentUser.name?.charAt(0) || "U"}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem disabled>
                    <Typography variant="body2">
                      {currentUser.name || currentUser.email}
                    </Typography>
                  </MenuItem>
                  <MenuItem 
                    onClick={() => {
                      handleClose();
                      navigate('/update-password');
                    }}
                  >
                    Change Password
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;