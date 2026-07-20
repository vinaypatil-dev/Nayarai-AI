// @deprecated: Keep for backward compatibility; replaced by root resourcesCollection queries in Phase 4. Remove in Phase 5.
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