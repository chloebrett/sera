import Link from 'next/link';
import queryString from 'query-string';
import { CLIENT_ID, REDIRECT_URI } from '../config';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

interface NavBarProps {
  backButtonVisible?: boolean
}

export const NavBar = ({ backButtonVisible }: NavBarProps) => {
  {
    const params = {
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
    };

    const queryStringified = queryString.stringify(params);

    const handleBackClick = () => {
      var referrer = document.referrer;
      window.open(referrer ? referrer : window.location.origin);
    };

    const backButton = 
      <a className="min-w-fit" onClick={() => handleBackClick()}>
          <ArrowBackIosIcon sx={{ cursor: "pointer" }}></ArrowBackIosIcon>Back
      </a>

    return (
      <div>
        <div className="flex py-4 font-semibold min-h-12">
          {backButtonVisible ? backButton : ''}
          <div className="flex justify-end w-full gap-x-5">
            <Link href={'/'}>Home</Link>
            <Link href={'/about'}>About</Link>
            <Link href={'/favourites'}>Favourites</Link>
            <Link href={`/submit`}>Submit content</Link>
            <Link
              href={`https://github.com/login/oauth/authorize?${queryStringified}`}
            >
              Log in with Github
            </Link>
          </div>
        </div>
      </div>
    );
  }
};
