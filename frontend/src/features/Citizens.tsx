import ListCitizens from "./citizens/ListCitizens";
import CreateCitizen from "./citizens/CreateCitizen";

function CitizenList() {
  return (
    <div>
      <CreateCitizen />
      <ListCitizens
        govAddress={process.env.REACT_APP_GOVERNMENT_ADDRESS as `0x${string}`}
      />
    </div>
  );
}

export default CitizenList;
