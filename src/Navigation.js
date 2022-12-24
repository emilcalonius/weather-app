/*

Top navigation on large screens and drawer on mobile.

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
  const [ cityList, setCityList ] = useState([]);
  const isMobile = useMediaQuery({query: "(max-width:600px)"});
  const menuOpen = Boolean(anchorEl);

  const toggleDrawer = () => {
    setdrawerOpen(!drawerOpen);
  };

  const toggleDialog = () => {
    setCityList(cities);
    setDialogOpen(!dialogOpen);
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setCityList(cities);
    setAnchorEl(null);
  };

  const updateList = (event) => {
    const filteredCities = cities.filter(cityName => cityName.toLowerCase().includes(event.target.value.toLowerCase()));
    setCityList(filteredCities);
  }

  useEffect(() => {
    // Read the list of finnish cities from a file
    // and add the cities to an array
    fetch(list)
      .then((res) => res.text())
      .then((res) => {
        const cities = res.split("\n");
        setCities(cities);
        setCityList(cities);
      });
  }, []);

  return(
    <div className="nav">
      {
        !isMobile ?
          <div>
            <button className="btn" onClick={openMenu}>Valitse kaupunki</button>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              <input placeholder="Search for city..." onChange={updateList} />
              {/* <Box key="snackbar">
                <MenuItem
                  onClick={() => {
                    props.updateCity("city");
                    handleMenuClose();
                  }}
                >
                  snackbar test
                </MenuItem>
              </Box> */}
              {
                cityList.map(city => {
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
            </Drawer>
            <Dialog onClose={toggleDialog} open={dialogOpen}>
              <List>
                <Box>
                  <Box key="snackbar">
                    <Button
                      style={{color: "blanchedalmond"}}
                      fullWidth={true}
                      onClick={() => {
                        props.updateCity("city");
                        toggleDialog();
                        toggleDrawer();
                      }}
                    >
                      snackbar test
                    </Button>
                  </Box>
                  <input placeholder="Search for city..." onChange={updateList} />
                  {
                    cityList.map(city => {
                      return(
                        <Box key={city}>
                          <Button
                            style={{color: "blanchedalmond"}}
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