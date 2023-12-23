import { useEffect } from "react";
import axios from "axios";
import CardBackground from "../assets/card_bg.jpg";
import Tilt from "react-vanilla-tilt";

export function Cards({
  handleCardClick,
  setAllCards,
  setCardsLeft,
  lose,
  allData,
  setAllData,
  cardIsActive,
  setCardIsActive,
  win,
  currentRound,
  handleSecondSideCardClick,
}) {
  const CatApi = `https://api.thecatapi.com/v1/images/search?limit=${currentRound}&api_key=${
    import.meta.env.VITE_CatApiKey
  }`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(CatApi);
        setAllData(res.data);
        const cardIds = res.data.map((data) => data.id);
        setAllCards(cardIds);
        setCardsLeft(cardIds);
      } catch (err) {
        console.log("Error fetching data: ", err);
      }
    };
    fetchData();
  }, [setAllCards, lose, setCardIsActive, win]);

  return (
    <div className="flex flex-row card-wrap items-center justify-center mt-8">
      {allData.map((data) => (
        <Tilt key={data.id} className="!p-0 !max-h-80 !w-60 !rounded-xl">
          <img
            onClick={() => handleSecondSideCardClick()}
            className={`card rounded-xl max-h-80 min-h-80 card-shadow transition-transform tiltcard hover:cursor-pointer ${
              cardIsActive ? "hidden" : ""
            }`}
            src={CardBackground}
          />
          <img
            onClick={() => handleCardClick(data)}
            className={`card rounded-xl max-h-80 min-h-80 card-shadow tiltcard hover:cursor-pointer ${
              cardIsActive ? "" : "hidden"
            }`}
            key={data.id}            
            src={data.url}
            //
          />
        </Tilt>
      ))}
    </div>
  );
}
