import { Container } from '../ui/container';
import StyledLink from '../ui/styled-link';

export const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white py-8">
      <Container>
        <div className="flex flex-col sm:flex-row">
          {/* First column */}
          <div className="flex flex-col mb-4 md:mb-0">
            <StyledLink variant="white" href="/">
              Home
            </StyledLink>
            <StyledLink variant="white" href="/account">
              Account
            </StyledLink>
            <StyledLink variant="white" href="/pricing">
              Pricing
            </StyledLink>
            <StyledLink variant="white" href="/signatures">
              My Signatures
            </StyledLink>
            <StyledLink variant="white" href="/contact">
              Contact
            </StyledLink>
          </div>

          {/* Second column */}
          <div className="flex flex-col sm:ml-10">
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
        <div className="flex justify-center mt-4">
          <p>© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </Container>
    </footer>
  );
};
