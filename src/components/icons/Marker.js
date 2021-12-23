import React from 'react';
import Svg, {Circle, G, Path} from 'react-native-svg';
export default function Marker(props) {
  return (
    <Svg width={30} height={31} viewBox="0 0 305 313" {...props}>
      <G
        fill="none"
        stroke="#FF5533"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(-12, -24)">
        <Circle cx="12" cy="10" r="3" />
        <Path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
      </G>
    </Svg>
  );
}
