import ListCitizens from "./citizens/ListCitizens";
import CreateCitizen from "./citizens/CreateCitizen";
import { useEffect } from "react";

function CitizenList() {

  return (
    <div>
      <CreateCitizen
        govAddress={process.env.REACT_APP_GOVERNMENT_ADDRESS as `0x${string}`}
      />
      <ListCitizens
        govAddress={process.env.REACT_APP_GOVERNMENT_ADDRESS as `0x${string}`}
      />
    </div>
  );
}

export default CitizenList;
