import React, { useState } from 'react';
import { Box, Tab, Grid, Tabs, Paper, Container } from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import { ItemCard } from '../../layout';

export const Home: React.FC = () => {
  const history = useHistory();

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Container maxWidth="lg">
      <Paper square>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(
            _: React.ChangeEvent<Record<string, unknown>>,
            newValue: number
          ) => setSelectedTab(newValue)}
        >
          <Tab label="Cômodos" />
          <Tab label="Cortes" />
        </Tabs>
      </Paper>

      <Box role="tabpanel">
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
                onClick={() =>
                  history.push(`/${selectedTab === 0 ? 'room' : 'cut'}`)
                }
              >
                <ItemCard type={selectedTab === 0 ? 'room' : 'cut'} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
