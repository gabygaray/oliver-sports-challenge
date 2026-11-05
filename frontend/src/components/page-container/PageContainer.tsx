import { Box, Container } from '@mui/material';

import { StyledPageContainer, StyledPageHero } from '../../styled-components';
import { IPageContainerProps } from '../../utilities';

export const PageContainer = ({ hero, children }: IPageContainerProps) => (
  <>
    <StyledPageHero as="header">
      <Container maxWidth="xl">{hero}</Container>
    </StyledPageHero>
    <Box component="main">
      <StyledPageContainer maxWidth="xl">{children}</StyledPageContainer>
    </Box>
  </>
);
