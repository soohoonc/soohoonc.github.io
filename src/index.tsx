import * as React from 'react';
import * as ReactDOM  from 'react-dom';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';

import router from "./routes"
import { themeDark, themeLight } from "./themes"

ReactDOM.render(
  <React.StrictMode>
    {/* <ThemeProvider theme={themeDark}> */}
      <Box>
        <RouterProvider router={router} />
      </Box>
    {/* </ThemeProvider> */}
  </React.StrictMode>,
  document.getElementById('root')
);
