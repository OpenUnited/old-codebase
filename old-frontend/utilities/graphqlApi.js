const api = () => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const graphql = JSON.stringify({
    query: `mutation UpdateCapability($input: CapabilityInput!, $id: Int!) {
      updateCapability(input: $input, id: $id) {
        capability {
          id
        }
      }
    }`,
    variables: {
      input: {
        id: node.id,
        name: node.title,
        parent: nextParentNode.id,
        product: { id: productId }
      },
      id: node.id
    }
  });
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: graphql,
    redirect: 'follow',
  };

  return fetch("http://localhost:8000/graphql", requestOptions)
    .then(response => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error;
    });
}