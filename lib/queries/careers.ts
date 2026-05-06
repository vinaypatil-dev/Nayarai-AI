const careersQuery = `{
  careersPageCollection{
    items{
      jobsCollection{
        items{
          title
          shortDescription
          jobDescription
          skills
          jobId
          jobLocation
          jobType
        }
      }
    }
  }
}`