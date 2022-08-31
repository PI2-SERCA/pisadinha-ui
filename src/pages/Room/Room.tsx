import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Step, Button, Stepper, StepLabel, Container } from '@material-ui/core';

import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Checkout } from './steps/Checkout';
import { LayingStart } from './steps/LayingStart';
import { CastMeasures as RoomMeasures } from '../../components/CastMeasures';
import {
  CeramicMeasures as CeramicMeasuresStep,
  validateCeramicMeasures,
} from '../../components/CeramicMeasures';

import { Cast, Cut } from '../../types';

import useStyles from './room-styles';
import { DEFAULT_MEASURE_PROPORTION } from '../../utils/canvas';
import APIAdapter from '../../services/api';
import { PiseiroDataContext } from '../../hooks/PiseiroData';

interface PositionData {
  [key: string]: {
    full: number;
    cuts: Cut[];
  };
}

const steps = [
  'Medidas cerâmica',
  'Medidas cômodo',
  'Início assentamento',
  'Revisão',
];

// TODO: Descer os botões e passar callbacks de onCancel e onSubmit e cada step controla
// seu estado interno
export const Room: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { roomIdx } = useParams<{ roomIdx: string }>();

  const { rooms } = useContext(PiseiroDataContext);

  const [activeStep, setActiveStep] = useState(0);
  const [room, setRoom] = useState<Cast>({} as Cast);
  const [roomRepetitions, setRoomRepetitions] = useState(1);
  const [spacing, setSpacing] = useState<number | null>(null);
  const [ceramicDepth, setCeramicDepth] = useState<number | null>(null);
  const [ceramicWidth, setCeramicWidth] = useState<number | null>(null);
  const [ceramicHeight, setCeramicHeight] = useState<number | null>(null);
  const [notSelected, setNotSelected] = useState<Record<string, boolean>>({});
  const [fieldsErrors, setFieldsErrors] = useState<Record<string, string>>({});
  const [roomMeasures, setRoomMeasures] = useState<Record<string, number>>({});
  const [roomMeasuresErrors, setRoomMeasuresErrors] = useState<
    Record<string, string>
  >({});
  const [selectedLayingStart, setSelectedLayingStart] = useState('');
  const [layingStartValid, setLayingStartValid] = useState(true);
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string>>(
    {}
  );
  const [positionData, setPositionData] = useState<PositionData>({});

  const cutMaxMeasure = useCallback(() => {
    const values = Object.values(room.defaults);

    // + 50 is the offset
    return values.sort()[values.length - 1] * DEFAULT_MEASURE_PROPORTION + 50;
  }, [room]);

  const validateCeramicMeasuresStep = useCallback(() => {
    return validateCeramicMeasures({
      spacing,
      ceramicDepth,
      ceramicWidth,
      ceramicHeight,
      setFieldsErrors,
    });
  }, [spacing, ceramicDepth, ceramicWidth, ceramicHeight, setFieldsErrors]);

  const validateRoomMeasuresStep = useCallback(() => {
    const newFieldsErrors: Record<string, string> = {};

    Object.keys(room.segments).forEach((key) => {
      if (!roomMeasures[key]) {
        newFieldsErrors[key] = `${key.toUpperCase()} é obrigatório`;
      }
    });

    setRoomMeasuresErrors(newFieldsErrors);

    return Object.keys(newFieldsErrors).length === 0;
  }, [room, roomMeasures, setRoomMeasuresErrors]);

  const validateLayingStartStep = useCallback(() => {
    setLayingStartValid(!!selectedLayingStart);

    return !!selectedLayingStart;
  }, [selectedLayingStart, setLayingStartValid]);

  const validateCheckoutStep = useCallback(() => {
    const newCheckoutErrors: Record<string, string> = {};

    if (roomRepetitions <= 0) {
      newCheckoutErrors.roomRepetitions =
        'O número de repetições deve ser maior que 0';
    }

    if (
      Object.values(notSelected).filter((i) => !!i).length ===
      Object.keys(positionData[selectedLayingStart]).length
    )
      newCheckoutErrors.general = 'Pelo menos um corte deve ser selecionado';

    setCheckoutErrors(newCheckoutErrors);

    return Object.keys(newCheckoutErrors).length === 0;
  }, [
    notSelected,
    positionData,
    roomRepetitions,
    setCheckoutErrors,
    selectedLayingStart,
  ]);

  const validateStep = useCallback(() => {
    if (activeStep === 0) return validateCeramicMeasuresStep();

    if (activeStep === 1) return validateRoomMeasuresStep();

    if (activeStep === 2) return validateLayingStartStep();

    if (activeStep === 3) return validateCheckoutStep();

    return false;
  }, [
    activeStep,
    validateCeramicMeasuresStep,
    validateRoomMeasuresStep,
    validateLayingStartStep,
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

    const apiAdapter = new APIAdapter();

    try {
      const params = {
        repetitions: roomRepetitions,
        ceramic_data: { width: ceramicWidth, height: ceramicHeight },
        cuts: positionData[selectedLayingStart].cuts.filter(
          (cut) => !notSelected[cut.id]
        ),
      };

      await apiAdapter.post('scribe', params);

      toast.success('Cortes enviados com sucesso!');

      history.push('/');
    } catch {
      toast.error(
        'Não foi possível enviar os cortes. Por favor tente novamente.'
      );
    }
  }, [
    history,
    validateStep,
    roomRepetitions,
    ceramicWidth,
    ceramicHeight,
    positionData,
    selectedLayingStart,
    notSelected,
  ]);

  const getStepContent = useCallback(
    (step: number): JSX.Element => {
      switch (step) {
        case 0:
          return (
            <CeramicMeasuresStep
              isLaying
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
              measure="m"
              cast={room}
              maxCanvasHeight={cutMaxMeasure()}
              castMeasuresErrors={roomMeasuresErrors}
              castMeasures={roomMeasures}
              setCastMeasures={setRoomMeasures}
            />
          );
        case 2:
          return (
            <LayingStart
              room={room}
              spacing={spacing}
              positionData={positionData}
              setPositionData={setPositionData}
              ceramicWidth={ceramicWidth}
              ceramicHeight={ceramicHeight}
              roomMeasures={roomMeasures}
              layingStartValid={layingStartValid}
              selectedLayingStart={selectedLayingStart}
              setSelectedLayingStart={setSelectedLayingStart}
            />
          );
        case 3:
          return (
            <Checkout
              notSelected={notSelected}
              setNotSelected={setNotSelected}
              checkoutErrors={checkoutErrors}
              roomRepetitions={roomRepetitions}
              setRoomRepetitions={setRoomRepetitions}
              settlementData={positionData[selectedLayingStart].cuts}
            />
          );
        default:
          return <div>Unknown step</div>;
      }
    },
    [
      room,
      spacing,
      ceramicDepth,
      ceramicWidth,
      ceramicHeight,
      fieldsErrors,
      roomMeasures,
      positionData,
      setPositionData,
      roomRepetitions,
      setRoomRepetitions,
      notSelected,
      setNotSelected,
      checkoutErrors,
      roomMeasuresErrors,
      selectedLayingStart,
      setSelectedLayingStart,
      layingStartValid,
      cutMaxMeasure,
    ]
  );

  useEffect(() => {
    const idx = parseInt(roomIdx, 10);

    if (!roomIdx || Number.isNaN(idx) || (!Number.isNaN(idx) && !rooms[idx])) {
      history.push('/');
    } else {
      setRoom(rooms[parseInt(roomIdx, 10)]);
    }
  }, [rooms, roomIdx, history, setRoom]);

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
