import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    inputBox: {
      marginTop: 16,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
  })
);

export default useStyles;
