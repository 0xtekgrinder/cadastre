import { ethers } from "ethers";
import Spinner from "react-bootstrap/Spinner";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FlowingBalance } from "./profile/FlowingBalance";
import { sfSubgraph } from "../redux/store";
import { NETWORK_ID } from "../lib/constants";
import { truncateEth } from "../lib/truncate";

interface FundsRaisedCounterProps {
  beneficiaryAddress: string;
}

function FundsRaisedCounter(props: FundsRaisedCounterProps) {
  const { beneficiaryAddress } = props;

  const { isLoading, data } = sfSubgraph.useAccountTokenSnapshotsQuery(
    {
      chainId: NETWORK_ID,
      filter: {
        account: beneficiaryAddress,
      },
    },
    {
      pollingInterval: 5000,
      skip: !beneficiaryAddress,
    }
  );

  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      placement="bottom"
      overlay={
        <Tooltip>
          100% of the Network Fees collected from the Geo Web's land market are
          used to fund public goods. This is the total collected so far.
        </Tooltip>
      }
    >
      {isLoading || !data ? (
        <div className="d-flex justify-content-center me-4">
          <Spinner animation="border" role="status" variant="light"></Spinner>
        </div>
      ) : (
        <div className="me-4 fs-1 text-primary text-center">
          <FlowingBalance
            format={(x) =>
              truncateEth(ethers.utils.formatUnits(x), 4) + " ETHx"
            }
            accountTokenSnapshot={data.items[0]}
          />
          <div className="fs-6 text-light text-center">
            Public Goods Funding Raised
          </div>
        </div>
      )}
    </OverlayTrigger>
  );
}

export default FundsRaisedCounter;
