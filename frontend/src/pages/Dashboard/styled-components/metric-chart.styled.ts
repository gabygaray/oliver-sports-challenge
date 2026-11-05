import { styled } from '@mui/material';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { BarChart } from '@mui/x-charts/BarChart';

/** The library sets the axis titles right next to the ticks; tilted names and five-digit figures need them pushed out. */
export const StyledBarChart = styled(BarChart)(({ theme }) => ({
  [`& .${axisClasses.bottom} .${axisClasses.label}`]: {
    transform: `translateY(${theme.spacing(6)})`,
  },
  [`& .${axisClasses.left} .${axisClasses.label}`]: {
    transform: `translateX(-${theme.spacing(3)})`,
  },
}));
