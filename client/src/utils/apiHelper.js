export const api = (path, method = "GET", body = null, credentials = null) => {
  const url = "http://localhost:5000/api" + path;
  const options = {
    method: method,
    //the header we provide depends on what we're sending in the fetch method
    headers: {},
  };
  //ADDING BODY AND CREDENTIALS TO OUR FETCH CALLS WHEN NEEDED
  if (body) {
    options.body = JSON.stringify(body);
    options.headers["Content-Type"] = "application/json; charset=utf-8";
  }
  if (credentials) {
    const encodedCredentials = btoa(
      `${credentials.username}:${credentials.password}`
    );
    options.headers.Authorization = `Basic ${encodedCredentials}`;
  }
  return fetch(url, options);
};
