/* eslint-disable react/no-danger */
const React = require('react');
const T = React.PropTypes;

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
