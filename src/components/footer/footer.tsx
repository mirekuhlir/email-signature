import { Container } from '../ui/container';
import StyledLink from '../ui/styled-link';

export const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white py-8 mt-auto">
      <Container>
        <div className="flex">
          <div className="flex flex-col">
            <StyledLink variant="white" href="/">
              Home
            </StyledLink>
            <StyledLink variant="white" href="/privacy">
              Privacy Policy
            </StyledLink>
            <StyledLink variant="white" href="/terms">
              Terms of Service
            </StyledLink>
            <StyledLink variant="white" href="/refund">
              Refund
            </StyledLink>
          </div>
        </div>
        <div className="flex justify-center">
          <p>© {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};
