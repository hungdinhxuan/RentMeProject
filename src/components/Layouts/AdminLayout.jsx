import { ThemeProvider, StyledEngineProvider } from "@material-ui/core";
import DashboardLayout from "features/Admin/ComponentAdmin/DashboardLayout";
import GlobalStyles from "features/Admin/ComponentAdmin/GlobalStyles";
import theme from "features/Admin/theme/theme";
import React from "react";

export default function AdminLayout({ children, ...rest }) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <DashboardLayout>{children}</DashboardLayout>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
