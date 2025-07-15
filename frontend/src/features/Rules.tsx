import RuleProposals from "./rules/RuleProposals";

function Rules({ governmentAddress }: { governmentAddress: `0x${string}` }) {
  return (
    <>
      <RuleProposals address={governmentAddress} />
    </>
  );
}

export default Rules;
