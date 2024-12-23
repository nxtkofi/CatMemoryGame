import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import CardBackground from "../assets/card_bg.jpg";
import Tilt from "react-parallax-tilt";
import ReactCardFlip from "react-card-flip";
import { CardType } from "../types";
import CatWithFavorite from "./CatWithFavorite";
import useWin from "../hooks/useWin";

type CardsProps = {
  handleBackCardClick: () => void;
  handleCardClick: (data: CardType) => void;
  setCardsLeft: Dispatch<SetStateAction<string[]>>;
  cardsLeft: string[];
  lose: boolean;
  allData: CardType[];
  setAllData: Dispatch<SetStateAction<CardType[]>>;
  cardIsActive: boolean;
  currentRound: number;
};

export function Cards({
  handleBackCardClick,
  handleCardClick,
  setCardsLeft,
  lose,
  allData,
  setAllData,
  cardIsActive,
  currentRound,
}: CardsProps) {
  const { win } = useWin();
  const [favoriteChosen, setFavoriteChosen] = useState<boolean>(false);
  const chunkSize = 3;
  const CatApi = `https://api.thecatapi.com/v1/images/search?limit=${currentRound}&api_key=${
    import.meta.env.VITE_CatApiKey
  }`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(CatApi);
        console.log(res.data);
        setAllData(res.data);
        const cardIds = res.data.map((data: CardType) => data.id);
        setCardsLeft(cardIds);
      } catch (err) {
        console.log("Error fetching data: ", err);
      }
    };
    fetchData();
  }, [lose, win]);
  const chunkedData = Array.from(
    { length: Math.ceil(allData.length / chunkSize) },
    (_, index) => allData.slice(index * chunkSize, (index + 1) * chunkSize),
  );
  useEffect(() => {
    setFavoriteChosen(false);
  }, [lose, win]);

  return (
    <div className="flex flex-col justify-center mt-8 md:mt-0 items-center md:h-full">
      {chunkedData.map((chunk, index) => (
        <div
          className="flex justify-center items-center flex-row mx-2"
          key={`chunk-${index}`}
        >
          {chunk.map((data: CardType) => (
            <Tilt
              tiltMaxAngleX={15}
              tiltMaxAngleY={15}
              key={data.id}
              className="!p-0 my-2 mx-2 md:my-4 md:mx-4 background-color !rounded-md aspect-[3/4] md:max-h-60 md:min-h-60 lg:max-h-80 lg:min-h-80"
            >
              <ReactCardFlip
                flipDirection="horizontal"
                isFlipped={cardIsActive}
              >
                <img
                  onClick={() => handleBackCardClick()}
                  className="aspect-[3/4] max-h-36 min-h-36 md:min-h-60 md:max-h-60 lg:max-h-80 lg:min-h-80 rounded-md card-shadow hover:cursor-pointer"
                  src={CardBackground}
                />
                <CatWithFavorite
                  favoriteChosen={favoriteChosen}
                  setFavoriteChosen={setFavoriteChosen}
                  url={data.url}
                  catId={data.id}
                  handleCardClick={() => handleCardClick(data)}
                />
              </ReactCardFlip>
            </Tilt>
          ))}
        </div>
      ))}
    </div>
  );
}
