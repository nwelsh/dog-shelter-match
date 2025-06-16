// components/DogCard.tsx
import "./DogCard.scss";
import classNames from "classnames";

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dogId: string) => void;
  isMatch?: boolean;
}

const DogCard = ({ dog, isFavorite, onToggleFavorite, isMatch = false }: DogCardProps) => {
  const {img, name, breed, age, zip_code, id} = dog || {};


  return (
    <div className="dog-card" onClick={() => onToggleFavorite(id)}>
    {isMatch && <p>x</p>}
      <img className={classNames("image", { "image--match": isMatch })} src={img} alt={`Photo of ${name}`} />
      <div className="description-container">
        <h3 className="name">{name}</h3>
        <p className="description">
          <strong>Breed:</strong> {breed}
        </p>
        <p className="description">
          <strong>Age:</strong> {age}
        </p>
        <p className="description">
          <strong>Zip Code:</strong> {zip_code}
        </p>

        <button
          className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
          onClick={() => onToggleFavorite(id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
};

export default DogCard;
