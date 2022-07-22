import React, { useState } from 'react';
import {
  Step,
  Button,
  Stepper,
  StepLabel,
  Container,
} from '@material-ui/core';

import { CeramicMeasures as CeramicMeasuresStep } from './steps/CeramicMeasures';

import useStyles from './room-styles';

export const Room: React.FC = () => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(0);
  const [spacing, setSpacing] = useState<number | null>(null);
  const [ceramicDepth, setCeramicDepth] = useState<number | null>(null);
  const [ceramicWidth, setCeramicWidth] = useState<number | null>(null);
  const [ceramicHeight, setCeramicHeight] = useState<number | null>(null);
  const [fieldsErrors, setFieldsErrors] = useState<Record<string, string>>({});

  const steps = ['Medidas cerâmica', 'Medidas cômodo', 'Revisão'];

  const validateCeramicMeasuresStep = () => {
    const newFieldsErrors: Record<string, string> = {};

    if (!spacing) newFieldsErrors.spacing = 'Espaçamento é obrigatório';
    if (!ceramicDepth) newFieldsErrors.ceramicDepth = 'Espessura é obrigatório';
    if (!ceramicWidth) newFieldsErrors.ceramicWidth = 'Comprimento é obrigatório';
    if (!ceramicHeight) newFieldsErrors.ceramicHeight = 'Altura é obrigatório';

    setFieldsErrors(newFieldsErrors);

    return Object.keys(newFieldsErrors).length === 0;
  };

  const stepValidations: Record<number, () => boolean> = {
    0: validateCeramicMeasuresStep,
    1: () => true,
    2: () => true,
  };

  const handleNext = () => {
    if (!stepValidations[activeStep]()) return;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    stepValidations[activeStep]();
  };

  const getStepContent = (step: number): JSX.Element => {
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
        return <div>What is an ad group anyways?</div>;
      case 2:
        return <div>This is the bit I really care about!</div>;
      default:
        return <div>Unknown step</div>;
    }
  };

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
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
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
