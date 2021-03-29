export default `
#{import}

#{exportTs}const #{Model}FindPaginationQuery = queryField('find#{Model}Pagination', {
  type: nonNull('#{ModelName}Pagination'),
  args: {
    where: '#{Model}WhereInput',
    orderBy: list('#{Model}OrderByInput'),
    cursor: '#{Model}WhereUniqueInput',
    distinct: '#{Model}ScalarFieldEnum',
    skip: 'Int',
    take: 'Int',
  },
  async resolve(_parent, args, {prisma, select}) {
    return {
      count: await prisma.#{model}.count({
        where: args.where,
        ...select.count,
      }),
      records: await prisma.#{model}.findMany({
        ...args,
        ...select.records,
      }),
    };
  },
});

export const #{Model}Pagination = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: '#{Model}Pagination',
  definition(t) {
    t.int('count')
    t.list.field('records', {
      type: '#{Model}',
    })
  },
})
#{exportJs}
`;
