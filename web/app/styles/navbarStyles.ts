import classNames from "classnames";

export const navbarClasses = classNames(
  "fixed top-0 left-0 w-full h-[6vh] flex justify-between items-center",
  "px-5 z-[1000] shadow-md",
  "bg-[linear-gradient(rgba(255,255,255,0.85),rgba(255,255,255,0.85)),url('https://i.pinimg.com/originals/72/b3/6d/72b36ddca2bd379f7850f6f325ad0166.jpg')]",
  "bg-cover bg-center backdrop-blur-[20px]"
);

export const logoContainerClasses = "flex items-center h-full";

export const logoClasses = classNames(
  "ml-5 h-[80%] cursor-pointer transition-transform duration-300 ease-in-out",
  "hover:scale-110"
);

export const navContainerClasses = "flex items-center pr-5";

export const navListClasses = classNames("flex gap-5 list-none m-0 p-0");

export const navItemClasses = classNames(
  "text-[#222] text-xl font-bold px-6 py-2",
  "transition-transform duration-300 ease-in-out hover:text-[#0090a5] hover:scale-110"
);

export const mobileNavClasses = classNames(
  "flex-wrap justify-center sm:flex-row",
  "sm:h-[6vh] sm:flex sm:justify-between"
);
