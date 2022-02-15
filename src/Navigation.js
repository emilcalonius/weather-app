/*

Top navigation on large screens and menu drawerOpening from the side on mobile.

*/

import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import list from "./list.txt";
import { Button, Dialog, List, Menu, MenuItem } from "@mui/material";
import { Box } from "@mui/system";

function Navigation(props) {
  const [ drawerOpen, setdrawerOpen ] = useState(false);
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ cities, setCities ] = useState([]);
  const isMobile = useMediaQuery({query: "(max-width:600px)"});
  const menuOpen = Boolean(anchorEl);

  const toggleDrawer = () => {
    setdrawerOpen(!drawerOpen);
  };

  const toggleDialog = () => {
    setDialogOpen(!dialogOpen);
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetch(list)
      .then((res) => res.text())
      .then((res) => setCities(res.split("\n")));
  }, []);

  return(
    <div className="nav">
      {
        !isMobile ?
          <div>
            <button className="btn" onClick={openMenu}>Valitse kaupunki</button>
            <button className="btn">Avaa kartta</button>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              {
                cities.map(city => {
                  return(
                    <Box key={city}>
                      <MenuItem
                        onClick={() => {
                          props.updateCity(city);
                          handleMenuClose();
                        }}
                      >
                        {city}
                      </MenuItem>
                    </Box>
                  );
                })
              }
            </Menu>
          </div>
          :
          <div>
            <IconButton
              onClick={toggleDrawer}
              sx={drawerOpen ? { display: 'none' } : {position: "absolute", right: 0}}
            >
              <MenuIcon sx={{color: "blanchedalmond"}} />
            </IconButton>
            <Drawer
              anchor={"right"}
              open={drawerOpen}
              onClose={toggleDrawer}
            >
              <button className="btn" onClick={toggleDialog}>Valitse kaupunki</button>
              <button className="btn">Avaa kartta</button>
            </Drawer>
            <Dialog onClose={toggleDialog} open={dialogOpen}>
              <List>
                <Box>
                  {
                    cities.map(city => {
                      return(
                        <Box key={city}>
                          <Button
                            fullWidth={true}
                            onClick={() => {
                              props.updateCity(city);
                              toggleDialog();
                              toggleDrawer();
                            }}
                          >
                            {city}
                          </Button>
                        </Box>
                      );
                    })
                  }
                </Box>
              </List>
            </Dialog>
          </div>
      }
    </div>
  );
}

export default Navigation;