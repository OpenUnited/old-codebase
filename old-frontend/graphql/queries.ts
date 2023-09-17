import gql from 'graphql-tag';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      owner
      website
      shortDescription
      fullDescription
      slug
      videoUrl
      isPrivate
      initiativeSet {
        id
      }
      attachment {
        name
        fileType
        path
      }
      availableTaskNum
      totalTaskNum
    }
  }
`

export const GET_PRODUCTS_SHORT = gql`
  query GetProducts {
    products {
      id
      name
      slug
    }
  }
`

export const GET_PRODUCT_INFO_BY_ID = gql`
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      owner
      photo
      name
      id
      name
      website
      shortDescription
      fullDescription
      slug
      videoUrl
      isPrivate
      initiativeSet {
        id
        name
      }
      attachment {
        name
        fileType
        path
      }
    }
  }
`

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      owner
      photo
      name
      id
      website
      shortDescription
      fullDescription
      slug
      videoUrl
      isPrivate
      initiativeSet {
        id
        name
      }
      attachment {
        name
        fileType
        path
      }
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks($input: TaskListInput) {
    tasklisting (input: $input) {
      id
      publishedId
      priority
      shortDescription
      title
      status
      initiative {
        id
        name
        videoUrl
      }
      inReview
      tags
      category
      expertise {
        id
        name
      }
      blocked
      hasActiveDepends
      videoUrl
      assignedToPerson {
        firstName
        slug
      }
      product {
        name
        slug
        owner
        videoUrl
      }
      challenge {
        id
        priority
      }
      reviewer {
        firstName
        username
      }
    }
  }
`;

export const GET_CAPABILITIES = gql`
  query GetCapabilities($productSlug: String) {
    capabilities(productSlug: $productSlug) {
      id
      name
      description
      videoLink
      breadcrumb {
        id
        name
      }
      product {
        id
        name
        website
      }
      children {
        id
        name
      }
      taskSet {
        id
        description
        status
      }
      attachment {
        name
        path
        fileType
      }
    }
  }
`;

export const GET_CAPABILITY_BY_ID = gql`
  query GetCapability($nodeId: Int!, $input: TaskListInput!) {
    capability(nodeId: $nodeId, input: $input) {
      capability {
        id
        name
        description
        videoLink
        previewVideoUrl
        attachments {
          id
          name
          path
          fileType
        }      
        product {
          name
          owner
          videoUrl
          shortDescription
        }
      }
      tasks {
        id
        publishedId
        priority
        shortDescription
        title
        status
        inReview
        initiative {
          id
          name
        }
        tags
        blocked
        hasActiveDepends
        assignedToPerson {
          firstName
          slug
        }
        reviewer {
          firstName
          username
        }
        product {
          name
          slug
          owner
        }
        challenge {
          id
        }
      }
    }
  }
`;


export const GET_INITIATIVES = gql`
  query GetInitiatives($productSlug: String, $input: InitiativeListInput!) {
    initiatives(productSlug: $productSlug, input: $input) {
      id
      name
      status
      product {
        id
        owner
        name
        website
      }
      taskTags {
        id
        name
      }
      availableTaskCount
      completedTaskCount
      videoUrl
    }
  }
`;


export const GET_INITIATIVES_SHORT = gql`
  query GetInitiatives($productSlug: String, $status: Int) {
    initiatives(productSlug: $productSlug,status: $status) {
      id
      name
    }
  }
`;

export const GET_INITIATIVE_BY_ID = gql`
query GetInitiative($id: Int!, $input: TaskListInput!) {
  initiative(id: $id, input: $input) {
    initiative {
      id
      name
      description
      status
      product {
        id
        name
        owner
        website
        shortDescription
        fullDescription
      }
      videoUrl
      previewVideoUrl
    }
    tasks {
      id
      publishedId
      priority
      shortDescription
      title
      status
      inReview
      initiative {
        id
        name
      }
      tags
      category
      expertise {
        id
        name
      }
      blocked
      hasActiveDepends
      assignedToPerson {
        firstName
        slug
      }
      reviewer {
        firstName
        username
      }
      product {
        name
        slug
        owner
      }
      challenge {
        id
      }
    }
  }
}
`;

