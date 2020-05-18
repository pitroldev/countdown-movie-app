import React from 'react';
import {StatusBar} from 'react-native';

import CountdownTimer from './components/countdown';

const App = () => (
  <>
    <StatusBar barStyle="light-content" backgroundColor="#000" />
    <CountdownTimer />
  </>
);

export default App;
