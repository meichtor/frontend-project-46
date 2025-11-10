const jsonFormatter = (tree) => {
  const getDiff = node => node
    .flatMap((node) => {
      const { key: property, value, type, children } = node

      switch (type) {
        case 'nested': {
          return {
            property,
            children: getDiff(children),
            type,
          }
        }

        case 'changed': {
          return {
            property,
            value: {
              old: node.oldValue,
              new: node.newValue,
            },
            type,
          }
        }

        default: {
          return {
            property,
            value,
            type,
          }
        }
      }
    })

  return JSON.stringify(getDiff(tree))
}

export { jsonFormatter }
