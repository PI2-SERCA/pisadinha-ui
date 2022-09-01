import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      minWidth: '900px',
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    ceramicContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-around',
    },
    ceramic: {
      width: '250px',
      height: '250px',
      border: '1px solid black',
    },
    ceramicDepth: {
      width: '64px',
      height: '250px',
      border: '1px solid black',
    },
    ceramicWidthContainer: {
      display: 'flex',
      maxWidth: '252px',
      justifyContent: 'center',
      margin: `${theme.spacing(2)}px 0`,
    },
    measuresCeramic: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    measuresInput: {
      width: '128px',
    },
    actionBtnsContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '32px',
    },
  })
);

export default useStyles;
