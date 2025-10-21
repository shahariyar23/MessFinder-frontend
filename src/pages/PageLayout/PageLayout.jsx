// components/Layout/PageLayout.jsx
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router';
import { useMatches } from 'react-router';

export default function PageLayout({ children }) {
  const matches = useMatches();
  const location = useLocation();
  
  // Get the route handle (title and meta) from the current route
  const routeHandle = matches[matches.length - 1]?.handle || {};
  const { title = "Mess Finder", meta = {} } = routeHandle;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={window.location.href} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      {children}
    </>
  );
}