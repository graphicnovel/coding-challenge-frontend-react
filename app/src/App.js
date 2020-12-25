import React from 'react';
import SearchForm from './component/SearchForm';
import ResultList from './component/ResultList';
import { ResultProvider } from './ResultContext';
import styled from 'styled-components';


const TitleContainer = styled.div`
  padding-left:55px;
`;
function App() {

  return (
    <ResultProvider>
      <TitleContainer>
        <h1>Police Department of Berlin</h1>
        <p>Stolen Bikes</p>
      </TitleContainer>
      <SearchForm />
      <ResultList />
    </ResultProvider >
  );
}

export default App;
