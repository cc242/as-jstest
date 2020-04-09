import styled from 'styled-components';

const Navigation = styled.nav`
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  padding: 15px 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  background: #f9f9f9;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);

  a {
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

export default Navigation;
