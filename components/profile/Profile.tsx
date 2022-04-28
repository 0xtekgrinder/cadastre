import React from "react";
import { ethers } from "ethers";
import { truncateStr, truncateEth } from "../../lib/truncate";
import ProfileModal from "./ProfileModal";
import { sfApi } from "../../redux/store";
import { NETWORK_ID, NETWORK_NAME } from "../../lib/constants";
import { FlowingBalance } from "./FlowingBalance";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";

type ProfileProps = {
  account: string;
  disconnectWallet: () => Promise<void>;
  paymentTokenAddress?: string;
};

function Profile({
  account,
  disconnectWallet,
  paymentTokenAddress,
}: ProfileProps) {
  const [showProfile, setShowProfile] = React.useState(false);
  const handleCloseProfile = () => setShowProfile(false);
  const handleShowProfile = () => setShowProfile(true);

  const { isLoading, data } = paymentTokenAddress
    ? sfApi.useGetRealtimeBalanceQuery({
        chainId: NETWORK_ID,
        accountAddress: account,
        superTokenAddress: paymentTokenAddress,
        estimationTimestamp: undefined,
      })
    : { isLoading: true, data: null };

  return (
    <>
      {/* <Badge
        pill
        bg="info"
        className="mr-4 py-2 px-3 text-light"
      >
        <span style={{ fontWeight: 600 }}>{NETWORK_NAME}</span>
      </Badge> */}
      <ButtonGroup className="bg-dark border-secondary">
        <Button
          variant="secondary"
          disabled={showProfile}
          onClick={handleShowProfile}
          className="text-light"
        >
          {isLoading || data == null ? (
            <Spinner animation="border" role="status"></Spinner>
          ) : (
            <>
              <FlowingBalance
                format={(x) =>
                  truncateEth(ethers.utils.formatUnits(x), 3) + " ETHx"
                }
                balanceWei={data.availableBalanceWei}
                flowRateWei={data.netFlowRateWei}
                balanceTimestamp={data.timestamp}
              />
              <ProfileModal
                balanceData={data}
                account={account}
                showProfile={showProfile}
                handleCloseProfile={handleCloseProfile}
                disconnectWallet={disconnectWallet}
              />
            </>
          )}
        </Button>
        <Button
          variant="outline-secondary"
          disabled={showProfile}
          onClick={handleShowProfile}
          className="text-light bg-dark"
        >
          {truncateStr(account, 14)} <Image src="./ProfileIcon.png" />
        </Button>
      </ButtonGroup>
    </>
  );
}

export default Profile;
