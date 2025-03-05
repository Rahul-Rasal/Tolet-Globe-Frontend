/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
// import axios from "axios";
// import { BASE_URL } from "../../../constant/constant";
import {
  BsHouseDoor,
  BsBuilding,
  BsPeople,
  BsBriefcase,
  BsShop,
  BsBox,
} from "react-icons/bs";

const Filters = ({
  SetIsOpen,
  updateFilterCount,
  filters,
  setFilters,
  resetFilters,
  fetchAndFilterProperties,
  setCurrentPage,
  city,
  selectedArea,
  selectedLocality,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const countAppliedFilters = (filters) => {
      return Object.values(filters).reduce((count, filterValue) => {
        if (Array.isArray(filterValue)) {
          return count + (filterValue.length > 0 ? 1 : 0);
        } else {
          return count + (filterValue ? 1 : 0);
        }
      }, 0);
    };
    const totalFilters = countAppliedFilters(filters);
    updateFilterCount(totalFilters);
  }, [filters, updateFilterCount]);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => {
      if (Array.isArray(prevFilters[key])) {
        if (prevFilters[key].includes(value)) {
          return {
            ...prevFilters,
            [key]: prevFilters[key].filter((item) => item !== value),
          };
        } else {
          return {
            ...prevFilters,
            [key]: [...prevFilters[key], value],
          };
        }
      } else {
        const newFilters = {
          ...prevFilters,
          [key]: prevFilters[key] === value ? "" : value,
        };
        if (key === "preferenceHousing" && value === "Family") {
          newFilters.genderPreference = "";
        }
        return newFilters;
      }
    });
    console.log(filters);
  };

  const seeResults = async () => {
    setCurrentPage(1);
    fetchAndFilterProperties(city, selectedArea, selectedLocality);
    SetIsOpen(false);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);

    // Reset all filters first
    setFilters((prev) => ({
      ...prev,
      residential: [],
      commercial: [],
      bhk: [],
      houseType: [],
      preferenceHousing: "",
      genderPreference: "",
    }));

    // Update filters based on category
    if (category === "HOUSES" || category === "FLATS") {
      handleFilterChange(
        "residential",
        category === "HOUSES" ? "+ House" : "+ Flat"
      );
    } else if (category === "PAYING GUESTS") {
      handleFilterChange("residential", "+ PG");
    } else if (category === "OFFICES") {
      handleFilterChange("commercial", "+ Office");
      seeResults();
    } else if (category === "SHOPS") {
      handleFilterChange("commercial", "+ Shop");
      seeResults();
    } else if (category === "WAREHOUSES") {
      handleFilterChange("commercial", "+ Warehouse");
      seeResults();
    }
  };

  return (
    <>
      <div className="w-[670px]  bg-white p-0 sm:p-2 -ml-[15px]  -mt-4 shadow-sm rounded-xl">
        <div className="flex sm:gap-6 ">
          {[
            { icon: BsHouseDoor, text: "HOUSES" },
            { icon: BsBuilding, text: "FLATS" },
            { icon: BsPeople, text: "PAYING GUESTS" },
            { icon: BsBriefcase, text: "OFFICES" },
            { icon: BsShop, text: "SHOPS" },
            { icon: BsBox, text: "WAREHOUSES" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-[110px] sm:w-[100px] cursor-pointer text-black hover:text-white hover:bg-[#c8a018] rounded-xl  py-1"
              onClick={() => handleCategoryClick(item.text)}
            >
              <item.icon size={24} className="mb-2" />
              <span className="text-xs text-center font-medium">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedCategory === "HOUSES" && (
        <div className="w-fit bg-white p-[20px] m-1 shadow-md sm:-ml-4 rounded-xl">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col">
              <h3 className="text-left font-medium mb-8 text-black text-2xl">
                BHK
              </h3>
              <div className="flex flex-row gap-12">
                {["+ 1 BHK", "+ 2 BHK", "+ 3 BHK", "+ 4 BHK", "+ 5 BHK"].map(
                  (bhk) => (
                    <label
                      key={bhk}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name="bhk"
                        value={bhk}
                        checked={filters.bhk.includes(bhk)}
                        onChange={() => handleFilterChange("bhk", bhk)}
                        className="appearance-none w-4 h-4 rounded-full border-2 border-black checked:bg-black checked:border-[#4A7F79] checked:border-4 transition-all"
                      />
                      <span className="text-lg text-black overflow-hidden whitespace-nowrap text-ellipsis">
                        {bhk}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-left font-medium mb-8 text-black text-2xl">
                House Type
              </h3>
              <div className="flex flex-row gap-6">
                {["Fully Furnished", "Semi Furnished", "Not Furnished"].map(
                  (type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name="houseType"
                        value={type}
                        checked={filters.houseType.includes(type)}
                        onChange={() => handleFilterChange("houseType", type)}
                        className="appearance-none w-4 h-4 rounded-full border-2 border-black checked:bg-black checked:border-[#4A7F79] checked:border-4 transition-all"
                      />
                      <span className="text-lg text-black">{type}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-left font-medium mb-8 text-black text-2xl">
                Preference
              </h3>
              <div className="flex flex-row gap-6">
                {["Family", "Bachelors"].map((preference) => (
                  <label
                    key={preference}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="preferenceHousing"
                      value={preference}
                      checked={filters.preferenceHousing === preference}
                      onChange={() =>
                        handleFilterChange("preferenceHousing", preference)
                      }
                      className="appearance-none w-4 h-4 rounded-full border-2 border-black checked:bg-black checked:border-[#4A7F79] checked:border-4 transition-all"
                    />
                    <span className="text-lg text-black">{preference}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear
              </button>
              <button
                onClick={seeResults}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCategory === "FLATS" && (
        <div className="w-fit bg-white p-[20px] m-1  shadow-md sm:-ml-4 rounded-xl">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col">
              <h3 className="text-left font-medium mb-8 text-black text-2xl">
                BHK
              </h3>
              <div className="flex flex-row gap-12">
                {["+ 1 BHK", "+ 2 BHK", "+ 3 BHK", "+ 4 BHK", "+ 5 BHK"].map(
                  (bhk) => (
                    <label
                      key={bhk}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name="bhk"
                        value={bhk}
                        checked={filters.bhk.includes(bhk)}
                        onChange={() => handleFilterChange("bhk", bhk)}
                        className="appearance-none w-4 h-4 rounded-full border-2 border-black checked:bg-black checked:border-[#4A7F79] checked:border-4 transition-all"
                      />
                      <span className="text-lg text-black overflow-hidden whitespace-nowrap text-ellipsis">
                        {bhk}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-left font-medium mb-8 text-black text-2xl">
                House Type
              </h3>
              <div className="flex flex-row gap-6">
                {["Fully Furnished", "Semi Furnished", "Not Furnished"].map(
                  (type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name="houseType"
                        value={type}
                        checked={filters.houseType.includes(type)}
                        onChange={() => handleFilterChange("houseType", type)}
                        className="appearance-none w-4 h-4 rounded-full border-2 border-black checked:bg-black checked:border-[#4A7F79] checked:border-4 transition-all"
                      />
                      <span className="text-lg text-black">{type}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-left font-medium mb-8 text-black text-2xl">
                Preference
              </h3>
              <div className="flex flex-row gap-6">
                {["Family", "Bachelors"].map((preference) => (
                  <label
                    key={preference}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="preferenceHousing"
                      value={preference}
                      checked={filters.preferenceHousing === preference}
                      onChange={() =>
                        handleFilterChange("preferenceHousing", preference)
                      }
                      className="appearance-none w-4 h-4 rounded-full border-2 border-black checked:bg-black checked:border-[#4A7F79] checked:border-4 transition-all"
                    />
                    <span className="text-lg text-black">{preference}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear
              </button>
              <button
                onClick={seeResults}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCategory === "PAYING GUESTS" && (
        <div className="w-[670px] bg-white p-4 pt-3 mt-1 -ml-4 shadow-md ml-4 rounded-xl">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <h3 className="text-left font-medium mb-8 text-black text-2xl">
                Preference
              </h3>
              <div className="flex flex-row gap-6">
                {["Girls", "Boys"].map((gender) => (
                  <label
                    key={gender}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      // checked={filters.gender.includes(gender)}
                      onChange={() =>
                        handleFilterChange("genderPreference", [gender])
                      }
                      className="appearance-none w-4 h-4 rounded-full border-2 border-black checked:bg-black checked:border-[#4A7F79] checked:border-4 transition-all"
                    />
                    <span className="text-lg text-black">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear
              </button>
              <button
                onClick={seeResults}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Filters;
