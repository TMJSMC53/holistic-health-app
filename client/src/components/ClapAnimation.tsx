import { useSpring, animated } from '@react-spring/web';

type ClapAnimationProps = {
  show: boolean;
};

const ClapAnimation = ({ show }: ClapAnimationProps) => {
  const styles = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? 'scale(1.2)' : 'scale(0.8)',
    config: { tension: 180, friction: 12 },
  });

  return (
    <animated.div
      style={{
        ...styles,
        position: 'absolute',
        top: '-30px',
        right: '-30px',
        transform: styles.transform.to(
          (value) => `${value} translate(-50%, -50%)`
        ),
        pointerEvents: 'none',
      }}
    >
      <span role="img" aria-label="clap" className="text-5xl">
        👏👏👏
      </span>
    </animated.div>
  );
};

export default ClapAnimation;
