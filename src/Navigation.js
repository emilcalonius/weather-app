/*

Top navigation on large screens and menu openDrawering from the side on mobile.

*/

import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import list from "./list.txt";
import { Button, Dialog, List } from "@mui/material";
import { Box } from "@mui/system";

function Navigation(props) {
  const [ openDrawer, setOpenDrawer ] = useState(false);
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ cities, setCities ] = useState([]);
  const isMobile = useMediaQuery({query: "(max-width:600px)"});

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const toggleDialog = () => {
    setDialogOpen(!dialogOpen);
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
            <button className="btn">Valitse kaupunki</button>
            <button className="btn">Avaa kartta</button>
          </div>
          :
          <div>
            <IconButton
              onClick={toggleDrawer}
              sx={openDrawer ? { display: 'none' } : {position: "absolute", right: 0}}
            >
              <MenuIcon sx={{color: "blanchedalmond"}} />
            </IconButton>
            <Drawer
              anchor={"right"}
              open={openDrawer}
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