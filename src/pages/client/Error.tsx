import { useRouteError } from 'react-router-dom';

interface RouteError {
  status: number;
  statusText: string;
  internal: boolean;
  data: string;
  error: Error;
}

const ErrorPage = () => {
  const error = useRouteError() as RouteError;

  return (
    <article className="flex flex-col items-center justify-center w-full h-screen space-y-8 bg-secondary">
      <h1>Oops!</h1>
      <h2>Sorry, an unexpected error has occurred.</h2>
      <footer>
        <p>
          <i>{error.statusText}</i>
        </p>
      </footer>
    </article>
  );
};
export default ErrorPage;
