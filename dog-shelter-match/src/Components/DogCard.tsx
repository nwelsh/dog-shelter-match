import "./DogCard.scss";
import classNames from "classnames";
import * as React from "react";

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

const DogCard = React.forwardRef<HTMLDivElement, DogCardProps>(
  ({ dog, isFavorite, onToggleFavorite, isMatch }, ref) => {
    const { img, name, breed, age, zip_code, id } = dog;

  return (
    <div className={classNames('dog-card', {'dog-card--match': isMatch})} ref={ref} onClick={() => onToggleFavorite(id)}>
    {isMatch && <p className="exit-button" onClick={() => !isMatch}>X</p>}
    <button
          className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
          onClick={() => onToggleFavorite(id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
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

       
      </div>
    </div>
  );
});

export default DogCard;
