import styled from 'styled-components/native';
import {Dimensions, Platform, PixelRatio} from 'react-native';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const scale = SCREEN_HEIGHT / 775; // Redmi Note 7

export function responsive(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const View = styled.TouchableOpacity`
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
  font-size: ${responsive(120)}px;
  font-family: 'DINSchrift';
  color: #fff;
  top: 6%;
`;

export const LittleText = styled.Text`
  font-size: ${responsive(30)}px;
  font-family: 'DINSchrift';
  color: #fff;
  align-self: flex-end;
`;
export const RedText = styled.Text`
  font-size: ${responsive(120)}px;
  font-family: 'DINSchrift';
  top: 6%;
  color: #f00;
`;

export const LittleRedText = styled.Text`
  font-size: ${responsive(30)}px;
  font-family: 'DINSchrift';
  color: #f00;
  align-self: flex-end;
`;
