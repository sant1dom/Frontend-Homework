const Filter = ({ genres, languages, onGenreChange, onLanguageChange, onStartYearChange, onEndYearChange }) => {
  return (
    <div className="ml-8 mb-8">
      <div className="flex space-x-4">
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <select
            id="genre"
            name="genre"
            onChange={(e) => onGenreChange(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            id="language"
            name="language"
            onChange={(e) => onLanguageChange(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
          >
            <option value="">All Languages</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="startYear" className="block text-sm font-medium text-gray-700">
            Start Year
          </label>
          <input
            type="number"
            id="startYear"
            name="startYear"
            onChange={(e) => onStartYearChange(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="endYear" className="block text-sm font-medium text-gray-700">
            End Year
          </label>
          <input
            type="number"
            id="endYear"
            name="endYear"
            onChange={(e) => onEndYearChange(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Filter;