export const GET_TASK_BY_ID = gql`
  query GetTask($productSlug: String!, $publishedId: Int!) {
    task(productSlug: $productSlug, publishedId: $publishedId) {
      id
      reviewer {
        slug
        firstName
      }
      publishedId
      canEdit
      priority
      title
      description
      shortDescription
      status
      inReview
      assignedTo {
        id
        firstName
        photo
        slug
      }
      attachment {
        id
        name
        fileType
        path
      }
      createdBy {
        id
        firstName
        slug
      }
      updatedBy {
        id
        firstName
        slug
      }
      hasActiveDepends
      capability {
        id
        name
      }
      initiative {
        id
        name
      }
      tag {
        id
        name
      }
      bounty {
        id
        skill {
            id
            name
        }
        expertise {
            id
            name
        }
        points
        status
        isActive
      }
      bountyClaim {
        id
        kind
        bounty {
          id
          status
          isActive
        }
        person {
            id
            firstName
            username
            slug
        }
      }
      skill
      dependOn {
        id
        title
        status
        publishedId
        dependOn {
          id
        }
        product {
          name
          owner
          slug
        }
        initiative {
          name
          id
        }
        assignedTo {
          id
          firstName
          slug
        }
        hasActiveDepends
      }
      relatives {
        title
        publishedId
        product {
          owner
          slug
        }
      }
      videoUrl
      previewVideoUrl
      contributionGuide {
        id
        title
        description
        skill {
          id
          name
        }
      } 
    }
    statusList
  }
`;

export const GET_TASKS_BY_PRODUCT = gql`
  query GetTasksByProduct($productSlug: String, $reviewId: Int, $input: TaskListInput) {
    tasklistingByProduct (productSlug: $productSlug, reviewId: $reviewId, input: $input) {
      id
      publishedId
      priority
      shortDescription
      title
      status
      inReview
      initiative {
        id
        name
        videoUrl
      }
      tags
      blocked
      hasActiveDepends
      videoUrl
      assignedToPerson {
        firstName
        slug
      }
      product {
        name
        slug
        owner
        videoUrl
      }
      challenge {
        id
        priority
      }
      reviewer {
        firstName
        username
      }
      category
      expertise {
        id
        name
      }
    }
  }
`;

export const GET_TASKS_BY_PRODUCT_COUNT = gql`
  query GetTasksByProductCount($productSlug: String, $input: TaskListInput) {
    tasklistingByProductCount (productSlug: $productSlug, input: $input) 
  }
`;

export const GET_TASKS_BY_PRODUCT_SHORT = gql`
  query GetTasksByProduct($productSlug: String, $input: TaskListInput) {
    tasklistingByProduct (productSlug: $productSlug, input: $input) {
      id
      publishedId      
      title
      challenge {
        id
      }
    }
  }
`;

export const GET_PRODUCT_PERSONS = gql`
  query GetProductPerson($productSlug: String) {
    productPersons(productSlug: $productSlug) {
      contributors {
        id
        firstName
        emailAddress
        photo
        slug
        headline
        personsocialSet {
          id
          name
          url
        }
      }
      productTeam {
        id
        firstName
        emailAddress
        photo
        slug
        headline
        personsocialSet {
          id
          name
          url
        }
      }
    }
  }
`

export const GET_PARTNERS = gql`
  query GetPartners($productSlug: String) {
    partners(productSlug: $productSlug) {
      organisation {
        name
        photo
      }
      product {
        owner
        name
      }
      person
    }
  }
`

export const GET_USERS = gql`
  query GetUsers ($hideTestUsers: Boolean, $showOnlyTestUsers: Boolean) {
    people (hideTestUsers: $hideTestUsers, showOnlyTestUsers: $showOnlyTestUsers) {
      id
      firstName
      slug
    }
  }
`;


export const GET_COMMENT_USERS = gql`
 query GetCommentUsers ($hideTestUsers: Boolean, $showOnlyTestUsers: Boolean, $startsWith: String) {
   commentPeople (hideTestUsers: $hideTestUsers, showOnlyTestUsers: $showOnlyTestUsers, startsWith: $startsWith) {
      id
      firstName
      slug
    }
 }
`

export const GET_PROFILES = gql`
  query GetProfiles {
    profile {
      person {
        id
        firstName
        emailAddress
        photo
        slug
      }
      overview
    }
  }
`

