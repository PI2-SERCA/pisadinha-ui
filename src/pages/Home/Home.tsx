import React, { useContext, useEffect, useState } from 'react';
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
import { PiseiroDataContext } from '../../hooks/PiseiroData';

export const Home: React.FC = () => {
  const history = useHistory();

  const { cuts, setCuts, rooms, setRooms } = useContext(PiseiroDataContext);

  const [error, setError] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const getList = () => (selectedTab === 0 ? rooms : cuts);

  const fetchCasts = async (
    endpoint: 'rooms' | 'cuts',
    setState: React.Dispatch<React.SetStateAction<Cast[]>>
  ) => {
    const apiAdapter = new APIAdapter();

    setLoading(true);

    try {
      const response = await apiAdapter.get(endpoint);

      setError(false);
      setState(response);
    } catch {
      setError(true);
      setState([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === 0) fetchCasts('rooms', setRooms);
    else fetchCasts('cuts', setCuts);
  }, [selectedTab, setRooms, setCuts]);

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
              {getList().map((cast, idx) => (
                <Grid
                  item
                  key={cast.name}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={2}
                  onClick={() =>
                    history.push(
                      `/${selectedTab === 0 ? 'room' : 'cut'}/${idx}`
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
