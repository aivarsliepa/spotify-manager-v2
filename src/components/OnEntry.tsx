import type { PropsWithChildren } from "react";
import { memo } from "react";
import { useInView } from "react-intersection-observer";

const OnEntry = ({ onEntry, children }: PropsWithChildren<{ onEntry: () => void }>) => {
  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView) {
        onEntry();
      }
    },
  });

  return <div ref={ref}>{children}</div>;
};

export default memo(OnEntry);
