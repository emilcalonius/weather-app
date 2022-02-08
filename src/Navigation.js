/*

Top navigation on large screens and menu opening from the side on mobile.

*/

import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

function Navigation() {
  const [ open, setOpen ] = useState(false);
  const isMobile = useMediaQuery({query: "(max-width:600px)"});

  const toggleDrawer = () => {
    setOpen(!open);
  };

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
              sx={open ? { display: 'none' } : {position: "absolute", right: 0}}
            >
              <MenuIcon sx={{color: "blanchedalmond"}} />
            </IconButton>
            <Drawer
              anchor={"right"}
              open={open}
              onClose={toggleDrawer}
            >
              <button className="btn">Valitse kaupunki</button>
              <button className="btn">Avaa kartta</button>
            </Drawer>
          </div>
      }
    </div>
  );
}

export default Navigation;