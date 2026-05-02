"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Investment } from "./types";

const Filter = ({
  filterOptions,
  data,
  setProjectData,
}: {
  filterOptions: string[];
  data: Investment[];
  setProjectData: React.Dispatch<React.SetStateAction<Investment[]>>;
}) => {
  const [isActive, setIsActive] = useState<string>("All");
  console.log(isActive);
  const [toggle, setToggle] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Auto-focus first menu item when menu opens
  useEffect(() => {
    if (toggle && itemRefs.current[0]) {
      itemRefs.current[0].focus();
    }
  }, [toggle]);

  const handleKeyDownMenu = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "Escape":
        setToggle(false);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        itemRefs.current[(index + 1) % filterOptions.length]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        itemRefs.current[
          (index - 1 + filterOptions.length) % filterOptions.length
        ]?.focus();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        handleActiveFilter(filterOptions[index]);
        setToggle(false);
        buttonRef.current?.focus();
        break;
    }
  };

  const handleActiveFilter = (option: string) => {
    setIsActive(option);
    setToggle(false);
    const filteredData =
      option !== "All"
        ? data.filter((item) => item.categories === option)
        : data;
    console.log(filteredData);
    setProjectData(filteredData);
  };
  return (
    <>
      <ul className=" gap-9 hidden lg:flex">
        {filterOptions.map((option: string) => {
          if (option === "All") {
            return (
              <li
                key={option}
                onClick={() => handleActiveFilter(option)}
                className={`${isActive === "All" ? "bg-[#CCCCCC] text-[#1C2D49] rounded-full" : ""} rounded-2xl ${isActive !== option ? "hover:bg-slate-400/20 hover:rounded-full" : " hover:rounded-full"} px-[12px] py-[6px] cursor-pointer`}
              >
                {option}
              </li>
            );
          }
          return (
            <li
              onClick={() => handleActiveFilter(option)}
              key={option}
              className={`${isActive === option ? "bg-[#CCCCCC] text-[#1C2D49] rounded-full" : ""} rounded-2xl ${isActive !== option ? "hover:bg-slate-400/20 hover:rounded-full" : "hover:rounded-full"}  px-[12px] py-[6px] cursor-pointer`}
            >
              {option}
            </li>
          );
        })}
      </ul>
      <div className="relative w-full lg:hidden flex">
        <button
          ref={buttonRef}
          onClick={() => setToggle((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={toggle}
          aria-controls="filter-menu"
          className="w-full flex bg-white justify-between py-1 px-2 text-[#1C2D49]"
        >
          <span>{isActive}</span>
          <ChevronDown aria-hidden="true" />
        </button>

        {toggle && (
          <ul
            id="filter-menu"
            role="menu"
            className="absolute top-9 flex lg:hidden gap-4 p-4 w-full flex-col bg-white z-30"
          >
            {filterOptions.map((option, idx) => (
              <li
                key={option}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  handleActiveFilter(option);
                  setToggle(false);
                  buttonRef.current?.focus();
                }}
                onKeyDown={(e) => handleKeyDownMenu(e, idx)}
                className="text-[#1C2D49] cursor-pointer hover:bg-slate-400/20 rounded-full px-[12px] py-[6px] focus:outline-none focus:bg-slate-400/30"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Filter;
