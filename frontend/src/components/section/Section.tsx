import { Box, Typography } from '@mui/material';

import { StyledSection, StyledSectionHeader } from '../../styled-components';
import { ISectionProps } from '../../utilities';

export const Section = ({
  title,
  description,
  actions,
  emphasis,
  children,
}: ISectionProps) => (
  <StyledSection as="section" $emphasis={emphasis}>
    <StyledSectionHeader>
      <Box>
        <Typography component="h2" variant="h6">
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
      {actions}
    </StyledSectionHeader>
    {children}
  </StyledSection>
);
