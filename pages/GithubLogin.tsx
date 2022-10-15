import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useLocalStorage from "use-local-storage";

const GithubLogin = ({}) => {
  const router = useRouter();

  const [authData, setAuthData] = useLocalStorage("githubAuth", "");

  useEffect(() => {
    const { code } = router.query;

    console.log('code', code);

    if (code === undefined) {
      return;
    }

    const getAuthData = async () => {
      const { data } = await axios.get(`/api/githubLogin?code=${code}`);
      return data.data;
    };

    getAuthData().then((data) => {
      setAuthData(data);
    });
  }, [router, setAuthData]);

  useEffect(() => {
    if (authData === "" || (authData as any).error) {
      return;
    }

    console.log(authData);

    router.push('/');
  }, [router, authData]);

  return (
    <div>
      Redirecting...
    </div>
  );
};

export default GithubLogin;
