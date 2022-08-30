import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Step, Button, Stepper, StepLabel, Container } from '@material-ui/core';

import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Checkout } from './steps/Checkout';
import {
  CeramicMeasures,
  validateCeramicMeasures,
} from '../../components/CeramicMeasures';
import { CastMeasures as CutMeasures } from '../../components/CastMeasures';

import { Cast } from '../../types';

import useStyles from './cut-styles';
import APIAdapter from '../../services/api';
import { PiseiroDataContext } from '../../hooks/PiseiroData';
import { applyValues } from '../../utils/canvas';

const steps = ['Medidas cerâmica', 'Medidas corte', 'Preview'];

const MEASURE_PROPORTION = 10;

export const Cut: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { cutIdx } = useParams<{ cutIdx: string }>();

  const { cuts } = useContext(PiseiroDataContext);

  const [activeStep, setActiveStep] = useState(0);
  const [cut, setCut] = useState<Cast>({} as Cast);
  const [cutRepetitions, setCutRepetitions] = useState(1);
  const [spacing, setSpacing] = useState<number | null>(null);
  const [ceramicDepth, setCeramicDepth] = useState<number | null>(null);
  const [ceramicWidth, setCeramicWidth] = useState<number | null>(null);
  const [ceramicHeight, setCeramicHeight] = useState<number | null>(null);
  const [fieldsErrors, setFieldsErrors] = useState<Record<string, string>>({});
  const [cutMeasures, setCutMeasures] = useState<Record<string, number>>({});
  const [cutMeasuresErrors, setCutMeasuresErrors] = useState<
    Record<string, string>
  >({});
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string>>(
    {}
  );

  const cutMaxMeasure = useCallback(() => {
    const values = Object.values(cut.defaults);

    // + 50 is the offset
    return values.sort()[values.length - 1] * MEASURE_PROPORTION + 50;
  }, [cut]);

  const validateCeramicMeasuresStep = useCallback(() => {
    return validateCeramicMeasures({
      spacing,
      ceramicDepth,
      ceramicWidth,
      ceramicHeight,
      setFieldsErrors,
    });
  }, [spacing, ceramicDepth, ceramicWidth, ceramicHeight, setFieldsErrors]);

  const keyErrorMessage = (key: string, message: string) =>
    `"${key.toUpperCase()}" ${message}`;

  const validateAxisValues = useCallback(
    (points: string[]) => {
      const errors: Record<string, string> = {};

      if (!ceramicWidth || !ceramicHeight) return {};

      points.forEach((point) => {
        const [xKey, yKey] = point.split(';');
        const xValue = applyValues(cutMeasures, xKey);
        const yValue = applyValues(cutMeasures, yKey);

        if (xValue > ceramicWidth) {
          errors[xKey] = keyErrorMessage(
            xKey,
            'não pode ser maior as dimensões da cerâmica'
          );
        }

        if (yValue > ceramicHeight) {
          errors[yKey] = keyErrorMessage(
            yKey,
            'não pode ser maior as dimensões da cerâmica'
          );
        }
      });

      return errors;
    },
    [cutMeasures, ceramicWidth, ceramicHeight]
  );

  const validateCutMeasuresStep = useCallback(() => {
    let missingValue = false;
    let newFieldsErrors: Record<string, string> = {};

    Object.keys(cut.segments).forEach((key) => {
      if (!cutMeasures[key]) {
        missingValue = true;
        newFieldsErrors[key] = keyErrorMessage(key, 'é obrigatório');
      }
    });

    if (!missingValue) {
      newFieldsErrors = {
        ...newFieldsErrors,
        ...validateAxisValues(cut.points),
      };
    }

    setCutMeasuresErrors(newFieldsErrors);

    return Object.keys(newFieldsErrors).length === 0;
  }, [cut, cutMeasures, setCutMeasuresErrors, validateAxisValues]);

  const validateCheckoutStep = useCallback(() => {
    const newCheckoutErrors: Record<string, string> = {};

    if (cutRepetitions <= 0) {
      newCheckoutErrors.cutRepetitions =
        'O número de repetições deve ser maior que 0';
    }

    setCheckoutErrors(newCheckoutErrors);

    return Object.keys(newCheckoutErrors).length === 0;
  }, [cutRepetitions, setCheckoutErrors]);

  const validateStep = useCallback(() => {
    if (activeStep === 0) return validateCeramicMeasuresStep();

    if (activeStep === 1) return validateCutMeasuresStep();

    if (activeStep === 2) return validateCheckoutStep();

    return false;
  }, [
    activeStep,
    validateCeramicMeasuresStep,
    validateCutMeasuresStep,
    validateCheckoutStep,
  ]);

  const handleNext = useCallback(() => {
    if (!validateStep()) return;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, [validateStep]);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep()) return;

    try {
      const apiAdapter = new APIAdapter();

      const params = {
        repetitions: cutRepetitions,
        ceramic_data: { width: ceramicWidth, height: ceramicHeight },
        points: cut.points.map((point) =>
          point.split(';').map((value) => applyValues(cutMeasures, value))
        ),
      };

      await apiAdapter.post('single-cut', params);

      toast.success('Corte enviado com sucesso!');

      history.push('/');
    } catch (error) {
      toast.error(
        'Não foi possível enviar o corte. Por favor tente novamente.'
      );
    }
  }, [
    cut,
    history,
    cutMeasures,
    ceramicWidth,
    ceramicHeight,
    cutRepetitions,
    validateStep,
  ]);

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
              measure="cm"
              cast={cut}
              proportion={MEASURE_PROPORTION}
              maxCanvasHeight={cutMaxMeasure()}
              castMeasuresErrors={cutMeasuresErrors}
              castMeasures={cutMeasures}
              setCastMeasures={setCutMeasures}
            />
          );
        case 2:
          return (
            <Checkout
              cut={cut}
              cutMeasures={cutMeasures}
              checkoutErrors={checkoutErrors}
              cutRepetitions={cutRepetitions}
              setCutRepetitions={setCutRepetitions}
              ceramicWidth={ceramicWidth as number}
              ceramicHeight={ceramicHeight as number}
            />
          );
        default:
          return <div>Unknown step</div>;
      }
    },
    [
      cut,
      spacing,
      cutMaxMeasure,
      ceramicDepth,
      ceramicWidth,
      ceramicHeight,
      fieldsErrors,
      cutMeasures,
      checkoutErrors,
      cutRepetitions,
      setCutRepetitions,
      cutMeasuresErrors,
    ]
  );

  useEffect(() => {
    const idx = parseInt(cutIdx, 10);

    if (!cutIdx || Number.isNaN(idx) || (!Number.isNaN(idx) && !cuts[idx])) {
      history.push('/');
    } else {
      setCut(cuts[parseInt(cutIdx, 10)]);
    }
  }, [cuts, cutIdx, history]);

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
