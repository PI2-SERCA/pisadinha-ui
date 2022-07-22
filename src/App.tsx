import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Tabs,
  Tab,
} from '@material-ui/core';
import './App.css';

import { ItemCard } from './layout';

function App() {
  return (
    <Container maxWidth="lg">
      <Paper square>
        <Tabs
          value={0}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Cômodos" />
          <Tab label="Cortes" />
        </Tabs>
      </Paper>

      <Box style={{ marginTop: 16, marginLeft: 16 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ItemCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ItemCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ItemCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ItemCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ItemCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ItemCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ItemCard />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
