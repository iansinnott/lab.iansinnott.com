/* eslint-disable react/no-danger */
const React = require('react');
const T = React.PropTypes;

const ga = `
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-36494368-3', 'auto');
  ga('send', 'pageview');

`.trim();

const Analytics = () => (
  <script dangerouslySetInnerHTML={{ __html: ga }} />
);

const Html = ({ title = 'Amazing Default Title', body, manifest }) => {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>{title}</title>
        <link rel='stylesheet' href={manifest['app.css']} />
      </head>
      <body>
        {/* Putting analytisc first since we set up the `ga` script within app.js */}
        <Analytics />
        <div id='root' dangerouslySetInnerHTML={{ __html: body }} />
        <script src={manifest['vendor.js']} />
        <script src={manifest['app.js']} />
      </body>
    </html>
  );
};

Html.propTypes = {
  title: T.string,
  body: T.string,
  manifest: T.object.isRequired,
};

module.exports = Html;
