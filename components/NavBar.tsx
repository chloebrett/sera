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
    }

    const queryStringified = queryString.stringify(params);

    const backButton = 
      <div className="min-w-fit">
        <Link href={new URL(document.referrer)}>
          <a className=""><ArrowBackIosIcon sx={{ cursor: "pointer" }}></ArrowBackIosIcon>Back</a>
        </Link>
      </div>

    return (
      <div>
        <div className="flex py-4 font-semibold min-h-12">
          {backButtonVisible ? backButton : ""}
          <div className="flex justify-end w-full">
            {/* <div className='mx-4 mr-4'>
              <Link href={`https://github.com/login/oauth/authorize?${queryStringified}`}>Log in with Github</Link>
            </div>
            <div className='mx-4 mr-6'>
              <Link href={`/submit`}>Submit content</Link>
            </div> */}
            <Link href={"/favourites"}>Your favourites</Link>
          </div>
        </div>
      </div>
    )
  }
}