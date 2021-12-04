import React, { useCallback } from 'react'
import { NFTFullPage, FullComponents } from '@zoralabs/nft-components'
import { AuctionManager, useManageAuction } from '@zoralabs/manage-auction-hooks'
import { useA11yIdPrefix } from '@zoralabs/nft-components/dist/utils/useA11yIdPrefix'
import { useMediaContext } from '@zoralabs/nft-components/dist/context/useMediaContext'
import { Web3ConfigProvider, useWalletButton } from "@zoralabs/simple-wallet-provider";
import {auctionId, nftId, nftContract, ipfsContentUrl} from './config'

const ConnectTrigger = () => {
  const { buttonAction, actionText, connectedInfo } = useWalletButton();

  return (
    <React.Fragment>
      {connectedInfo}
      <button onClick={() => buttonAction()}>{actionText}</button>
    </React.Fragment>
  );
};

const BidTrigger = ({auctionId}) => {
  const { active } = useWalletButton();
  const {openBidAuction} = useManageAuction()

  if(!active) {
    return null
  }

  return (
      <button onClick={e => openBidAuction(auctionId)}>Bid</button>
  );
}

export function App() {
  const a11yIdPrefix = useA11yIdPrefix("media");
  const { getStyles } = useMediaContext();

  const getContentData = useCallback((data, metadata) => {
    return {
      metadata: {...metadata, animation_url: ipfsContentUrl}
    }
  }, [])

  if(!auctionId || !nftId || !nftContract || !ipfsContentUrl) {
    throw new Error('missing required config vars.')
  }

  return (
    <Web3ConfigProvider networkId={1}>
      <AuctionManager renderMedia={() => null}>
        <div>
          <NFTFullPage useBetaIndexer={true} id={nftId} contract={nftContract}>
            <ConnectTrigger/>
            <BidTrigger auctionId={auctionId}/>
            <FullComponents.MediaFull a11yIdPrefix={a11yIdPrefix} getContentData={getContentData}/>
            <div {...getStyles("fullPageDataGrid")}>
              <FullComponents.MediaInfo />
              <FullComponents.AuctionInfo />
              <FullComponents.BidHistory />
            </div>
          </NFTFullPage>
        </div>
      </AuctionManager>
    </Web3ConfigProvider>
    )
}