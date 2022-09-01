import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    inputBox: {
      marginTop: 16,
      display: 'flex',
      flexWrap: 'wrap',
      padding: '0 16px',
      justifyContent: 'space-between',
    },
  })
);

export default useStyles;