export const GET_PERSON_PROFILE = gql`
  query GetPersonProfile($personSlug: String) {
    personProfile(personSlug: $personSlug) {
      id
      person {
        id
        firstName
        emailAddress
        photo
        slug
        createdAt
        headline
        reviews: reviewSet {
          id
          product {
            id
            name
            owner
            website
            shortDescription
            fullDescription
          }
          score
          text
          createdBy {
            id
            firstName
          }
          createdAt
          updatedAt
        }
      }
      overview
      createdAt
      updatedAt
    }
  }
`;

export const GET_PERSON_SOCIALS = gql`
  query GetPersonSocials($personId: String!) {
    personSocials(personId: $personId) {
        name
        url
      }
  }
`;

export const GET_REVIEWS = gql`
  query GetReviews($personSlug: String) {
    reviews(personSlug: $personSlug) {
      id
      person {
        id
        firstName
        emailAddress
        photo
        slug
        createdAt
      }
      product {
        id
        name
        owner
        website
        shortDescription
        fullDescription
        videoUrl
        initiativeSet {
          id
          name
        }
      }
      score
      text
      createdBy {
        id
        firstName
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_REVIEW_BY_ID = gql`
  query GetReview($reviewId: Int!, $personSlug: String) {
    review(id: $reviewId, personSlug: $personSlug) {
      review {
        person {
          id
          firstName
          emailAddress
          photo
          slug
          createdAt
          headline
        }
        product {
          id
          slug
          name
          owner
          website
          shortDescription
          fullDescription
          videoUrl
          attachment {
            name
            fileType
            path
          }
          initiatives: initiativeSet {
            id
            name
          }
        }
        score
        text
        createdBy {
          id
          firstName
        }
        createdAt
        updatedAt
      }
      productReviews {
        id
        person {
          id
          firstName
          emailAddress
          photo
          slug
          headline
          person: productpersonSet {
            right
            product {
              name
            }
          }
        }
        product {
          id
          name
          owner
          website
          shortDescription
          fullDescription
          attachment {
            name
            fileType
            path
          }
        }
        score
        text
        createdBy {
          id
          firstName
          emailAddress
          photo
          slug
          headline
          person: productpersonSet {
            right
            product {
              name
            }
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_CAPABILITIES_BY_PRODUCT = gql`
  query GetCapabilities($productSlug: String!) {
    capabilities(productSlug: $productSlug)
  }
`;

export const GET_CAPABILITIES_BY_PRODUCT_AS_LIST = gql`
  query GetCapabilities($productSlug: String!) {
    capabilitiesAsList(productSlug: $productSlug) {
      id
      name
    }
  }
`;

export const GET_CAPABILITY_PARENT_CRUMBS = gql`
  query GetCapabilityParentCrumbs($nodeId: Int!) {
    capabilityParentCrumbs (nodeId: $nodeId)
  }
`;

export const GET_TAGS = gql`
  query GetTags($productSlug: String) {
    tags(productSlug: $productSlug) {
      id
      name
      createdAt
    }
  }
`;


export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($objectId: Int!) {
    challengeComments(objectId: $objectId)
  }
`;

export const GET_BUG_COMMENTS = gql`
  query GetBugComments($objectId: Int!) {
    bugComments(objectId: $objectId)
  }
`;

export const GET_IDEA_COMMENTS = gql`
  query GetIdeaComments($objectId: Int!) {
    ideaComments(objectId: $objectId)
  }
`;

export const GET_CAPABILITY_COMMENTS = gql`
  query GetCapabilityComments($objectId: Int!) {
    capabilityComments(objectId: $objectId)
  }
`;

export const GET_PERSON = gql`
  query GetPerson($id: String) {
    person (id: $id) {
      id
      firstName
      slug
      username
      productpersonSet {
        right
        product {
          name
          slug
        }
      }
      claimedTask {
        title
        link
      }
    }
  }
`;

export const GET_AM_LOGIN_URL = gql`
  query GetAMLink {
    getAuthmachineLoginUrl 
  }
`;

export const GET_AM_REGISTER_URL = gql`
  query GetAMLink {
    getAuthmachineRegisterUrl 
  }
`;

export const GET_LICENSE = gql`
  query GetLicense($productSlug: String!) {
   license(productSlug: $productSlug) {
     agreementContent
   }
 }
`;

export const GET_PRODUCT_IDEAS = gql`
  query GetProductIdeas($productSlug: String) {
    ideas(productSlug: $productSlug) {
      id
      ideaType
      headline
      description
      relatedCapability {
        id
        name
      }
      person {
        id
        slug
        firstName
        username
      }
      voteUp
    }
  }
`;

export const GET_PRODUCT_IDEA_BY_ID = gql`
  query GetProductIdeaById($id: Int) {
    idea(id: $id) {
      id
      ideaType
      headline
      description
      relatedCapability {
        id
        name
      }
      person {
        id
        firstName
        username
        slug
      }
      product {
        id
        slug
        name
      }
      voteUp
    }
  }
`;

export const GET_PRODUCT_BUG_BY_ID = gql`
  query GetProductIdeaById($id: Int) {
    bug(id: $id) {
      id
      bugType
      headline
      description
      relatedCapability {
        id
        name
      }
      person {
        id
        firstName
        username
        slug
      }
      product {
        id
        slug
        name
      }
      voteUp
    }
  }
`;

export const GET_PRODUCT_BUGS = gql`
  query GetProductBags($productSlug: String) {
    bugs(productSlug: $productSlug) {
      id
      bugType
      headline
      description
      relatedCapability {
        id
        name
      }
      person {
        id
        slug
        firstName
        username
      }
      voteUp
    }
  }
`;


export const GET_PAGE_CONTENT = gql`
  query GetPage($slug: String) {
    page(slug: $slug) {
      title
      description
    }
  }
`;

export const GET_CONTRIBUTOR_GUIDES = gql`
  query GetContributorGuides($productSlug: String!)  {
    contributorGuides(productSlug: $productSlug) {
      id
      title
      description
      skill {
        id
        name
      }
    }
  }
`;

export const GET_BOUNTY_DELIVERY_ATTEMPT = gql`
  query GetTaskDeliveryAttempt($id: Int!) {
    attempt(id: $id) {
      id,
      kind,
      createdAt,
      deliveryMessage,
      isCanceled,
      attachments {
        id,
        path,
        fileType,
        name
      },
      bountyClaim {
        id
        kind
        bounty {
          id
          points
          status
          isActive
          challenge {
            id, 
            title
          }
        }
      },
    }
  }
`;

export const GET_CATEGORIES_LIST = gql`
  query GetCategoriesList {
    taskCategoryListing
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories
  }
`;

export const GET_EXPERTISES_LIST = gql`
  query GetExpertisesList {
    expertisesListing
  }
`;


export const GET_PERSON_INFO = gql `
  query GetPersonInfo ($personSlug: String!) {
    personInfo (personSlug: $personSlug) {
      id
      firstName
      bio
      avatar
      slug
      skills {
        category
        expertise
      }
      websites {
        type
        website
      }
      websiteTypes
      preferences {
        sendMeChallenges
      }
    }
  }
`;

// export const GET_PERSON_DONE_TASKS = gql `
//   query GetPersonDoneTasks ($page: Int!, $personSlug: String!) {
//     personTasks (page: $page, personSlug: $personSlug) {
//       page
//       pages
//       hasNext
//       hasPrev
//       tasks {
//         id
//         title
//         date
//         link
//         skills {
//           category
//           expertise
//         }
//         reviewerPerson {
//           id
//           firstName
//           avatar
//           link
//         }
//         product {
//           name
//           avatar
//           link
//         }
//         initiative {
//           name
//           link
//         }
//       }
//     }
//   }
// `;

export const GET_PERSON_DONE_TASKS = gql `
  query GetPersonDoneTasks ($personSlug: String!) {
    personTasks (personSlug: $personSlug) {
      id
      title
      date
      link
      skill {
        id
        name
      }
      expertise {
        id
        name
      }
      reviewerPerson {
        id
        firstName
        avatar
        link
      }
      product {
        name
        avatar
        link
      }
      initiative {
        name
        link
      }
    }
  }
`;

export const GET_PERSON_TASK_DELIVERY_MESSAGE = gql`
  query GetPersonDelivery ($taskId: Int!, $personSlug: String!) {
    personTaskDeliveryMessage (taskId: $taskId, personSlug: $personSlug) {
      message
      attachments {
        name
        path
        fileType
      }
    }
  }
`;

export const GET_LOGGED_IN_USER = gql`
  query GetPerson {
    loggedInUser {
      id
      slug
      username
    }
  }
`;
