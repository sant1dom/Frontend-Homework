import MultiRangeSlider from "./MultiRangeSlider";

const Filter = ({ genres, languages, onGenreChange, onLanguageChange, onStartYearChange, onEndYearChange }) => {

  return (
    <div className="mx-8 mb-8">
      <div className="grid grid-cols-2 sm:flex space-x-4 md:flex space-x-4 xl:flex space-x-4">
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
            <option key="allgenres" value="">All Genres</option>
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
            <option key="alllanguages" value="">All Languages</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        <MultiRangeSlider min={1900} max={2024} onMinYearChange={onStartYearChange} onMaxYearChange={onEndYearChange}/>

      </div>
    </div>
  );
};

export default Filter;