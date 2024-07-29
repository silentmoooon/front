import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import React, { useContext } from 'react'

export default (props)=>{
  const { amountsMissing, fixedAmount } = useContext(ChangableAmountContext)
  const { slowRouting, selectedRoute } = useContext(PaymentRoutingContext)
  const { title } = useContext(ConfigurationContext)

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM TextLeft">
          <h1 className="LineHeightL FontSizeL">{ title || 'Payment' }</h1>
        </div>
      }
      alternativeHeaderAction={ props.alternativeHeaderAction }
      body={
        <div className="PaddingLeftM PaddingRightM PaddingBottomXS">
          { amountsMissing && !fixedAmount &&
            <div className="Card Skeleton">
              <div className="SkeletonBackground"/>
            </div>
          }
          <div className="Card Skeleton">
            <div className="SkeletonBackground"/>
          </div>
        </div>
      }
      footer={
        <div className={["PaddingTopXS PaddingRightM PaddingLeftM", ( selectedRoute == undefined && slowRouting ) ? 'PaddingBottomS' : 'PaddingBottomM'].join(' ')}>
          <div className="SkeletonWrapper">
            <div className="ButtonPrimary Skeleton">
              <div className="SkeletonBackground"/>
            </div>
          </div>
          { selectedRoute == undefined && slowRouting &&
            <div className="TextCenter Opacity05 PaddingTopS">
              <strong>Loading payment options...</strong>
            </div>
          }
        </div>
      }
    />
  )
}
