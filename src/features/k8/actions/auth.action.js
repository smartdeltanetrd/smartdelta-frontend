import k8sEndpoints from "network/endpoints/k8s";

const authenticateK8S = async (provider, credentials, authMethod, snackbar) => {
  try {
    console.log(`AUTH`, `provider`, provider, `credentials`, credentials, `authMethod`, authMethod);

    const response = await k8sEndpoints.authenticate({
      provider,
      credentials,
      authMethod,
    });
    const { data } = response;
    console.log("Authentication result:", data);

    snackbar.openSnackbar(data.message, "success", data.info);

    return { 
      isAuthenticated: true,
      provider: data.provider,
      credentials: data.credentials,
      authMethod: data.authMethod 
    };
  } catch (error) {
    const { data } = error.response;
    const { message, info } = data;
    snackbar.openSnackbar(message, "error", info);
    return { isAuthenticated: false };
  }
};

export default authenticateK8S;
