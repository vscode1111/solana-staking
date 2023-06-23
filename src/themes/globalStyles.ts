import { COLORS } from "../consts/styles";

export const globalStyles = `   
  html {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: -webkit-fill-available;
    scroll-behavior: smooth;
  }
  
  body {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background: ${COLORS.black};
    box-sizing: border-box;
    color: ${COLORS.black};
    font-family: 'Galano Grotesque';
    font-size: 16px;
    flex-direction: column;
    flex: 1;
    margin: 0;
    padding: 0;
    position: relative;
    scroll-behavior: smooth;
    text-rendering: optimizeLegibility;
  }
  
  button, input, optgroup, select, textarea {
    font-family: 'Galano Grotesque';
    font-size: 100%;
    line-height: 110%;
    margin: 0;
  }
        
  ::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }
        
  :-moz-focusring {
    outline: 1px dotted ButtonText;
  }

  ::-webkit-scrollbar {
    width: 7px;
    height: 0px;
  }
  
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px transparent;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #5E5E5E;
    border-radius: 5px;
  }

  ::selection {
    color: ${COLORS.white};
    background: ${COLORS.black};
  }

  a {
    text-decoration: none;
  }
`;
