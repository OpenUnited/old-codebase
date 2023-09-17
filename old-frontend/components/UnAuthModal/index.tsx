import {Modal} from 'antd';

const showUnAuthModal = (actionName: string, loginUrl="/", registerUrl="/", reloadAfterClose=false) => {

  const signInAction = () => {
    saveRedirectPath();
    modal.destroy();
    window.location.replace(loginUrl);
  }

  const saveRedirectPath = () => {
    localStorage.setItem("redirectTo", window.location.pathname);
  };

  const registerAction = () => {
    saveRedirectPath();
    modal.destroy();
    window.location.replace(registerUrl);
  }

  const checkPageReload = () => {
    if(reloadAfterClose) {
      // reset user data from localstorage
      localStorage.removeItem("userId");
      localStorage.removeItem("firstName");
      
      // then reload current page
      window.location.reload();
    }
  }

  const modal = Modal.info({
    title: "Sign In or Register",
    closable: true,
    content: (
      <div>
        <p>In order to {actionName.toLowerCase()}, you need to be signed in.</p>

        <p>Existing Users: <a href={undefined} onClick={() => signInAction()}>Sign in here</a></p>

        <p>New to OpenUnited? <a href={undefined} onClick={() => registerAction()}>Register here</a></p>
      </div>
    ),
    okButtonProps: { disabled: true, style: {display: "none"} },
    onCancel: checkPageReload,
  })
};

export default showUnAuthModal;