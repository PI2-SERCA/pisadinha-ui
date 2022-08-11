import React, { useState, useCallback } from 'react';
import { Step, Button, Stepper, StepLabel, Container } from '@material-ui/core';

import { Checkout } from './steps/Checkout';
import { CeramicMeasures } from '../../components/CeramicMeasures';
import { CastMeasures as CutMeasures } from '../../components/CastMeasures';

import { Cast } from '../../types';

import useStyles from './cut-styles';

const steps = ['Medidas cerâmica', 'Medidas corte', 'Revisão'];

// const requestResponse: Cast = {
//   points: ['0;0', '0;a', 'b;a', 'b;c', 'd;c', 'd;0'],
//   defaults: {
//     a: 4,
//     b: 2,
//     c: 7,
//     d: 5,
//   },
//   segments: {
//     a: ['0;0', '0;a'],
//     b: ['0;a', 'b;a'],
//     c: ['d;c', 'd;0'],
//     d: ['0;0', 'd;0'],
//   },
//   name: 'Formato em L',
// };

const requestResponse: Cast = {
  points: ['0;0', 'a;0', 'a;b', '0;b', '0;0'],
  defaults: {
    a: 6,
    b: 6,
    c: 6,
    d: 6,
  },
  segments: {
    a: ['0;0', 'a;0'],
    b: ['a;b', '0;b'],
    c: ['0;b', '0;0'],
    d: ['0;0', '0;0'],
  },
  name: 'Formato em L',
};

export const Cut: React.FC = () => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(0);
  const [spacing, setSpacing] = useState<number | null>(null);
  const [ceramicDepth, setCeramicDepth] = useState<number | null>(null);
  const [ceramicWidth, setCeramicWidth] = useState<number | null>(null);
  const [ceramicHeight, setCeramicHeight] = useState<number | null>(null);
  const [fieldsErrors, setFieldsErrors] = useState<Record<string, string>>({});
  const [cutMeasures, setCutMeasures] = useState<Record<string, number>>({});
  const [cutMeasuresErrors, setCutMeasuresErrors] = useState<
    Record<string, string>
  >({});
  const [cutPosition, setCutPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

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

  const validateCutMeasuresStep = useCallback(() => {
    const newFieldsErrors: Record<string, string> = {};

    Object.keys(requestResponse.segments).forEach((key) => {
      if (!cutMeasures[key]) {
        newFieldsErrors[key] = `${key.toUpperCase()} é obrigatório`;
      }
    });

    setCutMeasuresErrors(newFieldsErrors);

    return Object.keys(newFieldsErrors).length === 0;
  }, [cutMeasures, setCutMeasuresErrors]);

  const validateStep = useCallback(() => {
    if (activeStep === 0) return validateCeramicMeasuresStep();

    if (activeStep === 1) return validateCutMeasuresStep();

    if (activeStep === 2) return true;

    return false;
  }, [activeStep, validateCeramicMeasuresStep, validateCutMeasuresStep]);

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
            <CeramicMeasures
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
            <CutMeasures
              requestResponse={requestResponse}
              castMeasuresErrors={cutMeasuresErrors}
              castMeasures={cutMeasures}
              setCastMeasures={setCutMeasures}
            />
          );
        case 2:
          return (
            <Checkout
              requestResponse={requestResponse}
              cutPosition={cutPosition}
              setCutPosition={setCutPosition}
              ceramicWidth={ceramicWidth as number}
              ceramicHeight={ceramicHeight as number}
            />
          );
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
      cutMeasures,
      cutMeasuresErrors,
      cutPosition,
      setCutPosition,
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

export default Cut;
