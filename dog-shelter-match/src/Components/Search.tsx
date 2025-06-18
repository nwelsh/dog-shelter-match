import { useEffect, useState, useCallback, useRef } from "react";
import "./Search.scss";
import DogCard from "./DogCard";
import gsap from "gsap";

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const pageSize = 9;

const fetchBreeds = async (): Promise<string[]> => {
  const res = await fetch(
    "https://frontend-take-home-service.fetch.com/dogs/breeds",
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch breeds");
  return res.json();
};

const fetchDogDetails = async (ids: string[]): Promise<Dog[]> => {
  const res = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ids),
  });
  if (!res.ok) throw new Error("Failed to fetch dog details");
  return res.json();
};

const fetchSearchResults = async (
  selectedBreed: string,
  sortOrder: "asc" | "desc",
  currentPage: number
): Promise<{ dogs: Dog[]; total: number }> => {
  const queryParams = new URLSearchParams();
  if (selectedBreed) queryParams.append("breeds", selectedBreed);
  queryParams.append("sort", `breed:${sortOrder}`);
  queryParams.append("size", String(pageSize));
  queryParams.append("from", String(currentPage * pageSize));

  const searchRes = await fetch(
    `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`,
    { credentials: "include" }
  );
  if (!searchRes.ok) throw new Error("Failed to fetch search results");
  const searchData = await searchRes.json();

  const dogDetails = await fetchDogDetails(searchData.resultIds);

  return { dogs: dogDetails, total: searchData.total };
};

const fetchMatch = async (favoriteIds: string[]): Promise<Dog | null> => {
  const res = await fetch(
    "https://frontend-take-home-service.fetch.com/dogs/match",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(favoriteIds),
    }
  );
  if (!res.ok) throw new Error("Failed to get a match");
  const data: { match: string } = await res.json();

  const matchedDogs = await fetchDogDetails([data.match]);
  return matchedDogs.length > 0 ? matchedDogs[0] : null;
};

const SearchPage = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [matchDog, setMatchDog] = useState<Dog | null>(null);
  const cardRefs = useRef([]);

  const totalPages = Math.ceil(total / pageSize);

  console.log(favorites, favorites.length);

  useEffect(() => {
    fetchBreeds()
      .then(setBreeds)
      .catch(() => console.error("Failed to fetch breeds"));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchSearchResults(selectedBreed, sortOrder, currentPage)
      .then(({ dogs, total }) => {
        setDogs(dogs);
        setTotal(total);
      })
      .catch(() => setError("Failed to fetch dogs"))
      .finally(() => setLoading(false));
  }, [selectedBreed, sortOrder, currentPage]);

  const toggleFavorite = useCallback((dogId: string) => {
    setFavorites((prev) =>
      prev.includes(dogId)
        ? prev.filter((id) => id !== dogId)
        : [...prev, dogId]
    );
  }, []);

  const handleMakeMatch = useCallback(async () => {
    if (favorites.length === 0) {
      alert("Please favorite some dogs first!");
      return;
    }

    try {
      const matchedDog = await fetchMatch(favorites);
      if (matchedDog) {
        setMatchDog(matchedDog);
        setShowFavoritesOnly(false);
      } else {
        alert("Matched dog details not found");
      }
    } catch (error) {
      alert("Error matching dogs: " + error);
    }
  }, [favorites]);

  const displayedDogs = showFavoritesOnly
    ? dogs.filter((dog) => favorites.includes(dog.id))
    : dogs;

  useEffect(() => {
    gsap.from(cardRefs.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
    });
  }, [displayedDogs]);

  const handleCloseMatch = () => {
    setMatchDog(null);
  };

  return (
    <div className="search-container">
      <h2 className="title">Find Your Perfect Match</h2>
      <div className="search-controls">
        <label className="sort-select">
          Filter by Breed:
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            className="select-label"
          >
            <option value="">All Breeds</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed} className="select-option">
                {breed}
              </option>
            ))}
          </select>
        </label>

        <label className="sort-select">
          Sort:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="select-label"
          >
            <option value="asc" className="select-option">
              Breed (A-Z)
            </option>
            <option value="desc" className="select-option">
              Breed (Z-A)
            </option>
          </select>
        </label>

        <button
          onClick={() => setShowFavoritesOnly((prev) => !prev)}
          className="button"
        >
          {showFavoritesOnly ? "Show All Dogs" : "Show Favorited Dogs"}
        </button>

        <button
          onClick={handleMakeMatch}
          disabled={favorites.length === 0}
          className="button"
        >
          Match Me!
        </button>

        {matchDog && (
          <div className="match-container">
            <div className="match-card">
              <DogCard
                dog={matchDog}
                isFavorite={favorites.includes(matchDog.id)}
                onToggleFavorite={() => {}} // or your handler if you want
                isMatch={true}
                onClose={handleCloseMatch} // <-- pass the close handler here
              />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <p className="loading-text">Loading dogs...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="grid-container">
          <div className="dog-grid">
            {displayedDogs.length === 0 ? (
              <p className="paragraph">
                {showFavoritesOnly
                  ? "No favorited dogs yet! Click on a card to favorite a dog."
                  : "No dogs found :("}
              </p>
            ) : (
              displayedDogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  isFavorite={favorites.includes(dog.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            )}
          </div>

          {!showFavoritesOnly && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <p className="paragraph">
                Page {currentPage + 1} of {totalPages}
              </p>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={(currentPage + 1) * pageSize >= total}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
