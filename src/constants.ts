const constants = {
  invite_statuses: {
    pending: 0,
    ready: 1,
    delivered: 2,
    in_progress: 3,
    complete: 4,
    expired: 5,
    payment_pending: 6
  },
  contact_statuses: {
    pending: 0,
    confirmed: 1
  },
  statuses: {
    pending: 0,
    confirmed: 1,
    cancelled: 2,
    received:  3,
    failed: 4
  },
  message_types: {
    message: 0,
    confirmation: 1,
    invoice: 2,
    payment: 3,
    cancellation: 4,
    direct_payment: 5,
    attachment: 6,
    purchase: 7,
    purchase_accept: 8,
    purchase_deny: 9,
    contact_key: 10,
    contact_key_confirmation: 11,
    group_create: 12,
    group_invite: 13,
    group_join: 14,
    group_leave: 15,
    group_query: 16
  },
  payment_errors: {
    timeout: 'Timed Out',
    no_route: 'No Route To Receiver',
    error: 'Error',
    incorrect_payment_details: 'Incorrect Payment Details',
    unknown: 'Unknown'
  },
  chat_types: {
    conversation: 0,
    group: 1
  }
}

function switcher(consts){
  const codes = {}
  for (let [k, obj] of Object.entries(consts)) {
    for (let [str, num] of Object.entries(obj)) {
      if(!codes[k]) codes[k] = {}
      codes[k][num] = str
    }
  }
  // dont switch this one
  codes['payment_errors'] = consts['payment_errors']
  return codes
}

const constantCodes = switcher(constants)

export {
  constants, constantCodes
}
