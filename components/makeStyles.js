import { createUseStyles } from 'react-jss';
import { GeistUIThemes, useTheme } from '@geist-ui/react';

const useStyles = (styles) => {
  const theme = useTheme();
  if (typeof styles === 'function') {
    styles = styles(theme);
  }
  return createUseStyles(styles)();
};

const makeStyles = (styles) => {
  return () => useStyles(styles);
};
export default makeStyles;
