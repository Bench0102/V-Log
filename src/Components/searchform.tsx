import React, { useState } from "react";

interface SearchFormProps {
  onSearch: (searchTerm: string) => void; // Function to handle search
  onStatusFilter: (status: string) => void; // Function to handle status filter
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, onStatusFilter }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [selectedStatus, setSelectedStatus] = useState(""); // State for selected status

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    onSearch(searchTerm); // Call the onSearch function with the search term
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status === "View All" ? "" : status); // Reset status for "View All"
    onStatusFilter(status === "View All" ? "" : status); // Call the onStatusFilter function with the selected status
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <form className="max-w-lg min-w-xl mx-auto" onSubmit={handleSearch}>
      <div className="flex">
        {/* Dropdown Button */}
        <button
          id="dropdown-button"
          onClick={toggleDropdown}
          className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-green-300 focus:ring-4 focus:outline-none focus:ring-gray-100"
          type="button"
        >
          {selectedStatus || "Status"} {/* Display selected status or "Status" if none */}
          <svg
            className="w-2.5 h-2.5 ms-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            id="dropdown"
            className="z-10 absolute mt-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44"
          >
            <ul
              className="py-2 text-sm text-gray-700"
              aria-labelledby="dropdown-button"
            >
              <li>
                <button
                  type="button"
                  onClick={() => handleStatusSelect("Borrowed")}
                  className="inline-flex w-full px-4 py-2 hover:bg-green-300"
                >
                  Borrowed
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleStatusSelect("Overdue")}
                  className="inline-flex w-full px-4 py-2 hover:bg-green-300"
                >
                  Overdue
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleStatusSelect("Returned")}
                  className="inline-flex w-full px-4 py-2 hover:bg-green-300"
                >
                  Returned
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleStatusSelect("View All")}
                  className="inline-flex w-full px-4 py-2 hover:bg-green-300"
                >
                  View All
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by full name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            required
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-green-700 rounded-e-lg border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;