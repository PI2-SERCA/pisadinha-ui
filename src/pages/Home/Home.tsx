import React from 'react';
import { Box, Tab, Grid, Tabs, Paper, Container } from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import { ItemCard } from '../../layout';

export const Home: React.FC = () => {
  const history = useHistory();

  return (
    <Container maxWidth="lg">
      <Paper square>
        <Tabs value={0} indicatorColor="primary" textColor="primary">
          <Tab label="Cômodos" />
          <Tab label="Cortes" />
        </Tabs>
      </Paper>

      <Box style={{ marginTop: 16, marginLeft: 16 }}>
        <Grid container spacing={2}>
          {Array.from(Array(10).keys()).map((idx) => (
            <Grid
              item
              key={idx}
              xs={12}
              sm={6}
              md={4}
              lg={2}
              onClick={() => history.push('/room')}
            >
              <ItemCard />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
