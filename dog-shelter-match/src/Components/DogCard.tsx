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
      <div
        className={classNames("dog-card", { "dog-card--match": isMatch })}
        ref={ref}
        onClick={() => onToggleFavorite(id)}
      >
        {isMatch && (
          <p className="exit-button" onClick={() => !isMatch}>
            X
          </p>
        )}
        <button
          className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
          onClick={() => onToggleFavorite(id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
  width="20"
  height="18.5"
  viewBox="-2 -2 36 34"
  fill={isFavorite ? "red" : "none"}
  stroke="currentColor"
  strokeWidth="3"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="heart-icon"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M23.6,0c-3.4,0-6.4,2.2-7.6,5.3C14.8,2.2,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4
       c0,9.4,16,21.2,16,21.2s16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z"
  />
</svg>
        </button>
        <img
          className={classNames("image", { "image--match": isMatch })}
          src={img}
          alt={`Photo of ${name}`}
        />
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
  }
);

export default DogCard;
