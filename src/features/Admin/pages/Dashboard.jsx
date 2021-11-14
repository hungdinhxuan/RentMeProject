import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import Budget from "../ComponentAdmin/Dashboard/Budget";
import LatestOrders from "../ComponentAdmin/Dashboard/LatestOrders";
import LatestProducts from "../ComponentAdmin/Dashboard/LatestProducts";
import Sales from "../ComponentAdmin/Dashboard/Sales";
import TasksProgress from "../ComponentAdmin/Dashboard/TasksProgress";
import TotalCustomers from "../ComponentAdmin/Dashboard/TotalCustomers";
import TotalProfit from "../ComponentAdmin/Dashboard/TotalProfit";
import TrafficByDevice from "../ComponentAdmin/Dashboard/TrafficByDevice";
import { useEffect, useState } from "react";
import socket from 'utils/socket'

import axiosClient from "utils/axiosClient";

const Dashboard = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axiosClient
      .get("managements/statistics/summary")
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const handleRegisterPlayer = (player) => {

    }
    const notifyStatusRegisterPlayer = (player) => {

    }
    
    socket.on('register player', handleRegisterPlayer)
    socket.on('notify status register player', notifyStatusRegisterPlayer)
    return () => {
      socket.off('register player', handleRegisterPlayer)
      socket.off('notify status register player', notifyStatusRegisterPlayer)
    }
  }, [])
  return(
  <>
    <Helmet>
      <title>Dashboard</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100%",
        py: 3,
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalCustomers data={data} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TasksProgress />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit sx={{ height: "100%" }} data={data} />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <Sales />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice sx={{ height: "100%" }} />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <LatestProducts sx={{ height: "100%" }} />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>)
};

export default Dashboard;
