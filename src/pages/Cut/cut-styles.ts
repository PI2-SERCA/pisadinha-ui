import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    root: {
      width: '70%',
      minWidth: '900px',
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    actionBtnsContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      margin: '24px 0',
    },
  })
);

export default useStyles;
