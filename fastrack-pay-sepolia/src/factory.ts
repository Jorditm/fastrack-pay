import {
  CompanyAccountCreated as CompanyAccountCreatedEvent,
  CustomerAccountCreated as CustomerAccountCreatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/Factory/Factory"
import {
  CompanyAccountCreated,
  CustomerAccountCreated,
  OwnershipTransferred
} from "../generated/schema"

export function handleCompanyAccountCreated(
  event: CompanyAccountCreatedEvent
): void {
  let entity = new CompanyAccountCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._contract = event.params._contract

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCustomerAccountCreated(
  event: CustomerAccountCreatedEvent
): void {
  let entity = new CustomerAccountCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._contract = event.params._contract

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
