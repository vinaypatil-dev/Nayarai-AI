export interface Job {
  title: string;
  shortDescription: string;
  jobId: string;
  jobLocation: string;
  jobType: string;
  jobDescription: string | null;
  skills: string[] | null;
}

export interface CareersPageResponse {
  data: {
    careersPageCollection: {
      items: {
        jobsCollection: {
          items: Job[];
        };
      }[];
    };
  };
}

export interface ResourceItem {
  sys?: {
    publishedAt: string;
  };
  title: string;
  country: string;
  shortDescription: string;
  productType: string;
  resourceType: string;
  videoUrl: string | null;
  sourceUrl?: string | null;
  media: {
    url: string;
  } | null;
}

export interface ResourcePageResponse {
  data: {
    resourcePageCollection: {
      items: {
        resourcesCollection: {
          items: ResourceItem[];
        };
      }[];
    };
  };
}
