import styled from 'styled-components/native';

export const View = styled.View`
  flex: 1;
  background-color: #000;
  justify-content: center;
  padding-bottom: 12%;
`;

export const LoadingView = styled.View`
  flex: 1;
  justify-content: center;
`;
export const Row = styled.View`
  flex-direction: row;
  justify-content: center;
`;

export const Text = styled.Text`
  font-size: 120px;
  font-family: 'DINSchrift';
  color: #fff;
  top: 6%;
`;

export const LittleText = styled.Text`
  font-size: 30px;
  font-family: 'DINSchrift';
  color: #fff;
  align-self: flex-end;
`;
export const RedText = styled.Text`
  font-size: 120px;
  font-family: 'DINSchrift';
  top: 6%;
  color: #f00;
`;

export const LittleRedText = styled.Text`
  font-size: 30px;
  font-family: 'DINSchrift';
  color: #f00;
  align-self: flex-end;
`;
