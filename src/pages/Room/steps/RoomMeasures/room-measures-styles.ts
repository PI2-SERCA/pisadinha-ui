import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    width: '100%',
    minWidth: '900px',
    display: 'flex',
    justifyContent: 'center',
  },
  canvas: {
    width: '90%',
    height: '70vh',
  },
}));

export default useStyles;
