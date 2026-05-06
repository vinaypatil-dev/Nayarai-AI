const query=`{
  resourcePageCollection(limit: 1) {
    items {
      resourcesCollection {
        items {
          sys {
            publishedAt
          }
          title
          country
          shortDescription
          productType
          resourceType
          media {
            url
          }
          videoUrl
        }
      }
    }
  }
}`