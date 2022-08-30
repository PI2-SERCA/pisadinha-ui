import React, { useEffect, useState } from 'react';
import {
  Box,
  Tab,
  Grid,
  Tabs,
  Paper,
  Container,
  CircularProgress,
  Typography,
} from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import { ItemCard } from '../../layout';
import APIAdapter from '../../services/api';
import { Cast } from '../../types';

export const Home: React.FC = () => {
  const history = useHistory();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [requestResponse, setRequestResponse] = useState<Cast[]>([]);

  useEffect(() => {
    const apiAdapter = new APIAdapter();

    setLoading(true);

    apiAdapter
      .get(selectedTab === 0 ? 'rooms' : 'cuts')
      .then((response) => {
        setRequestResponse(response);
        setError(false);
      })
      .catch(() => {
        setError(true);
        setRequestResponse([]);
      })
      .finally(() => setLoading(false));
  }, [selectedTab]);

  return (
    <Container maxWidth="lg" style={{ marginTop: 32 }}>
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
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography variant="body1" color="secondary">
              Falha ao buscar os dados do banco de dados. Por favor tente
              novamente.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {requestResponse.map((cast) => (
                <Grid
                  item
                  key={cast.name}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={2}
                  onClick={() =>
                    history.push(
                      `/${selectedTab === 0 ? 'room' : 'cut'}/${JSON.stringify(
                        cast
                      )}`
                    )
                  }
                >
                  <ItemCard type={selectedTab === 0 ? 'room' : 'cut'} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
