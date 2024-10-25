import React, {useState} from 'react';
import { PokemonCard } from '../data/pokemonData';

interface CardProps {
  card: PokemonCard;
  owned: boolean;
  allowFlip: boolean; // Permet d'avoir une collection où les cartes sont toujours visibles
}

export const Card: React.FC<CardProps> = ({ card, owned, allowFlip}) => {
    const [hidden, setHidden] = useState(false || !allowFlip); // État pour suivre le flip
    const [clicked, setClicked] = useState(0); // État pour suivre le nombre de clics

    const handleClick = () => {
        if (owned && allowFlip) { // Si la carte est possédée et le flip est autorisé
            setClicked(clicked + 1); // Incrémente le nombre de clics
            if (clicked < 1) setHidden(!hidden); // Bascule le flip au premier clic
        } 
    };

    // Tilt effect based on mouse movement
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const cardElement = e.currentTarget;
        const cardRect = cardElement.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;
        const centerX = cardRect.left + cardWidth / 2;
        const centerY = cardRect.top + cardHeight / 2;
    
        // Calculate cursor distance from the center of the card
        const deltaX = (e.clientX - centerX) / (cardWidth / 2);
        const deltaY = (e.clientY - centerY) / (cardHeight / 2);
    
        // Set CSS variables to dynamically adjust the tilt effect and lifting
        const rotateX = -deltaY * 30; // Stronger tilt on Y-axis
        const rotateY = deltaX * 30;  // Stronger tilt on X-axis
        const lift = 20; // Adjust the lift distance (higher lift on hover)
    
        // Apply transformations: rotate based on cursor position and lift the card slightly
        cardElement.style.transform = `scale(1.3) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${lift}px)`;
    };



  
    // Reset tilt when the cursor leaves the card
    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const cardElement = e.currentTarget; // Get the current card element
        
        // Reset the tilt
        cardElement.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
    };

    return (
        <div className="card-container"> {/* Wrap everything in a single parent div */}
            <div
                className={`card ${hidden ? '' : 'hidden'}`}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ opacity: owned ? 1 : 0.4, 
                    pointerEvents: owned ? 'auto' : 'none'
                }}
            >
                <div className="card-front"
                    style={{ boxShadow: owned ? '' : '0 0 5px 0px rgba(255,255,255,0),0 55px 35px -20px rgba(0, 0, 0, 0.5)'}}
                >
                    <img src={card.image} alt={card.name} />
                </div>
                <div className="card-back">
                    <img src={card.backImage} alt={card.name} />
                </div>
            </div>
            {!allowFlip ? (
            <div className="card-info">
                <p>Card Name: {card.name}</p>
            </div>
            ) : null}
        </div>
    );
};

export default Card;