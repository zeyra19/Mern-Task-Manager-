import React, { useEffect } from "react";

interface DetectOutsideProps {
  ref: React.RefObject<HTMLDivElement>;
  callback: () => void;
}
// dropdown menüyü kapatmak için
function useDetectOutside({ ref, callback }: DetectOutsideProps) {
  useEffect(()=> {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeElementListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);

  return ref;
}

export default useDetectOutside;