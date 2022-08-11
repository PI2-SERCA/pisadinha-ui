import React, { useState, useCallback } from 'react';
import { Step, Button, Stepper, StepLabel, Container } from '@material-ui/core';

import { Checkout } from './steps/Checkout';
import { LayingStart } from './steps/LayingStart';
import { CastMeasures as RoomMeasures } from '../../components/CastMeasures';
import { CeramicMeasures as CeramicMeasuresStep } from '../../components/CeramicMeasures';

import { Cast } from '../../types';

import useStyles from './room-styles';

const steps = [
  'Medidas cerâmica',
  'Medidas cômodo',
  'Início assentamento',
  'Revisão',
];

const requestResponse: Cast = {
  points: ['0;0', '0;a', 'b;a', 'b;c', 'd;c', 'd;0'],
  defaults: {
    a: 4,
    b: 2,
    c: 7,
    d: 5,
  },
  segments: {
    a: ['0;0', '0;a'],
    b: ['0;a', 'b;a'],
    c: ['d;c', 'd;0'],
    d: ['0;0', 'd;0'],
  },
  name: 'Formato em L',
};

// TODO: Descer os botões e passar callbacks de onCancel e onSubmit e cada step controla
// seu estado interno
export const Room: React.FC = () => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(0);
  const [spacing, setSpacing] = useState<number | null>(null);
  const [ceramicDepth, setCeramicDepth] = useState<number | null>(null);
  const [ceramicWidth, setCeramicWidth] = useState<number | null>(null);
  const [ceramicHeight, setCeramicHeight] = useState<number | null>(null);
  const [fieldsErrors, setFieldsErrors] = useState<Record<string, string>>({});
  const [roomMeasures, setRoomMeasures] = useState<Record<string, number>>({});
  const [roomMeasuresErrors, setRoomMeasuresErrors] = useState<
    Record<string, string>
  >({});
  const [selectedLayingStart, setSelectedLayingStart] = useState('');

  const validateCeramicMeasuresStep = useCallback(() => {
    const newFieldsErrors: Record<string, string> = {};

    if (!spacing) newFieldsErrors.spacing = 'Espaçamento é obrigatório';
    if (!ceramicDepth) newFieldsErrors.ceramicDepth = 'Espessura é obrigatório';
    if (!ceramicWidth)
      newFieldsErrors.ceramicWidth = 'Comprimento é obrigatório';
    if (!ceramicHeight) newFieldsErrors.ceramicHeight = 'Altura é obrigatório';

    setFieldsErrors(newFieldsErrors);

    return Object.keys(newFieldsErrors).length === 0;
  }, [spacing, ceramicDepth, ceramicWidth, ceramicHeight, setFieldsErrors]);

  const validateRoomMeasuresStep = useCallback(() => {
    const newFieldsErrors: Record<string, string> = {};

    Object.keys(requestResponse.segments).forEach((key) => {
      if (!roomMeasures[key]) {
        newFieldsErrors[key] = `${key.toUpperCase()} é obrigatório`;
      }
    });

    setRoomMeasuresErrors(newFieldsErrors);

    return Object.keys(newFieldsErrors).length === 0;
  }, [roomMeasures, setRoomMeasuresErrors]);

  const validateStep = useCallback(() => {
    if (activeStep === 0) return validateCeramicMeasuresStep();

    if (activeStep === 1) return validateRoomMeasuresStep();

    if (activeStep === 2) return true;

    return false;
  }, [activeStep, validateCeramicMeasuresStep, validateRoomMeasuresStep]);

  const handleNext = useCallback(() => {
    if (!validateStep()) return;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, [validateStep]);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleSubmit = useCallback(() => {
    validateStep();
  }, [validateStep]);

  const getStepContent = useCallback(
    (step: number): JSX.Element => {
      switch (step) {
        case 0:
          return (
            <CeramicMeasuresStep
              spacing={spacing}
              setSpacing={setSpacing}
              ceramicDepth={ceramicDepth}
              setCeramicDepth={setCeramicDepth}
              ceramicWidth={ceramicWidth}
              setCeramicWidth={setCeramicWidth}
              ceramicHeight={ceramicHeight}
              setCeramicHeight={setCeramicHeight}
              fieldsErrors={fieldsErrors}
            />
          );
        case 1:
          return (
            <RoomMeasures
              requestResponse={requestResponse}
              castMeasuresErrors={roomMeasuresErrors}
              castMeasures={roomMeasures}
              setCastMeasures={setRoomMeasures}
            />
          );
        case 2:
          return (
            <LayingStart
              requestResponse={requestResponse}
              selectedLayingStart={selectedLayingStart}
              setSelectedLayingStart={setSelectedLayingStart}
            />
          );
        case 3:
          return <Checkout />;
        default:
          return <div>Unknown step</div>;
      }
    },
    [
      spacing,
      ceramicDepth,
      ceramicWidth,
      ceramicHeight,
      fieldsErrors,
      roomMeasures,
      roomMeasuresErrors,
      selectedLayingStart,
      setSelectedLayingStart,
    ]
  );

  return (
    <Container className={classes.container}>
      <div className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div>
          <div className={classes.instructions}>
            {getStepContent(activeStep)}
          </div>

          <div className={classes.actionBtnsContainer}>
            <Button
              color="secondary"
              variant="contained"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Voltar
            </Button>

            <Button
              color="primary"
              variant="contained"
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNext
              }
            >
              {activeStep === steps.length - 1 ? 'Enviar' : 'Próximo'}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Room;
