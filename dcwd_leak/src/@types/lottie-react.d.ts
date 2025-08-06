declare module 'lottie-react' {
  import { ComponentType, CSSProperties } from 'react';

  interface LottieProps {
    animationData: object;
    loop?: boolean;
    autoplay?: boolean;
    style?: CSSProperties;
  }

  const Lottie: ComponentType<LottieProps>;

  export default Lottie;
}
