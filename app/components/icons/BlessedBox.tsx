import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

interface BlessedBoxProps {
  width?: number;
  height?: number;
}

const BlessedBox: React.FC<BlessedBoxProps> = ({ width = 60, height = 100 }) => (
  <Svg width={width} height={height} viewBox="0 0 60 100" fill="none">
    <Rect width={60} height={100} fill="white" />
    <Path d="M52.8002 44H7.2002V68H52.8002V44Z" fill="#2E7D32" stroke="black" strokeWidth={0.24} />
    <Path d="M54 36H6V46H54V36Z" fill="#C62828" stroke="black" strokeWidth={0.24} />
    <Path d="M52.8002 44H7.2002V46H52.8002V44Z" fill="#B71C1C" />
    <Path d="M11.9998 50L12.5998 53L10.7998 51.4H13.1998L11.3998 53L11.9998 50Z" stroke="white" strokeWidth={0.24} />
    <Path d="M21.5994 60L22.1994 63L20.3994 61.4H22.7994L20.9994 63L21.5994 60Z" stroke="white" strokeWidth={0.24} />
    <Path d="M35.9998 52L36.5998 55L34.7998 53.4H37.1998L35.3998 55L35.9998 52Z" stroke="white" strokeWidth={0.24} />
    <Path d="M41.9998 62L42.5998 65L40.7998 63.4H43.1998L41.3998 65L41.9998 62Z" stroke="white" strokeWidth={0.24} />
    <Path d="M15.5994 64L16.1994 67L14.3994 65.4H16.7994L14.9994 67L15.5994 64Z" stroke="white" strokeWidth={0.24} />
    <Path d="M47.9998 48L48.5998 51L46.7998 49.4H49.1998L47.3998 51L47.9998 48Z" stroke="white" strokeWidth={0.24} />
    <Path
      d="M18 57.5999C18.5302 57.5999 18.96 56.8836 18.96 55.9999C18.96 55.1162 18.5302 54.3999 18 54.3999C17.4698 54.3999 17.04 55.1162 17.04 55.9999C17.04 56.8836 17.4698 57.5999 18 57.5999Z"
      stroke="white"
      strokeWidth={0.24}
    />
    <Path
      d="M33.5999 65.1998C33.9975 65.1998 34.3199 64.6625 34.3199 63.9998C34.3199 63.3371 33.9975 62.7998 33.5999 62.7998C33.2022 62.7998 32.8799 63.3371 32.8799 63.9998C32.8799 64.6625 33.2022 65.1998 33.5999 65.1998Z"
      stroke="white"
      strokeWidth={0.24}
    />
    <Path
      d="M43.2 58C43.8627 58 44.4 57.1046 44.4 56C44.4 54.8954 43.8627 54 43.2 54C42.5373 54 42 54.8954 42 56C42 57.1046 42.5373 58 43.2 58Z"
      stroke="white"
      strokeWidth={0.24}
    />
    <Path d="M12 58C13.6 60 15.2 60 16.8 58C18.4 56 20 56 21.6 58" stroke="white" strokeWidth={0.24} />
    <Path d="M31.2002 48C32.4002 49.3333 33.6002 49.3333 34.8002 48C36.0002 46.6667 37.2002 46.6667 38.4002 48" stroke="white" strokeWidth={0.24} />
    <Path opacity={0.9} d="M31.1998 36H28.7998V68H31.1998V36Z" fill="white" />
    <Path opacity={0.9} d="M54 40H6V42H54V40Z" fill="white" />
    <Path d="M30 38C31.6 35.3333 33.2 35.3333 34.8 38C33.2 40.6667 31.6 40.6667 30 38Z" fill="#FF0000" stroke="black" strokeWidth={0.12} />
    <Path d="M30.0002 38C28.4002 35.3333 26.8002 35.3333 25.2002 38C26.8002 40.6667 28.4002 40.6667 30.0002 38Z" fill="#FF0000" stroke="black" strokeWidth={0.12} />
    <Path
      d="M30.0003 39.1998C30.3979 39.1998 30.7203 38.6625 30.7203 37.9998C30.7203 37.3371 30.3979 36.7998 30.0003 36.7998C29.6026 36.7998 29.2803 37.3371 29.2803 37.9998C29.2803 38.6625 29.6026 39.1998 30.0003 39.1998Z"
      fill="white"
      stroke="black"
      strokeWidth={0.12}
    />
  </Svg>
);

export default BlessedBox;
