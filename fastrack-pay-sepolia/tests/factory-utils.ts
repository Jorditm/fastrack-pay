import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  CompanyAccountCreated,
  CustomerAccountCreated,
  OwnershipTransferred
} from "../generated/Factory/Factory"

export function createCompanyAccountCreatedEvent(
  _contract: Address
): CompanyAccountCreated {
  let companyAccountCreatedEvent = changetype<CompanyAccountCreated>(
    newMockEvent()
  )

  companyAccountCreatedEvent.parameters = new Array()

  companyAccountCreatedEvent.parameters.push(
    new ethereum.EventParam("_contract", ethereum.Value.fromAddress(_contract))
  )

  return companyAccountCreatedEvent
}

export function createCustomerAccountCreatedEvent(
  _contract: Address
): CustomerAccountCreated {
  let customerAccountCreatedEvent = changetype<CustomerAccountCreated>(
    newMockEvent()
  )

  customerAccountCreatedEvent.parameters = new Array()

  customerAccountCreatedEvent.parameters.push(
    new ethereum.EventParam("_contract", ethereum.Value.fromAddress(_contract))
  )

  return customerAccountCreatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
