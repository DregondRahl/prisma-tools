export default `
#{import}

#{exportTs}const #{Model}SyncSubscription = subscriptionField('sync#{Model}', {
  type: '#{ModelName}',
  subscribe(_root, _args, ctx) {
    return ctx.pubsub.asyncIterator('sync#{Model}')
  },
  resolve(payload: any) {
    return payload
  },
})
#{exportJs}
`;
