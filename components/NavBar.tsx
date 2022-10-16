import Link from 'next/link';
import queryString from 'query-string';
import { CLIENT_ID, REDIRECT_URI } from '../config';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

interface NavBarProps {
  backButtonVisible: boolean;
}

export const NavBar = ({ backButtonVisible }: NavBarProps) => {
  {
    const params = {
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
    };

    const queryStringified = queryString.stringify(params);

    const backClick = () => {
      history.back();
    };

    const backButton = '';
    {
      /*
      <div className="min-w-fit">
        <Link href="" onClick={() => backClick()}>
          <a className=""><ArrowBackIosIcon sx={{ cursor: "pointer" }}></ArrowBackIosIcon>Back</a>
        </Link>
      </div>
    */
    }

    return (
      <div>
        <div className="flex py-4 font-semibold min-h-12">
          {backButtonVisible ? backButton : ''}
          <div className="flex justify-end w-full gap-x-5">
            <Link href={'/'}>Home</Link>
            <Link href={'/about'}>About</Link>
            <Link href={'/favourites'}>Favourites</Link>
            <Link href={`/submit`}>Submit content</Link>
          </div>
        </div>
      </div>
    );
  }
};
