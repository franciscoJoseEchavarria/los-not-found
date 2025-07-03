import classNames from "classnames";

export const containerClasses = classNames(
  "relative w-full h-[94vh] flex flex-col justify-center items-center",
  "text-white text-center px-4 sm:px-6 md:px-8 font-roboto"
);

export const backgroundClasses = classNames(
  "absolute inset-0 bg-gradient-to-r from-black/20 to-black/50",
  "bg-cover bg-center"
);

export const overlayClasses = "absolute inset-0 bg-[#000835]/40 backdrop-blur-sm";

export const contentClasses = classNames(
  "relative z-10 flex flex-col justify-center items-center p-4",
  "w-[90%] max-w-lg md:max-w-2xl lg:max-w-3xl",
  "h-auto min-h-[300px] md:min-h-[400px] lg:min-h-[500px]"
);

export const titleClasses = "text-3xl sm:text-4xl md:text-5xl font-bold mb-3";
export const subtitleClasses = "text-lg sm:text-xl md:text-2xl opacity-90 mb-6";

export const buttonClasses = classNames(
  "inline-block bg-[#00d4ff] text-[#000835] px-6 py-3 text-lg sm:text-xl md:text-2xl",
  "font-bold rounded-lg no-underline transition-transform duration-300",
  "ease-in-out hover:bg-[#008cba] hover:scale-105 w-[80%] sm:w-[60%] md:w-[50%] text-center"
);
